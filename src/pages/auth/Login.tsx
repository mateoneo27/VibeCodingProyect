import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { getUserRole } from '../../firebase/services';

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
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const role = await getUserRole(cred.user.uid);
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/tipo-usuario');
      }
    } catch {
      setError('Correo o contraseña incorrectos.');
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
            <h1 className="text-4xl font-extrabold tracking-tight text-[#191c21] font-headline mb-3">
              Inicia sesión
            </h1>
            <p className="text-[#424752]">Accede con tus credenciales de Neo.</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-[0_12px_32px_rgba(25,28,33,0.06)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#525f74] px-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="usuario@neo.com.pe"
                  className="w-full bg-[#e7e8f0] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#00478d] focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#525f74] px-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#e7e8f0] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#00478d] focus:bg-white transition-all outline-none"
                />
              </div>

              {error && (
                <p className="text-sm text-[#ba1a1a] bg-[#ffdad6] px-4 py-3 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-b from-[#00478d] to-[#005eb8] text-white font-headline font-bold rounded-2xl py-4 shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <p className="text-center text-sm text-[#424752] mt-6">
              ¿Primera vez?{' '}
              <Link to="/auth/register" className="text-[#00478d] font-bold hover:underline">
                Crea tu cuenta
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
