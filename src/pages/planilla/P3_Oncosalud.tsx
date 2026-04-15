import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '../../components/layout/TopNavBar';
import { BottomNavBar } from '../../components/layout/BottomNavBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../hooks/useAuth';
import { saveOnboardingStep } from '../../lib/services';

export default function P3_Oncosalud() {
  const navigate = useNavigate();
  const { state, setOncosalud } = useOnboarding();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const onco = state.oncosalud;

  async function handleNext() {
    if (!user) return;
    setLoading(true);
    try {
      await saveOnboardingStep(user.id, { oncosalud: onco });
      navigate('/planilla/examen-medico');
    } catch (e) {
      console.error('Error guardando oncosalud:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#f6f5fa] text-[#000033] min-h-screen flex flex-col pb-32">
      <TopNavBar />
      <main className="flex-grow max-w-6xl mx-auto px-6 pt-12 lg:pt-20 w-full">
        <div className="mb-12 max-w-md">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs font-bold tracking-widest text-[#0a29cd] uppercase">Paso 03 de 05</span>
            <span className="text-2xl font-black text-[#0a29cd]">55%</span>
          </div>
          <div className="h-3 w-full bg-[#ccccd6] rounded-full overflow-hidden">
            <div className="h-full w-[55%] bg-gradient-to-r from-[#49c7fd] to-[#0a29cd] rounded-full shadow-[0_0_12px_rgba(0,81,73,0.3)]" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left */}
          <div className="lg:col-span-5">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-[#000033] mb-6 leading-tight font-headline">
              Beneficio <br /><span className="text-[#0a29cd]">Oncosalud</span>
            </h1>
            <p className="text-lg text-[#666685] leading-relaxed mb-8">
              Neo ofrece afiliación al seguro oncológico con descuento por planilla. Priorizamos tu bienestar y el de tu familia con los mejores convenios de salud.
            </p>
            <a href="https://drive.google.com/file/d/1lRFzxUstwGUdv0ak2PlpXZ5JF2mqH5VV/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-4 bg-[#f6f5fa] text-[#0a29cd] font-bold rounded-xl hover:bg-[#ccccd6] transition-colors group">
              <span className="material-symbols-outlined">description</span>
              Ver detalles de cobertura aquí
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
            </a>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7 bg-[#f6f5fa] rounded-[2.5rem] p-8 lg:p-12 shadow-[0_12px_32px_rgba(25,28,33,0.04)]">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#000033] mb-6 font-headline">¿Deseas afiliarte?</h2>
              <div className="space-y-4">
                <label className={`flex items-center p-5 bg-white rounded-2xl cursor-pointer transition-shadow ${onco.desea ? 'ring-2 ring-[#0a29cd] shadow-md' : 'hover:shadow-sm'}`}>
                  <input
                    type="radio"
                    name="affiliation"
                    checked={onco.desea === true}
                    onChange={() => setOncosalud({ desea: true })}
                    className="w-5 h-5 text-[#0a29cd] focus:ring-[#0a29cd] border-[#b3b3c2]"
                  />
                  <span className="ml-4 font-semibold text-[#000033]">Sí, deseo afiliarme</span>
                  {onco.desea && <span className="ml-auto material-symbols-outlined text-[#0a29cd]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                </label>
                <label className={`flex items-center p-5 bg-white/50 rounded-2xl cursor-pointer transition-shadow ${onco.desea === false ? 'bg-white ring-2 ring-[#666685]' : 'hover:shadow-sm'}`}>
                  <input
                    type="radio"
                    name="affiliation"
                    checked={onco.desea === false}
                    onChange={() => setOncosalud({ desea: false })}
                    className="w-5 h-5 text-[#0a29cd] focus:ring-[#0a29cd] border-[#b3b3c2]"
                  />
                  <span className="ml-4 font-semibold text-[#666685]">No, continuar con el flujo</span>
                </label>
              </div>
            </div>

          </div>
        </div>
      </main>

      <BottomNavBar
        onBack={() => navigate('/planilla/eps')}
        onNext={handleNext}
        nextLabel={loading ? 'Guardando...' : 'Next Step'}
        nextDisabled={loading}
      />
    </div>
  );
}
