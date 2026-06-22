from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, UploadFile, File, Form, Query
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import io
import json
import uuid
import shutil
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Optional

from auth_utils import hash_password, verify_password, create_access_token, decode_token
from models import (
    UserCreate, UserUpdate, UserInDB, UserPublic, LoginRequest, LoginResponse, ChangePasswordRequest,
    QuoteCreate, Quote, QuoteStatusUpdate,
    MessageCreate, Message, MessageReply,
    ProjectCreate, Project,
    ServiceCreate, Service,
    SimulationCreate, Simulation,
    VisitCreate, Visit,
    Media, AuditLog,
    SiteSettings, SiteSettingsUpdate,
)

ROOT_DIR = Path(__file__).parent
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title='Synergie Construction API')
api_router = APIRouter(prefix='/api')
security = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Serve uploaded files
app.mount('/uploads', StaticFiles(directory=str(UPLOADS_DIR)), name='uploads')


# ----------------------- AUTH DEPENDENCIES -----------------------
async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> UserInDB:
    if not credentials:
        raise HTTPException(status_code=401, detail='Non authentifié')
    payload = decode_token(credentials.credentials)
    if not payload or 'sub' not in payload:
        raise HTTPException(status_code=401, detail='Token invalide')
    user = await db.users.find_one({'id': payload['sub']})
    if not user:
        raise HTTPException(status_code=401, detail='Utilisateur introuvable')
    if not user.get('active', True):
        raise HTTPException(status_code=403, detail='Compte désactivé')
    user.pop('_id', None)
    return UserInDB(**user)


async def require_role(*roles: str):
    async def _check(user: UserInDB = Depends(get_current_user)) -> UserInDB:
        if user.role not in roles and user.role != 'super_admin':
            raise HTTPException(status_code=403, detail='Accès refusé')
        return user
    return _check


def require_super_admin(user: UserInDB = Depends(get_current_user)) -> UserInDB:
    if user.role != 'super_admin':
        raise HTTPException(status_code=403, detail='Super Admin requis')
    return user


def require_admin(user: UserInDB = Depends(get_current_user)) -> UserInDB:
    if user.role not in ('super_admin', 'admin'):
        raise HTTPException(status_code=403, detail='Administrateur requis')
    return user


async def log_action(user: UserInDB, action: str, target: str = None, details: dict = None, ip: str = None):
    log = AuditLog(user_id=user.id, user_email=user.email, action=action, target=target, details=details, ip=ip)
    await db.audit_logs.insert_one(log.model_dump())


def _clean(doc: dict) -> dict:
    if doc:
        doc.pop('_id', None)
    return doc


# ----------------------- AUTH ROUTES -----------------------
@api_router.post('/auth/login', response_model=LoginResponse)
async def login(payload: LoginRequest, request: Request):
    user = await db.users.find_one({'email': payload.email.lower()})
    if not user or not verify_password(payload.password, user.get('password_hash', '')):
        raise HTTPException(status_code=401, detail='Email ou mot de passe incorrect')
    if not user.get('active', True):
        raise HTTPException(status_code=403, detail='Compte désactivé')
    await db.users.update_one({'id': user['id']}, {'$set': {'last_login': datetime.utcnow()}})
    user['last_login'] = datetime.utcnow()
    token = create_access_token({'sub': user['id'], 'email': user['email'], 'role': user['role']})
    ip = request.client.host if request.client else None
    await db.audit_logs.insert_one(AuditLog(
        user_id=user['id'], user_email=user['email'], action='login', ip=ip
    ).model_dump())
    return LoginResponse(access_token=token, user=UserPublic(**user))


@api_router.get('/auth/me', response_model=UserPublic)
async def me(user: UserInDB = Depends(get_current_user)):
    return UserPublic(**user.model_dump())


@api_router.post('/auth/change-password')
async def change_password(payload: ChangePasswordRequest, user: UserInDB = Depends(get_current_user)):
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail='Mot de passe actuel incorrect')
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail='Le nouveau mot de passe doit faire au moins 8 caractères')
    await db.users.update_one({'id': user.id}, {'$set': {'password_hash': hash_password(payload.new_password)}})
    await log_action(user, 'change_password')
    return {'ok': True}


