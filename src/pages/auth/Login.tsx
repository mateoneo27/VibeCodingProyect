import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, getUserRole } from '../../lib/services';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error();
      const role = await getUserRole(user.id);
      navigate(role === 'admin' ? '/admin' : '/tipo-usuario');
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F5FA] flex flex-col">
      <header className="sticky top-0 w-full z-50 bg-[#F6F5FA]/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,51,0.06)]">
        <div className="flex items-center px-8 py-3">
          <img src="/logo_neo.png" alt="NEO" className="h-10 w-auto" />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#000033] font-headline mb-3">
              Inicia sesión
            </h1>
            <p className="text-[#4D4D70]">Accede con tus credenciales de Neo.</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-[0_12px_32px_rgba(0,0,51,0.08)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="usuario@neo.com.pe"
                  className="w-full bg-[#f6f5fa] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0A29CD] focus:bg-white transition-all outline-none text-[#000033]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#f6f5fa] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0A29CD] focus:bg-white transition-all outline-none text-[#000033]"
                />
              </div>

              {error && (
                <p className="text-sm text-[#ba1a1a] bg-[#ffdad6] px-4 py-3 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A29CD] text-white font-headline font-bold rounded-2xl py-4 shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
