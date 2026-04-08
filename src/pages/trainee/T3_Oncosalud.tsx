import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '../../components/layout/TopNavBar';
import { BottomNavBar } from '../../components/layout/BottomNavBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../hooks/useAuth';
import { saveOnboardingStep } from '../../firebase/services';

export default function T3_Oncosalud() {
  const navigate = useNavigate();
  const { state, setOncosalud } = useOnboarding();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const onco = state.oncosalud;

  async function handleNext() {
    if (!user) return;
    setLoading(true);
    try {
      await saveOnboardingStep(user.uid, { oncosalud: onco });
      navigate('/trainee/revision');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#f9f9ff] text-[#191c21] min-h-screen flex flex-col pb-32">
      <TopNavBar />
      <main className="flex-grow max-w-6xl mx-auto px-6 pt-12 lg:pt-20 w-full">
        <div className="mb-12 max-w-md">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs font-bold tracking-widest text-[#00478d] uppercase">Paso 03 de 04</span>
            <span className="text-2xl font-black text-[#00478d]">75%</span>
          </div>
          <div className="h-3 w-full bg-[#e1e2ea] rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-[#40dccb] to-[#005149] rounded-full shadow-[0_0_12px_rgba(0,81,73,0.3)]" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-[#191c21] mb-6 leading-tight font-headline">
              Beneficio <br /><span className="text-[#00478d]">Oncosalud</span>
            </h1>
            <p className="text-lg text-[#424752] leading-relaxed mb-8">
              Neo ofrece afiliación al seguro oncológico. Priorizamos tu bienestar y el de tu familia con los mejores convenios de salud.
            </p>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-4 bg-[#f2f3fb] text-[#00478d] font-bold rounded-xl hover:bg-[#e7e8f0] transition-colors group">
              <span className="material-symbols-outlined">description</span>
              Ver detalles de cobertura aquí
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
            </a>
          </div>

          <div className="lg:col-span-7 bg-[#f2f3fb] rounded-[2.5rem] p-8 lg:p-12 shadow-[0_12px_32px_rgba(25,28,33,0.04)]">
            <h2 className="text-2xl font-bold text-[#191c21] mb-6 font-headline">¿Deseas afiliarte?</h2>
            <div className="space-y-4 mb-8">
              <label className={`flex items-center p-5 bg-white rounded-2xl cursor-pointer transition-shadow ${onco.desea ? 'ring-2 ring-[#005149] shadow-md' : 'hover:shadow-sm'}`}>
                <input
                  type="radio"
                  name="affiliation"
                  checked={onco.desea === true}
                  onChange={() => setOncosalud({ desea: true })}
                  className="w-5 h-5 text-[#005149] focus:ring-[#005149] border-[#c2c6d4]"
                />
                <span className="ml-4 font-semibold text-[#191c21]">Sí, deseo afiliarme</span>
                {onco.desea && <span className="ml-auto material-symbols-outlined text-[#005149]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
              </label>
              <label className={`flex items-center p-5 bg-white/50 rounded-2xl cursor-pointer ${onco.desea === false ? 'bg-white ring-2 ring-[#424752]' : 'hover:shadow-sm'}`}>
                <input
                  type="radio"
                  name="affiliation"
                  checked={onco.desea === false}
                  onChange={() => setOncosalud({ desea: false })}
                  className="w-5 h-5 text-[#00478d] focus:ring-[#00478d] border-[#c2c6d4]"
                />
                <span className="ml-4 font-semibold text-[#424752]">No, continuar con el flujo</span>
              </label>
            </div>

            {onco.desea && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#58657a] ml-1">Nombre completo</label>
                    <input type="text" value={onco.nombres} onChange={(e) => setOncosalud({ nombres: e.target.value })} placeholder="Ej. Juan Pérez"
                      className="w-full bg-[#e7e8f0] border-none rounded-xl p-4 focus:ring-1 focus:ring-[#00478d] focus:bg-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#58657a] ml-1">DNI</label>
                    <input type="text" value={onco.dni} onChange={(e) => setOncosalud({ dni: e.target.value })} placeholder="8 dígitos" maxLength={8}
                      className="w-full bg-[#e7e8f0] border-none rounded-xl p-4 focus:ring-1 focus:ring-[#00478d] focus:bg-white transition-all outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#58657a] ml-1">Celular</label>
                    <input type="tel" value={onco.celular} onChange={(e) => setOncosalud({ celular: e.target.value })} placeholder="+51 999 999 999"
                      className="w-full bg-[#e7e8f0] border-none rounded-xl p-4 focus:ring-1 focus:ring-[#00478d] focus:bg-white transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#58657a] ml-1">Correo</label>
                    <input type="email" value={onco.correo} onChange={(e) => setOncosalud({ correo: e.target.value })} placeholder="usuario@dominio.com"
                      className="w-full bg-[#e7e8f0] border-none rounded-xl p-4 focus:ring-1 focus:ring-[#00478d] focus:bg-white transition-all outline-none" />
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[#005149]/5 rounded-2xl border-l-4 border-[#005149]">
                  <span className="material-symbols-outlined text-[#005149]">info</span>
                  <p className="text-sm text-[#424752] italic">Al completar estos datos, autorizas el descuento correspondiente según el plan seleccionado.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavBar
        onBack={() => navigate('/trainee/fola')}
        onNext={handleNext}
        nextLabel={loading ? 'Guardando...' : 'Next Step'}
        nextDisabled={loading}
      />
    </div>
  );
}
