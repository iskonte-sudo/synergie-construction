import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, User, Clock } from 'lucide-react';
import api from '../../lib/api';
import { PageHeader, formatDate } from './Dashboard';
import './admin.css';

const ACTION_LABELS = {
  login: 'Connexion',
  change_password: 'Changement de mot de passe',
  update_quote: 'Modification devis',
  delete_quote: 'Suppression devis',
  export_quotes: 'Export devis',
  reply_message: 'Réponse message',
  delete_message: 'Suppression message',
  create_project: 'Création projet',
  update_project: 'Modification projet',
  delete_project: 'Suppression projet',
  create_service: 'Création service',
  update_service: 'Modification service',
  delete_service: 'Suppression service',
  export_simulations: 'Export simulations',
  delete_simulation: 'Suppression simulation',
  create_user: 'Création utilisateur',
  update_user: 'Modification utilisateur',
  delete_user: 'Suppression utilisateur',
  update_settings: 'Modification paramètres',
  delete_media: 'Suppression média',
};

export default function AdminAuditLogs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/audit-logs', { params: { limit: 300 } })
      .then(({ data }) => setItems(data))
      .catch(() => toast.error('Erreur'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Journal d'actions" subtitle={`${items.length} entrée(s) - Historique des opérations administrateur`} />

      <div className="adm-card overflow-hidden">
        {loading ? <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div> :
          items.length === 0 ? <div className="p-12 text-center text-slate-400">Aucune activité enregistrée</div> :
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {items.map((l) => (
              <div key={l.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                <div className="w-10 h-10 bg-[#FFB800]/15 flex items-center justify-center text-[#FFB800] shrink-0">
                  <User size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[#0A2540] dark:text-white">
                    {ACTION_LABELS[l.action] || l.action}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {l.user_email} {l.target && <span className="text-slate-400">• Cible: <code className="bg-slate-100 dark:bg-slate-800 px-1">{l.target.substring(0, 12)}...</code></span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500 flex items-center gap-1 justify-end"><Clock size={11} /> {formatDate(l.created_at)}</div>
                  {l.ip && <div className="text-[10px] text-slate-400 mt-1">IP: {l.ip}</div>}
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
