import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, Loader2, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

export default function AdminLogin() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@synergieconstruction.com');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      nav('/admin', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061629] via-[#0A2540] to-[#143560] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FFB800]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FFB800]/5 rounded-full blur-3xl" />

      <div className="relative bg-white shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#0A2540] p-6 flex items-center gap-4">
          <img src={logo} alt="SCG" className="h-14 w-auto object-contain" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#FFB800] font-semibold flex items-center gap-1.5">
              <ShieldCheck size={12} /> Espace Administrateur
            </div>
            <h1 className="font-heading text-xl font-extrabold text-white uppercase">Connexion</h1>
          </div>
        </div>

        <form onSubmit={submit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A2540] mb-2">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FFB800] focus:bg-white text-sm"
                placeholder="admin@synergieconstruction.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A2540] mb-2">Mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FFB800] focus:bg-white text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A2540]"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 text-sm">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-70">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Connexion...</> : <><LogIn size={16} /> Se connecter</>}
          </button>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Accès réservé aux administrateurs autorisés.<br />
              <a href="/" className="text-[#0A2540] font-semibold hover:text-[#FFB800]">← Retour au site</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