# ----------------------- PUBLIC ROUTES -----------------------
@api_router.post('/public/quotes', response_model=Quote)
async def submit_quote(payload: QuoteCreate, request: Request):
    quote = Quote(**payload.model_dump())
    await db.quotes.insert_one(quote.model_dump())
    return quote


@api_router.post('/public/messages', response_model=Message)
async def submit_message(payload: MessageCreate):
    msg = Message(**payload.model_dump())
    await db.messages.insert_one(msg.model_dump())
    return msg


@api_router.post('/public/simulations', response_model=Simulation)
async def submit_simulation(payload: SimulationCreate):
    ref = 'SIM-' + str(int(datetime.utcnow().timestamp()))[-8:]
    sim = Simulation(**payload.model_dump(), reference=ref)
    await db.simulations.insert_one(sim.model_dump())
    return sim


@api_router.post('/public/visits')
async def track_visit(payload: VisitCreate, request: Request):
    ip = request.client.host if request.client else None
    visit = Visit(**payload.model_dump(), ip=ip)
    await db.visits.insert_one(visit.model_dump())
    return {'ok': True}


@api_router.get('/public/projects')
async def list_public_projects():
    items = await db.projects.find({'published': True}).sort('created_at', -1).to_list(500)
    return [_clean(i) for i in items]


@api_router.get('/public/services')
async def list_public_services():
    items = await db.services.find({'published': True}).sort('order', 1).to_list(100)
    return [_clean(i) for i in items]


@api_router.get('/public/settings')
async def public_settings():
    s = await db.settings.find_one({'id': 'main'})
    return _clean(s) if s else SiteSettings().model_dump()


@api_router.get('/')
async def root():
    return {'message': 'Synergie Construction API', 'version': '1.0'}


# ----------------------- ADMIN: DASHBOARD -----------------------
@api_router.get('/admin/dashboard')
async def admin_dashboard(user: UserInDB = Depends(get_current_user)):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)

    visits_total = await db.visits.count_documents({})
    visits_today = await db.visits.count_documents({'created_at': {'$gte': today}})
    quotes_total = await db.quotes.count_documents({})
    quotes_new = await db.quotes.count_documents({'status': 'nouveau'})
    messages_total = await db.messages.count_documents({})
    messages_new = await db.messages.count_documents({'status': 'nouveau'})
    projects_total = await db.projects.count_documents({})
    projects_published = await db.projects.count_documents({'published': True})
    simulations_total = await db.simulations.count_documents({})
    services_total = await db.services.count_documents({})

    # Monthly chart (last 6 months)
    months = []
    for i in range(5, -1, -1):
        m_start = (today.replace(day=1) - timedelta(days=30 * i)).replace(day=1, hour=0, minute=0, second=0)
        m_next = (m_start.replace(day=28) + timedelta(days=4)).replace(day=1)
        q_count = await db.quotes.count_documents({'created_at': {'$gte': m_start, '$lt': m_next}})
        v_count = await db.visits.count_documents({'created_at': {'$gte': m_start, '$lt': m_next}})
        s_count = await db.simulations.count_documents({'created_at': {'$gte': m_start, '$lt': m_next}})
        months.append({
            'month': m_start.strftime('%b %Y'),
            'quotes': q_count, 'visits': v_count, 'simulations': s_count,
        })

    # Top pages
    pipeline = [
        {'$group': {'_id': '$path', 'count': {'$sum': 1}}},
        {'$sort': {'count': -1}},
        {'$limit': 6},
    ]
    top_pages_raw = await db.visits.aggregate(pipeline).to_list(10)
    top_pages = [{'path': p['_id'] or '/', 'count': p['count']} for p in top_pages_raw]

    recent_quotes = await db.quotes.find().sort('created_at', -1).limit(5).to_list(5)
    recent_messages = await db.messages.find().sort('created_at', -1).limit(5).to_list(5)

    return {
        'stats': {
            'visits': {'total': visits_total, 'today': visits_today},
            'quotes': {'total': quotes_total, 'new': quotes_new},
            'messages': {'total': messages_total, 'new': messages_new},
            'projects': {'total': projects_total, 'published': projects_published},
            'simulations': {'total': simulations_total},
            'services': {'total': services_total},
        },
        'months': months,
        'top_pages': top_pages,
        'recent_quotes': [_clean(q) for q in recent_quotes],
        'recent_messages': [_clean(m) for m in recent_messages],
    }


