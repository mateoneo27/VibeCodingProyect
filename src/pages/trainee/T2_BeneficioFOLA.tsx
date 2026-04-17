import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '../../components/layout/TopNavBar';
import { BottomNavBar } from '../../components/layout/BottomNavBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../hooks/useAuth';
import { saveOnboardingStep } from '../../lib/services';

export default function T2_BeneficioFOLA() {
  const navigate = useNavigate();
  const { state, setFola } = useOnboarding();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const fola = state.fola;

  function isValid() {
    return true;
  }

  async function handleNext() {
    if (!isValid() || !user) return;
    setLoading(true);
    try {
      await saveOnboardingStep(user.id, { fola });
      navigate('/trainee/oncosalud');
    } catch (e) {
      console.error('Error guardando FOLA:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#f6f5fa] text-[#000033] min-h-screen flex flex-col">
      <TopNavBar />
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 md:py-20 max-w-6xl mx-auto w-full">
        {/* Progress */}
        <div className="w-full max-w-2xl mb-12">
          <div className="flex justify-between items-end mb-3">
            <span className="font-headline font-bold text-[#0a29cd] tracking-tight text-lg">Paso 02 de 04</span>
            <span className="font-label font-semibold text-[#666685] text-sm">50% Complete</span>
          </div>
          <div className="h-4 w-full bg-[#ccccd6] rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-[#49c7fd] to-[#0a29cd] rounded-full relative">
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-start">
          {/* Left info */}
          <div className="lg:col-span-5 pt-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#000033] tracking-tighter leading-none mb-6 font-headline">
              Afiliación al Seguro FOLA
            </h1>
            <p className="text-lg text-[#666685] leading-relaxed">
              Como <span className="font-bold text-[#0a29cd]">NEO Trainee</span>, tu afiliación al seguro FOLA es
              automática. Por favor, confirma los siguientes datos para proceder:
            </p>
            <div className="mt-10 p-6 bg-[#f6f5fa] rounded-xl flex items-start gap-4">
              <span className="material-symbols-outlined text-[#0a29cd] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <div>
                <p className="font-headline font-bold text-[#000033] text-sm">Seguridad Garantizada</p>
                <p className="text-xs text-[#666685] leading-tight mt-1">
                  Tus datos están protegidos bajo los más altos estándares de privacidad corporativa.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-[#f6f5fa] rounded-[2rem] p-8 md:p-12 shadow-[0_12px_32px_rgba(25,28,33,0.06)]">
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2">
                  <label className="block font-headline font-bold text-sm text-[#000033] mb-2 px-1">Remuneración total</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#666685] font-bold">S/</span>
                    <input
                      type="number"
                      value={fola.remuneracion}
                      onChange={(e) => setFola({ remuneracion: Number(e.target.value) })}
                      placeholder="0.00"
                      className="w-full pl-12 pr-6 py-4 rounded-xl border-none bg-[#ccccd6] focus:bg-white focus:ring-2 focus:ring-[#0a29cd]/20 transition-all outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-[#666685] mt-2 px-1 leading-tight uppercase tracking-widest font-semibold">
                    Excluyendo bono de internet
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#49c7fd] to-[#0a29cd] rounded-2xl h-32 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-10">
                  <span className="material-symbols-outlined text-white text-9xl absolute -right-4 -bottom-4">health_and_safety</span>
                </div>
                <p className="text-white font-headline font-bold text-sm text-center px-6 relative z-10">
                  Protección integral para tu desarrollo profesional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar
        onBack={() => navigate('/trainee/datos-personales')}
        onNext={handleNext}
        nextDisabled={!isValid() || loading}
        nextLabel={loading ? 'Guardando...' : 'Siguiente'}
      />
      <div className="h-24" />
    </div>
  );
}
