import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '../../components/layout/TopNavBar';
import { BottomNavBar } from '../../components/layout/BottomNavBar';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../hooks/useAuth';
import { saveOnboardingStep } from '../../lib/services';

export default function P2_BeneficioEPS() {
  const navigate = useNavigate();
  const { state, setBeneficioEPS } = useOnboarding();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const eps = state.beneficioEPS;

  async function handleNext() {
    if (!user) return;
    setLoading(true);
    try {
      await saveOnboardingStep(user.id, { beneficioEPS: eps });
      navigate('/planilla/oncosalud');
    } catch (e) {
      console.error('Error guardando EPS:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#f9f9ff] text-[#191c21] min-h-screen flex flex-col pb-32">
      <TopNavBar />
      <main className="flex-grow flex flex-col items-center justify-start pt-12 pb-32 px-6">
        <div className="w-full max-w-4xl">
          <ProgressBar step="Paso 02 de 05" title="Beneficio EPS" percent={40} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: image card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#00478d] to-[#005eb8] aspect-[4/5] shadow-2xl flex items-end">
                <div className="absolute inset-0 bg-gradient-to-t from-[#00478d]/80 via-[#00478d]/20 to-transparent" />
                <div className="relative p-8 text-white">
                  <div className="bg-[#005149]/90 backdrop-blur-md inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                    Premium Benefit
                  </div>
                  <h2 className="text-4xl font-black leading-tight mb-2 font-headline">Beneficio EPS Rímac</h2>
                  <p className="text-white/80 text-sm">Cobertura médica de primera para ti y tu familia.</p>
                </div>
              </div>
            </div>

            {/* Right: interaction */}
            <div className="lg:col-span-7 bg-[#f2f3fb] rounded-[2.5rem] p-8 md:p-12 shadow-sm">
              <div className="mb-10">
                <p className="text-[#424752] text-lg leading-relaxed">
                  Neo ofrece el seguro{' '}
                  <span className="font-bold text-[#00478d]">EPS - Rímac Plan Base 100% gratuito</span>{' '}
                  para ti. ¿Deseas que te incluyamos en este beneficio para proceder con la afiliación?
                </p>
                <a
                  href="#"
                  className="inline-flex items-center mt-4 text-[#00478d] font-bold hover:underline decoration-2 underline-offset-4"
                >
                  Ver detalles aquí
                  <span className="material-symbols-outlined ml-1 text-sm">open_in_new</span>
                </a>
              </div>

              <div className="mb-8 flex gap-4 p-4 bg-[#00478d]/5 rounded-xl border border-[#00478d]/10">
                <span className="material-symbols-outlined text-[#00478d]">notifications</span>
                <p className="text-sm text-[#424752] leading-relaxed">
                  Una vez completado este paso, recibirás un correo por parte de Rímac para que puedas completar y enviar tu solicitud de afiliación.
                </p>
              </div>

              <div className="space-y-4">
                <label
                  className={`relative flex items-center p-6 bg-white rounded-xl cursor-pointer transition-all duration-300 ${
                    eps.desea ? 'ring-2 ring-[#00478d] shadow-lg' : 'hover:bg-[#f9f9ff]'
                  }`}
                >
                  <input
                    type="radio"
                    name="eps_choice"
                    checked={eps.desea === true}
                    onChange={() => setBeneficioEPS({ desea: true })}
                    className="w-5 h-5 text-[#00478d] border-[#c2c6d4] focus:ring-[#00478d]"
                  />
                  <span className="ml-4 font-headline font-bold text-[#191c21]">Sí, deseo afiliarme</span>
                  {eps.desea && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#00478d]/10 p-2 rounded-full">
                      <span className="material-symbols-outlined text-[#00478d] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    </div>
                  )}
                </label>

                <label
                  className={`relative flex items-center p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    eps.desea === false ? 'bg-white ring-2 ring-[#424752] shadow-sm' : 'bg-white/50 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="eps_choice"
                    checked={eps.desea === false}
                    onChange={() => setBeneficioEPS({ desea: false })}
                    className="w-5 h-5 text-[#00478d] border-[#c2c6d4] focus:ring-[#00478d]"
                  />
                  <span className="ml-4 font-headline font-semibold text-[#424752]">No, por ahora no</span>
                </label>
              </div>

              <div className="flex gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-xl border-l-4 border-[#005149] shadow-sm mt-8">
                <span className="material-symbols-outlined text-[#005149]">info</span>
                <p className="text-sm text-[#424752] leading-relaxed">
                  Una vez completado este paso, recibirás un correo de confirmación de Rímac Seguros con tu póliza digital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar
        onBack={() => navigate('/planilla/datos-personales')}
        onNext={handleNext}
        nextLabel={loading ? 'Guardando...' : 'Next Step'}
        nextDisabled={loading}
      />
    </div>
  );
}