# ----------------------- ADMIN: QUOTES -----------------------
@api_router.get('/admin/quotes')
async def list_quotes(
    user: UserInDB = Depends(get_current_user),
    status: Optional[str] = None,
    service: Optional[str] = None,
    q: Optional[str] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
):
    query = {}
    if status:
        query['status'] = status
    if service:
        query['service'] = service
    if q:
        query['$or'] = [
            {'name': {'$regex': q, '$options': 'i'}},
            {'email': {'$regex': q, '$options': 'i'}},
            {'phone': {'$regex': q, '$options': 'i'}},
        ]
    if from_date or to_date:
        rng = {}
        if from_date:
            rng['$gte'] = datetime.fromisoformat(from_date)
        if to_date:
            rng['$lte'] = datetime.fromisoformat(to_date)
        query['created_at'] = rng
    items = await db.quotes.find(query).sort('created_at', -1).to_list(2000)
    return [_clean(i) for i in items]


@api_router.get('/admin/quotes/export')
async def export_quotes(user: UserInDB = Depends(get_current_user)):
    from openpyxl import Workbook
    items = await db.quotes.find().sort('created_at', -1).to_list(5000)
    wb = Workbook()
    ws = wb.active
    ws.title = 'Devis'
    ws.append(['Date', 'Référence', 'Service', 'Nom', 'Email', 'Téléphone', 'Statut', 'Détails'])
    for q in items:
        ws.append([
            q.get('created_at').strftime('%Y-%m-%d %H:%M') if q.get('created_at') else '',
            q.get('id', '')[:8],
            q.get('service_title') or q.get('service', ''),
            q.get('name', ''),
            q.get('email', ''),
            q.get('phone', ''),
            q.get('status', ''),
            json.dumps(q.get('values', {}), ensure_ascii=False),
        ])
    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    await log_action(user, 'export_quotes')
    return StreamingResponse(
        buf,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers={'Content-Disposition': 'attachment; filename=devis-' + datetime.utcnow().strftime('%Y%m%d') + '.xlsx'}
    )


@api_router.patch('/admin/quotes/{quote_id}')
async def update_quote(quote_id: str, payload: QuoteStatusUpdate, user: UserInDB = Depends(get_current_user)):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    upd['updated_at'] = datetime.utcnow()
    res = await db.quotes.update_one({'id': quote_id}, {'$set': upd})
    if res.matched_count == 0:
        raise HTTPException(404, 'Devis introuvable')
    await log_action(user, 'update_quote', quote_id, upd)
    doc = await db.quotes.find_one({'id': quote_id})
    return _clean(doc)


@api_router.delete('/admin/quotes/{quote_id}')
async def delete_quote(quote_id: str, user: UserInDB = Depends(require_admin)):
    await db.quotes.delete_one({'id': quote_id})
    await log_action(user, 'delete_quote', quote_id)
    return {'ok': True}


# ----------------------- ADMIN: MESSAGES -----------------------
@api_router.get('/admin/messages')
async def list_messages(user: UserInDB = Depends(get_current_user), status: Optional[str] = None, q: Optional[str] = None):
    query = {}
    if status:
        query['status'] = status
    if q:
        query['$or'] = [
            {'name': {'$regex': q, '$options': 'i'}},
            {'email': {'$regex': q, '$options': 'i'}},
            {'message': {'$regex': q, '$options': 'i'}},
        ]
    items = await db.messages.find(query).sort('created_at', -1).to_list(2000)
    return [_clean(i) for i in items]


