import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '../components/layout/TopNavBar';
import { BottomNavBar } from '../components/layout/BottomNavBar';
import { useOnboarding } from '../context/OnboardingContext';
import { useAuth } from '../hooks/useAuth';
import { saveTipoUsuario } from '../firebase/services';
import type { TipoUsuario as TTipoUsuario } from '../types';

export default function TipoUsuario() {
  const navigate = useNavigate();
  const { setTipoUsuario } = useOnboarding();
  const { user } = useAuth();
  const [selected, setSelected] = useState<TTipoUsuario | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!selected || !user) return;
    setLoading(true);
    try {
      await saveTipoUsuario(user.uid, user.email!, selected);
      setTipoUsuario(selected);
      if (selected === 'planilla') {
        navigate('/planilla/datos-personales');
      } else {
        navigate('/trainee/datos-personales');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#f9f9ff] text-[#191c21] min-h-screen flex flex-col">
      <TopNavBar />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 max-w-5xl mx-auto w-full">
        {/* Progress */}
        <div className="w-full max-w-md mb-16">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs font-bold tracking-widest text-[#00478d] uppercase">Progreso</span>
            <span className="text-sm font-bold text-[#005149]">15%</span>
          </div>
          <div className="h-3 w-full bg-[#e1e2ea] rounded-full overflow-hidden">
            <div className="h-full w-[15%] bg-gradient-to-r from-[#40dccb] to-[#005149] rounded-full shadow-[0_0_12px_rgba(0,81,73,0.3)]" />
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#191c21] mb-4 font-headline">
            ¿Cuál es tu tipo de ingreso?
          </h1>
          <p className="text-[#424752] max-w-lg mx-auto text-lg">
            Selecciona la opción que mejor describa tu vinculación actual con la compañía.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Planilla */}
          <button
            onClick={() => setSelected('planilla')}
            className={`group relative flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-[0_12px_32px_rgba(25,28,33,0.06)] hover:scale-105 transition-all duration-300 border-2 ${
              selected === 'planilla' ? 'border-[#00478d]/60 shadow-xl' : 'border-transparent hover:border-[#00478d]/20'
            }`}
          >
            <div
              className={`mb-8 p-6 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                selected === 'planilla' ? 'bg-[#00478d] text-white' : 'bg-[#d6e3ff] text-[#00478d] group-hover:bg-[#00478d] group-hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
            </div>
            <h3 className="text-2xl font-bold text-[#191c21] mb-3 font-headline">NEO en Planilla</h3>
            <p className="text-[#58657a] text-sm leading-relaxed mb-6">
              Colaboradores con contrato fijo a tiempo completo y beneficios corporativos extendidos.
            </p>
            <div className={`mt-auto flex items-center gap-2 text-[#00478d] font-bold text-sm tracking-wide transition-opacity ${selected === 'planilla' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              SELECCIONADO <span className="material-symbols-outlined text-sm">check_circle</span>
            </div>
          </button>

          {/* Trainee */}
          <button
            onClick={() => setSelected('trainee')}
            className={`group relative flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-[0_12px_32px_rgba(25,28,33,0.06)] hover:scale-105 transition-all duration-300 border-2 ${
              selected === 'trainee' ? 'border-[#005149]/60 shadow-xl' : 'border-transparent hover:border-[#005149]/20'
            }`}
          >
            <div
              className={`mb-8 p-6 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                selected === 'trainee' ? 'bg-[#005149] text-white' : 'bg-[#d6e3fc] text-[#525f74] group-hover:bg-[#005149] group-hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <h3 className="text-2xl font-bold text-[#191c21] mb-3 font-headline">NEO Trainee</h3>
            <p className="text-[#58657a] text-sm leading-relaxed mb-6">
              Estudiantes o recién graduados en programa de formación técnica y profesional guiada.
            </p>
            <div className={`mt-auto flex items-center gap-2 text-[#005149] font-bold text-sm tracking-wide transition-opacity ${selected === 'trainee' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              SELECCIONADO <span className="material-symbols-outlined text-sm">check_circle</span>
            </div>
          </button>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <div className="flex-1 h-[2px] bg-[#c2c6d4]/20 hidden md:block" />
          <p className="text-xs font-medium tracking-widest uppercase text-[#424752] text-center">
            Información protegida por Neo Seguros
          </p>
          <div className="flex-1 h-[2px] bg-[#c2c6d4]/20 hidden md:block" />
        </div>
      </main>

      <BottomNavBar
        onBack={() => navigate(-1)}
        onNext={handleNext}
        nextDisabled={!selected || loading}
        nextLabel={loading ? 'Guardando...' : 'Next Step'}
        showProgress
        progressPercent={15}
      />
      <div className="h-24" />

      {/* Decorative blobs */}
      <div className="fixed top-1/4 -right-24 w-96 h-96 bg-[#d6e3ff]/20 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-1/4 -left-24 w-96 h-96 bg-[#65f9e7]/10 rounded-full blur-[120px] -z-10" />
    </div>
  );
}
