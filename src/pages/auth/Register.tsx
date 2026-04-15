import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, setUserRole } from '../../lib/services';
import { supabase } from '../../lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setLoading(true);
    try {
      await signUp(email, password);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await setUserRole(user.id, email, 'user');
      navigate('/tipo-usuario');
    } catch (err: unknown) {
      const msg = (err as Error).message ?? '';
      if (msg.includes('already registered')) {
        setError('Este correo ya tiene una cuenta. Por favor inicia sesión.');
      } else {
        setError('No se pudo crear la cuenta. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] flex flex-col">
      <header className="sticky top-0 w-full z-50 bg-[#f9f9ff]/70 backdrop-blur-xl shadow-[0_12px_32px_rgba(25,28,33,0.06)]">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="text-2xl font-black tracking-tighter text-[#00478d] font-headline">Neo</div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-4 py-2 bg-[#d6e3fc] text-[#0e1c2e] font-label text-xs font-semibold uppercase tracking-widest rounded-full mb-4">
              NUEVO INGRESO
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#191c21] font-headline mb-3">
              Crea tu cuenta
            </h1>
            <p className="text-[#424752]">Regístrate para iniciar tu proceso de onboarding.</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-[0_12px_32px_rgba(25,28,33,0.06)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#525f74] px-1">Correo electrónico</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="usuario@neo.com.pe"
                  className="w-full bg-[#e7e8f0] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#00478d] focus:bg-white transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#525f74] px-1">Contraseña</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#e7e8f0] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#00478d] focus:bg-white transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#525f74] px-1">Confirmar contraseña</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="Repite tu contraseña"
                  className="w-full bg-[#e7e8f0] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#00478d] focus:bg-white transition-all outline-none" />
              </div>

              {error && <p className="text-sm text-[#ba1a1a] bg-[#ffdad6] px-4 py-3 rounded-xl">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-b from-[#00478d] to-[#005eb8] text-white font-headline font-bold rounded-2xl py-4 shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60">
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <p className="text-center text-sm text-[#424752] mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link to="/auth/login" className="text-[#00478d] font-bold hover:underline">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
