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

  function isValid() {
    return Boolean(examen.fechaSugerida?.trim());
  }

  async function handleNext() {
    if (!user || !isValid()) return;
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
    <div className="bg-[#f6f5fa] text-[#000033] min-h-screen flex flex-col pb-32">
      <TopNavBar />
      <main className="flex-grow container mx-auto px-6 pt-12">
        {/* Progress */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[#0a29cd] font-headline font-extrabold text-sm tracking-widest uppercase">Paso 04 de 05</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0a29cd] mt-2 font-headline">
                Examen Médico Ocupacional
              </h1>
            </div>
            <div className="text-right">
              <span className="font-headline font-bold text-[#0a29cd] text-2xl">75%</span>
              <p className="text-xs font-bold text-[#666685] uppercase tracking-tighter">Completado</p>
            </div>
          </div>
          <div className="h-3 w-full bg-[#ccccd6] rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-[#49c7fd] to-[#0a29cd] w-[75%] rounded-full relative">
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#f6f5fa] p-10 rounded-[2rem] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0a29cd]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0a29cd] text-3xl">medical_services</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#000033] tracking-tight font-headline">Detalles del Examen</h2>
                </div>
                <p className="text-lg leading-relaxed text-[#666685]">
                  Se programará un examen médico ocupacional como parte del onboarding, el cuál es cubierto por{' '}
                  <span className="font-bold text-[#0a29cd]">Neo</span>. La atención es de lunes a sábados desde las{' '}
                  <span className="bg-[#b3b3c2] px-2 py-0.5 rounded text-[#4d4d70] font-semibold italic">7:30 am</span> hasta las{' '}
                  <span className="bg-[#b3b3c2] px-2 py-0.5 rounded text-[#4d4d70] font-semibold italic">10:00 am</span>.
                </p>
                <div className="mt-8 flex items-start gap-4 p-5 bg-[#0a29cd]/10 rounded-2xl border-l-4 border-[#0a29cd]">
                  <span className="material-symbols-outlined text-[#0a29cd]">info</span>
                  <p className="text-sm font-medium text-[#0a29cd] leading-snug">
                    Recuerda que para la toma de muestras, es obligatorio asistir{' '}
                    <span className="font-bold underline decoration-2">en ayunas</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="bg-white p-10 rounded-[2rem] shadow-[0_12px_32px_rgba(25,28,33,0.04)] border border-[#b3b3c2]/10">
              <label className="block text-sm font-bold text-[#666685] uppercase tracking-widest mb-4">
                Fecha y hora sugerida
              </label>
              <div className="relative">
                <input
                  type="datetime-local" // Activa calendario y reloj nativos
                  value={examen.fechaSugerida}
                  onChange={(e) => setExamenMedico({ ...examen, fechaSugerida: e.target.value })}
                  className="w-full bg-[#ccccd6] border-none rounded-xl px-6 py-5 text-lg font-medium focus:ring-2 focus:ring-[#0a29cd] focus:bg-white transition-all outline-none placeholder:text-[#9999ad] appearance-none custom-datetime-input"
                  required
                />
                {/* Icono posicionado para que no bloquee el click del input nativo */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="material-symbols-outlined text-[#9999ad]">
                    calendar_month
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs text-[#9999ad] font-medium italic">
                Selecciona el día y la hora ideal para tu cita.
              </p>
            </div>
          </div>

          {/* Right: location card */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-[#f6f5fa] rounded-[2rem] overflow-hidden flex flex-col">
              <img
                src="/Mapa_clinica.png"
                alt="Mapa Clínica Respira"
                className="w-full object-cover"
              />
              <div className="p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#0a29cd]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0a29cd]">Ubicación</span>
                </div>
                <h3 className="text-2xl font-bold text-[#000033] mb-4 font-headline">Clínica Respira</h3>
                <p className="text-[#666685] font-medium leading-relaxed mb-6">
                  Av. San Eugenio 899 Urb. Santa Catalina<br />
                  La Victoria, Lima
                </p>
                <div className="bg-[#ccccd6] rounded-2xl p-4 flex items-center gap-3">
                  {/* Cambiamos 'schedule' por 'location_on' o 'map' */}
                  <span className="material-symbols-outlined text-[#0a29cd]">
                    location_on
                  </span>
                  
                  <p className="text-sm font-medium text-[#666685]">
                    Link de la clínica: {' '}
                    <a 
                      href="https://maps.app.goo.gl/7z346MsrgkcwH6QV7" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0a29cd] underline hover:text-opacity-80 transition-all"
                    >
                      Ver ubicación
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar
        onBack={() => navigate('/planilla/oncosalud')}
        onNext={handleNext}
        nextLabel={loading ? 'Guardando...' : 'Siguiente'}
        nextDisabled={!isValid() || loading}
      />
    </div>
  );
}