@api_router.patch('/admin/messages/{msg_id}')
async def update_message(msg_id: str, payload: MessageReply, user: UserInDB = Depends(get_current_user)):
    upd = {'status': payload.status}
    if payload.reply:
        upd['reply'] = payload.reply
        upd['replied_at'] = datetime.utcnow()
    res = await db.messages.update_one({'id': msg_id}, {'$set': upd})
    if res.matched_count == 0:
        raise HTTPException(404, 'Message introuvable')
    await log_action(user, 'reply_message', msg_id)
    return _clean(await db.messages.find_one({'id': msg_id}))


@api_router.delete('/admin/messages/{msg_id}')
async def delete_message(msg_id: str, user: UserInDB = Depends(require_admin)):
    await db.messages.delete_one({'id': msg_id})
    await log_action(user, 'delete_message', msg_id)
    return {'ok': True}


# ----------------------- ADMIN: PROJECTS -----------------------
@api_router.get('/admin/projects')
async def admin_list_projects(user: UserInDB = Depends(get_current_user)):
    items = await db.projects.find().sort('created_at', -1).to_list(1000)
    return [_clean(i) for i in items]


@api_router.post('/admin/projects', response_model=Project)
async def create_project(payload: ProjectCreate, user: UserInDB = Depends(get_current_user)):
    p = Project(**payload.model_dump())
    await db.projects.insert_one(p.model_dump())
    await log_action(user, 'create_project', p.id)
    return p


@api_router.patch('/admin/projects/{pid}')
async def update_project(pid: str, payload: ProjectCreate, user: UserInDB = Depends(get_current_user)):
    upd = payload.model_dump()
    upd['updated_at'] = datetime.utcnow()
    res = await db.projects.update_one({'id': pid}, {'$set': upd})
    if res.matched_count == 0:
        raise HTTPException(404, 'Projet introuvable')
    await log_action(user, 'update_project', pid)
    return _clean(await db.projects.find_one({'id': pid}))


@api_router.delete('/admin/projects/{pid}')
async def delete_project(pid: str, user: UserInDB = Depends(require_admin)):
    await db.projects.delete_one({'id': pid})
    await log_action(user, 'delete_project', pid)
    return {'ok': True}


# ----------------------- ADMIN: SERVICES -----------------------
@api_router.get('/admin/services')
async def admin_list_services(user: UserInDB = Depends(get_current_user)):
    items = await db.services.find().sort('order', 1).to_list(200)
    return [_clean(i) for i in items]


@api_router.post('/admin/services', response_model=Service)
async def create_service(payload: ServiceCreate, user: UserInDB = Depends(get_current_user)):
    s = Service(**payload.model_dump())
    await db.services.insert_one(s.model_dump())
    await log_action(user, 'create_service', s.id)
    return s


@api_router.patch('/admin/services/{sid}')
async def update_service(sid: str, payload: ServiceCreate, user: UserInDB = Depends(get_current_user)):
    upd = payload.model_dump()
    upd['updated_at'] = datetime.utcnow()
    res = await db.services.update_one({'id': sid}, {'$set': upd})
    if res.matched_count == 0:
        raise HTTPException(404, 'Service introuvable')
    await log_action(user, 'update_service', sid)
    return _clean(await db.services.find_one({'id': sid}))


@api_router.delete('/admin/services/{sid}')
async def delete_service(sid: str, user: UserInDB = Depends(require_admin)):
    await db.services.delete_one({'id': sid})
    await log_action(user, 'delete_service', sid)
    return {'ok': True}


# ----------------------- ADMIN: SIMULATIONS -----------------------
@api_router.get('/admin/simulations')
async def list_simulations(user: UserInDB = Depends(get_current_user)):
    items = await db.simulations.find().sort('created_at', -1).to_list(2000)
    return [_clean(i) for i in items]


