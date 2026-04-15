import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '../../components/layout/TopNavBar';
import { BottomNavBar } from '../../components/layout/BottomNavBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../hooks/useAuth';
import { saveOnboardingStep } from '../../lib/services';

export default function P4_ExamenMedico() {
  const navigate = useNavigate();
  const { state, setExamenMedico } = useOnboarding();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const examen = state.examenMedico;

  async function handleNext() {
    if (!user) return;
    setLoading(true);
    try {
      await saveOnboardingStep(user.id, { examenMedico: examen });
      navigate('/planilla/revision');
    } catch (e) {
      console.error('Error guardando examen médico:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#f9f9ff] text-[#191c21] min-h-screen flex flex-col pb-32">
      <TopNavBar />
      <main className="flex-grow container mx-auto px-6 pt-12">
        {/* Progress */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[#005149] font-headline font-extrabold text-sm tracking-widest uppercase">Paso 04 de 05</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#00478d] mt-2 font-headline">
                Examen Médico Ocupacional
              </h1>
            </div>
            <div className="text-right">
              <span className="font-headline font-bold text-[#00478d] text-2xl">75%</span>
              <p className="text-xs font-bold text-[#424752] uppercase tracking-tighter">Completado</p>
            </div>
          </div>
          <div className="h-3 w-full bg-[#e1e2ea] rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-[#40dccb] to-[#005149] w-[75%] rounded-full relative">
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#f2f3fb] p-10 rounded-[2rem] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#005eb8]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#00478d] text-3xl">medical_services</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#191c21] tracking-tight font-headline">Detalles del Examen</h2>
                </div>
                <p className="text-lg leading-relaxed text-[#424752]">
                  Se programará un examen médico ocupacional como parte del onboarding, el cuál es cubierto por{' '}
                  <span className="font-bold text-[#00478d]">Neo</span>. La atención es de lunes a sábados desde las{' '}
                  <span className="bg-[#d6e3fc] px-2 py-0.5 rounded text-[#3a475b] font-semibold italic">7:30 am</span>.
                </p>
                <div className="mt-8 flex items-start gap-4 p-5 bg-[#005149]/10 rounded-2xl border-l-4 border-[#005149]">
                  <span className="material-symbols-outlined text-[#005149]">info</span>
                  <p className="text-sm font-medium text-[#006b62] leading-snug">
                    Recuerda que para la toma de muestras, es obligatorio asistir{' '}
                    <span className="font-bold underline decoration-2">en ayunas</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="bg-white p-10 rounded-[2rem] shadow-[0_12px_32px_rgba(25,28,33,0.04)] border border-[#c2c6d4]/10">
              <label className="block text-sm font-bold text-[#424752] uppercase tracking-widest mb-4">
                Fecha y hora sugerida
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={examen.fechaSugerida}
                  onChange={(e) => setExamenMedico({ fechaSugerida: e.target.value })}
                  placeholder="Ej: Próximo martes, 8:00 AM"
                  className="w-full bg-[#e7e8f0] border-none rounded-xl px-6 py-5 text-lg font-medium focus:ring-2 focus:ring-[#00478d] focus:bg-white transition-all outline-none placeholder:text-[#727783]"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined text-[#727783]">calendar_today</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-[#727783] font-medium italic">
                Nos comentas qué día sería ideal para ti para poder programarlo.
              </p>
            </div>
          </div>

          {/* Right: location card */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-[#f2f3fb] rounded-[2rem] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-br from-[#005149] to-[#006b62] h-48 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-6xl opacity-50">local_hospital</span>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#005149]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#005149]">Ubicación</span>
                </div>
                <h3 className="text-2xl font-bold text-[#191c21] mb-4 font-headline">Clínica Respira</h3>
                <p className="text-[#424752] font-medium leading-relaxed mb-6">
                  Av. San Eugenio 899 Urb. Santa Catalina<br />
                  La Victoria, Lima
                </p>
                <div className="bg-[#e1e2ea] rounded-2xl p-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#005149]">schedule</span>
                  <span className="text-sm font-medium text-[#424752]">Lunes a Sábados desde las 7:30 am</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar
        onBack={() => navigate('/planilla/oncosalud')}
        onNext={handleNext}
        nextLabel={loading ? 'Guardando...' : 'Next Step'}
        nextDisabled={loading}
      />
    </div>
  );
}
