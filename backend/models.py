from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid


def _uid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.utcnow()


# ---------------- USER ----------------
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str = 'editor'  # super_admin | admin | editor
    active: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    active: Optional[bool] = None
    password: Optional[str] = None


class UserInDB(UserBase):
    id: str = Field(default_factory=_uid)
    password_hash: str
    created_at: datetime = Field(default_factory=_now)
    last_login: Optional[datetime] = None


class UserPublic(UserBase):
    id: str
    created_at: datetime
    last_login: Optional[datetime] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserPublic


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# ---------------- QUOTE ----------------
class QuoteCreate(BaseModel):
    service: str = 'general'
    service_title: Optional[str] = None
    name: str
    email: str
    phone: str
    values: Dict[str, Any] = {}  # raw form field values
    source: str = 'website'


class Quote(QuoteCreate):
    id: str = Field(default_factory=_uid)
    status: str = 'nouveau'  # nouveau | en_cours | envoye | accepte | refuse
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class QuoteStatusUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


# ---------------- MESSAGE ----------------
class MessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str


class Message(MessageCreate):
    id: str = Field(default_factory=_uid)
    status: str = 'nouveau'  # nouveau | lu | archive | repondu
    reply: Optional[str] = None
    replied_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=_now)


class MessageReply(BaseModel):
    reply: str
    status: str = 'repondu'


# ---------------- PROJECT ----------------
class ProjectCreate(BaseModel):
    title: str
    category: str
    location: str
    year: int
    description: str
    image: Optional[str] = None
    images: List[str] = []
    images_before: List[str] = []
    images_after: List[str] = []
    documents: List[Dict[str, str]] = []  # {name, url, type}
    status: str = 'termine'  # en_etude | en_cours | termine
    featured: bool = False
    published: bool = True


class Project(ProjectCreate):
    id: str = Field(default_factory=_uid)
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


# ---------------- SERVICE ----------------
class ServiceCreate(BaseModel):
    title: str
    short: str
    description: str
    long_description: Optional[str] = ''
    image: Optional[str] = None
    hero_image: Optional[str] = ''  # Banner image on the detail page
    icon: str = 'Hammer'
    features: List[str] = []
    gallery: List[str] = []  # Additional images URLs
    sub_services: List[Dict[str, Any]] = []  # [{title, description, icon}]
    faqs: List[Dict[str, str]] = []  # [{question, answer}]
    cta_title: Optional[str] = ''
    cta_text: Optional[str] = ''
    cta_button_label: Optional[str] = 'Demander un devis'
    seo_title: Optional[str] = ''
    seo_description: Optional[str] = ''
    seo_og_image: Optional[str] = ''
    slug: str
    featured: bool = False
    published: bool = True
    order: int = 0


class Service(ServiceCreate):
    id: str = Field(default_factory=_uid)
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


# ---------------- SIMULATION ----------------
class SimulationCreate(BaseModel):
    project_type: str
    surface: str
    prestations: List[str] = []
    budget: str
    delai: str
    contact: Dict[str, Any] = {}
    estimate_low: float = 0
    estimate_high: float = 0
    months_low: int = 0
    months_high: int = 0
    recommended_services: List[str] = []


class Simulation(SimulationCreate):
    id: str = Field(default_factory=_uid)
    reference: str
    created_at: datetime = Field(default_factory=_now)


# ---------------- VISIT ----------------
class VisitCreate(BaseModel):
    path: str
    referrer: Optional[str] = None
    user_agent: Optional[str] = None


class Visit(VisitCreate):
    id: str = Field(default_factory=_uid)
    ip: Optional[str] = None
    created_at: datetime = Field(default_factory=_now)


# ---------------- MEDIA ----------------
class Media(BaseModel):
    id: str = Field(default_factory=_uid)
    name: str
    url: str
    mime: str
    size: int
    folder: str = 'general'
    uploaded_by: Optional[str] = None
    created_at: datetime = Field(default_factory=_now)


# ---------------- AUDIT LOG ----------------
class AuditLog(BaseModel):
    id: str = Field(default_factory=_uid)
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    action: str
    target: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    ip: Optional[str] = None
    created_at: datetime = Field(default_factory=_now)


# ---------------- SETTINGS ----------------
class SiteSettings(BaseModel):
    id: str = 'main'
    company_name: str = 'Synergie Construction Group'
    phone: str = '+221771658042'
    phone_display: str = '+221 77 165 80 42'
    whatsapp: str = '221771658042'
    email: str = 'contact@synergieconstruction.com'
    address: str = 'Parcelles Assainies, Dakar, Sénégal'
    hours: str = 'Lun-Ven: 8h-18h | Sam: 9h-13h'
    socials: List[Dict[str, str]] = []
    seo_title: str = 'Synergie Construction Group - Construction au Sénégal'
    seo_description: str = 'Entreprise de construction spécialisée en études, conception et réalisation de projets au Sénégal.'
    updated_at: datetime = Field(default_factory=_now)


class SiteSettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    phone: Optional[str] = None
    phone_display: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    hours: Optional[str] = None
    socials: Optional[List[Dict[str, str]]] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None


# ---------------- SIMULATOR CONFIG ----------------
class SimulatorConfig(BaseModel):
    id: str = 'main'
    project_types: List[Dict[str, Any]] = []
    surface_options: List[Dict[str, Any]] = []
    prestation_options: List[Dict[str, Any]] = []
    budget_options: List[Dict[str, Any]] = []
    delai_options: List[Dict[str, Any]] = []
    prestation_multiplier: float = 0.04
    estimate_low_factor: float = 0.9
    estimate_high_factor: float = 1.15
    updated_at: datetime = Field(default_factory=_now)


class SimulatorConfigUpdate(BaseModel):
    project_types: Optional[List[Dict[str, Any]]] = None
    surface_options: Optional[List[Dict[str, Any]]] = None
    prestation_options: Optional[List[Dict[str, Any]]] = None
    budget_options: Optional[List[Dict[str, Any]]] = None
    delai_options: Optional[List[Dict[str, Any]]] = None
    prestation_multiplier: Optional[float] = None
    estimate_low_factor: Optional[float] = None
    estimate_high_factor: Optional[float] = None


# ---------------- SLIDE ----------------
class SlideCreate(BaseModel):
    title: str
    subtitle: Optional[str] = ''
    text: Optional[str] = ''
    image: str
    button_label: Optional[str] = ''
    button_link: Optional[str] = ''
    order: int = 0
    active: bool = True


class Slide(SlideCreate):
    id: str = Field(default_factory=_uid)
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


# ---------------- TESTIMONIAL ----------------
class TestimonialCreate(BaseModel):
    name: str
    role: Optional[str] = ''
    content: str
    rating: int = 5
    image: Optional[str] = ''
    order: int = 0
    active: bool = True


class Testimonial(TestimonialCreate):
    id: str = Field(default_factory=_uid)
    created_at: datetime = Field(default_factory=_now)


# ---------------- FAQ ----------------
class FAQCreate(BaseModel):
    question: str
    answer: str
    category: Optional[str] = 'general'
    order: int = 0
    active: bool = True


class FAQ(FAQCreate):
    id: str = Field(default_factory=_uid)
    created_at: datetime = Field(default_factory=_now)


# ---------------- TEAM ----------------
class TeamMemberCreate(BaseModel):
    name: str
    role: str
    photo: Optional[str] = ''
    bio: Optional[str] = ''
    email: Optional[str] = ''
    phone: Optional[str] = ''
    socials: List[Dict[str, str]] = []
    order: int = 0
    active: bool = True


class TeamMember(TeamMemberCreate):
    id: str = Field(default_factory=_uid)
    created_at: datetime = Field(default_factory=_now)


# ---------------- PARTNER ----------------
class PartnerCreate(BaseModel):
    name: str
    logo: str
    url: Optional[str] = ''
    order: int = 0
    active: bool = True


class Partner(PartnerCreate):
    id: str = Field(default_factory=_uid)
    created_at: datetime = Field(default_factory=_now)


# ---------------- BLOG ----------------
class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = ''
    content: str  # Markdown
    cover_image: Optional[str] = ''
    category: Optional[str] = 'Actualités'
    tags: List[str] = []
    author: Optional[str] = ''
    seo_title: Optional[str] = ''
    seo_description: Optional[str] = ''
    og_image: Optional[str] = ''
    published: bool = False
    published_at: Optional[datetime] = None


class BlogPost(BlogPostCreate):
    id: str = Field(default_factory=_uid)
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)
    views: int = 0


# ---------------- MENU ITEM ----------------
class MenuItemCreate(BaseModel):
    label: str
    path: str
    parent_id: Optional[str] = None
    location: str = 'header'  # header | footer | mobile
    order: int = 0
    active: bool = True
    external: bool = False


class MenuItem(MenuItemCreate):
    id: str = Field(default_factory=_uid)
    created_at: datetime = Field(default_factory=_now)


# ---------------- CONTENT BLOCK ----------------
# Editable text/config per page section (key/value store)
class ContentBlockUpdate(BaseModel):
    key: str  # e.g. 'home.hero.badge', 'about.mission.title'
    value: Any
    page: Optional[str] = 'general'
    label: Optional[str] = ''


class ContentBlock(BaseModel):
    id: str = Field(default_factory=_uid)
    key: str
    value: Any
    page: str = 'general'
    label: str = ''
    updated_at: datetime = Field(default_factory=_now)