@api_router.get('/admin/simulations/export')
async def export_simulations(user: UserInDB = Depends(get_current_user)):
    from openpyxl import Workbook
    items = await db.simulations.find().sort('created_at', -1).to_list(5000)
    wb = Workbook()
    ws = wb.active
    ws.title = 'Simulations'
    ws.append(['Date', 'Référence', 'Type', 'Surface', 'Budget annoncé', 'Délai', 'Estimation basse', 'Estimation haute', 'Nom', 'Email', 'Téléphone'])
    for s in items:
        c = s.get('contact', {})
        ws.append([
            s.get('created_at').strftime('%Y-%m-%d %H:%M') if s.get('created_at') else '',
            s.get('reference', ''),
            s.get('project_type', ''),
            s.get('surface', ''),
            s.get('budget', ''),
            s.get('delai', ''),
            s.get('estimate_low', 0),
            s.get('estimate_high', 0),
            c.get('name', ''),
            c.get('email', ''),
            c.get('phone', ''),
        ])
    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    await log_action(user, 'export_simulations')
    return StreamingResponse(
        buf,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers={'Content-Disposition': 'attachment; filename=simulations-' + datetime.utcnow().strftime('%Y%m%d') + '.xlsx'}
    )


@api_router.delete('/admin/simulations/{sid}')
async def delete_simulation(sid: str, user: UserInDB = Depends(require_admin)):
    await db.simulations.delete_one({'id': sid})
    await log_action(user, 'delete_simulation', sid)
    return {'ok': True}


# ----------------------- ADMIN: USERS -----------------------
@api_router.get('/admin/users')
async def list_users(user: UserInDB = Depends(require_super_admin)):
    items = await db.users.find().sort('created_at', -1).to_list(200)
    return [{k: v for k, v in _clean(u).items() if k != 'password_hash'} for u in items]


@api_router.post('/admin/users')
async def create_user(payload: UserCreate, user: UserInDB = Depends(require_super_admin)):
    payload.email = payload.email.lower()
    existing = await db.users.find_one({'email': payload.email})
    if existing:
        raise HTTPException(400, 'Email déjà utilisé')
    if len(payload.password) < 8:
        raise HTTPException(400, 'Mot de passe trop court (8 minimum)')
    if payload.role not in ('super_admin', 'admin', 'editor'):
        raise HTTPException(400, 'Rôle invalide')
    u = UserInDB(**payload.model_dump(exclude={'password'}), password_hash=hash_password(payload.password))
    await db.users.insert_one(u.model_dump())
    await log_action(user, 'create_user', u.id, {'email': u.email})
    return UserPublic(**u.model_dump())


@api_router.patch('/admin/users/{uid}')
async def update_user(uid: str, payload: UserUpdate, user: UserInDB = Depends(require_super_admin)):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    if 'password' in upd:
        if len(upd['password']) < 8:
            raise HTTPException(400, 'Mot de passe trop court')
        upd['password_hash'] = hash_password(upd.pop('password'))
    if 'role' in upd and upd['role'] not in ('super_admin', 'admin', 'editor'):
        raise HTTPException(400, 'Rôle invalide')
    res = await db.users.update_one({'id': uid}, {'$set': upd})
    if res.matched_count == 0:
        raise HTTPException(404, 'Utilisateur introuvable')
    await log_action(user, 'update_user', uid)
    doc = await db.users.find_one({'id': uid})
    doc = _clean(doc)
    doc.pop('password_hash', None)
    return doc


@api_router.delete('/admin/users/{uid}')
async def delete_user(uid: str, user: UserInDB = Depends(require_super_admin)):
    if uid == user.id:
        raise HTTPException(400, 'Vous ne pouvez pas vous supprimer vous-même')
    await db.users.delete_one({'id': uid})
    await log_action(user, 'delete_user', uid)
    return {'ok': True}


# ----------------------- ADMIN: SETTINGS -----------------------
@api_router.get('/admin/settings')
async def get_settings(user: UserInDB = Depends(get_current_user)):
    s = await db.settings.find_one({'id': 'main'})
    if not s:
        s = SiteSettings().model_dump()
        await db.settings.insert_one(s)
    return _clean(s)


