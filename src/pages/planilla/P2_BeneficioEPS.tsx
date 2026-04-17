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
    <div className="bg-[#f6f5fa] text-[#000033] min-h-screen flex flex-col pb-32">
      <TopNavBar />
      <main className="flex-grow flex flex-col items-center justify-start pt-12 pb-32 px-6">
        <div className="w-full max-w-4xl">
          <ProgressBar step="Paso 02 de 05" title="Beneficio EPS" percent={40} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: image card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl flex items-end">
                <img
                  src="/Rimac_Imagen.png"
                  alt="Beneficio EPS Rímac"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000033]/80 via-[#000033]/20 to-transparent" />
                <div className="relative p-8 text-white">
                  <div className="bg-[#0a29cd]/90 backdrop-blur-md inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                    Premium Benefit
                  </div>
                  <h2 className="text-4xl font-black leading-tight mb-2 font-headline">Beneficio EPS Rímac</h2>
                  <p className="text-white/80 text-sm">Cobertura médica de primera para ti y tu familia.</p>
                </div>
              </div>
            </div>

            {/* Right: interaction */}
            <div className="lg:col-span-7 bg-[#f6f5fa] rounded-[2.5rem] p-8 md:p-12 shadow-sm">
              <div className="mb-10">
              <p className="text-[#666685] text-lg leading-relaxed">
                Neo ofrece el seguro{' '}
                <span className="font-bold text-[#0a29cd]">EPS - Rímac Plan Base 100% gratuito</span>{' '}
                para ti. ¿Deseas que te incluyamos en este beneficio para proceder con la afiliación?
              </p>
              <a
                href="https://drive.google.com/drive/folders/1A4JGs91qtch5djKO01eq7_WdmLPZel2G?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 text-[#0a29cd] font-bold hover:underline decoration-2 underline-offset-4"
              >
                Ver detalles aquí
                <span className="material-symbols-outlined ml-1 text-sm">open_in_new</span>
              </a>
            </div>

              <div className="mb-8 flex gap-4 p-4 bg-[#0a29cd]/5 rounded-xl border border-[#0a29cd]/10">
                <span className="material-symbols-outlined text-[#0a29cd]">notifications</span>
                <p className="text-sm text-[#666685] leading-relaxed">
                  Una vez completado este paso, recibirás un correo por parte de Rímac para que puedas completar y enviar tu solicitud de afiliación.
                </p>
              </div>

              <div className="space-y-4">
                <label
                  className={`relative flex items-center p-6 bg-white rounded-xl cursor-pointer transition-all duration-300 ${
                    eps.desea ? 'ring-2 ring-[#0a29cd] shadow-lg' : 'hover:bg-[#f6f5fa]'
                  }`}
                >
                  <input
                    type="radio"
                    name="eps_choice"
                    checked={eps.desea === true}
                    onChange={() => setBeneficioEPS({ desea: true })}
                    className="w-5 h-5 text-[#0a29cd] border-[#b3b3c2] focus:ring-[#0a29cd]"
                  />
                  <span className="ml-4 font-headline font-bold text-[#000033]">Sí, deseo afiliarme</span>
                  {eps.desea && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#0a29cd]/10 p-2 rounded-full">
                      <span className="material-symbols-outlined text-[#0a29cd] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    </div>
                  )}
                </label>

                <label
                  className={`relative flex items-center p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    eps.desea === false ? 'bg-white ring-2 ring-[#666685] shadow-sm' : 'bg-white/50 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="eps_choice"
                    checked={eps.desea === false}
                    onChange={() => setBeneficioEPS({ desea: false })}
                    className="w-5 h-5 text-[#0a29cd] border-[#b3b3c2] focus:ring-[#0a29cd]"
                  />
                  <span className="ml-4 font-headline font-semibold text-[#666685]">No, por ahora no</span>
                </label>
              </div>

            </div>
          </div>
        </div>
      </main>

      <BottomNavBar
        onBack={() => navigate('/planilla/datos-personales')}
        onNext={handleNext}
        nextLabel={loading ? 'Guardando...' : 'Siguiente'}
        nextDisabled={loading}
      />
    </div>
  );
}