@api_router.put('/admin/settings')
async def update_settings(payload: SiteSettingsUpdate, user: UserInDB = Depends(require_admin)):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    upd['updated_at'] = datetime.utcnow()
    await db.settings.update_one({'id': 'main'}, {'$set': upd}, upsert=True)
    await log_action(user, 'update_settings')
    s = await db.settings.find_one({'id': 'main'})
    return _clean(s)


# ----------------------- ADMIN: MEDIA -----------------------
@api_router.post('/admin/media')
async def upload_media(
    file: UploadFile = File(...),
    folder: str = Form('general'),
    user: UserInDB = Depends(get_current_user),
):
    ext = Path(file.filename).suffix
    name = f"{uuid.uuid4().hex}{ext}"
    folder_path = UPLOADS_DIR / folder
    folder_path.mkdir(exist_ok=True, parents=True)
    file_path = folder_path / name
    with open(file_path, 'wb') as f:
        shutil.copyfileobj(file.file, f)
    size = file_path.stat().st_size
    url = f"/uploads/{folder}/{name}"
    media = Media(
        name=file.filename, url=url, mime=file.content_type or 'application/octet-stream',
        size=size, folder=folder, uploaded_by=user.email,
    )
    await db.media.insert_one(media.model_dump())
    return media


@api_router.get('/admin/media')
async def list_media(user: UserInDB = Depends(get_current_user), folder: Optional[str] = None, q: Optional[str] = None):
    query = {}
    if folder:
        query['folder'] = folder
    if q:
        query['name'] = {'$regex': q, '$options': 'i'}
    items = await db.media.find(query).sort('created_at', -1).to_list(500)
    return [_clean(i) for i in items]


@api_router.delete('/admin/media/{mid}')
async def delete_media(mid: str, user: UserInDB = Depends(get_current_user)):
    m = await db.media.find_one({'id': mid})
    if not m:
        raise HTTPException(404, 'Média introuvable')
    try:
        p = UPLOADS_DIR / m['folder'] / Path(m['url']).name
        if p.exists():
            p.unlink()
    except Exception as e:
        logger.warning(f"Failed to delete file: {e}")
    await db.media.delete_one({'id': mid})
    await log_action(user, 'delete_media', mid)
    return {'ok': True}


# ----------------------- ADMIN: AUDIT LOGS -----------------------
@api_router.get('/admin/audit-logs')
async def list_audit_logs(user: UserInDB = Depends(require_admin), limit: int = 200):
    items = await db.audit_logs.find().sort('created_at', -1).limit(limit).to_list(limit)
    return [_clean(i) for i in items]


# ----------------------- APP SETUP -----------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.on_event('startup')
async def startup_event():
    # Seed super admin
    existing = await db.users.find_one({'email': 'admin@synergieconstruction.com'})
    if not existing:
        admin = UserInDB(
            email='admin@synergieconstruction.com',
            name='Super Administrateur',
            role='super_admin',
            password_hash=hash_password('Synergie2025!'),
        )
        await db.users.insert_one(admin.model_dump())
        logger.info('Super admin seeded: admin@synergieconstruction.com')

    # Seed settings
    existing_settings = await db.settings.find_one({'id': 'main'})
    if not existing_settings:
        s = SiteSettings(socials=[
            {'name': 'Facebook', 'icon': 'Facebook', 'url': 'https://www.facebook.com/synergieconstruction'},
            {'name': 'Instagram', 'icon': 'Instagram', 'url': 'https://www.instagram.com/synergieconstruction'},
            {'name': 'LinkedIn', 'icon': 'Linkedin', 'url': 'https://www.linkedin.com/company/synergieconstruction'},
            {'name': 'WhatsApp', 'icon': 'MessageCircle', 'url': 'https://wa.me/221771658042'},
            {'name': 'YouTube', 'icon': 'Youtube', 'url': 'https://www.youtube.com/@synergieconstruction'},
            {'name': 'TikTok', 'icon': 'Music2', 'url': 'https://www.tiktok.com/@synergieconstruction'},
        ])
        await db.settings.insert_one(s.model_dump())
        logger.info('Site settings seeded')


@app.on_event('shutdown')
async def shutdown_db_client():
    client.close()
