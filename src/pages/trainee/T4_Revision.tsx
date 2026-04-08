import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '../../components/layout/TopNavBar';
import { BottomNavBar } from '../../components/layout/BottomNavBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../hooks/useAuth';
import { completeOnboarding } from '../../firebase/services';

export default function T4_Revision() {
  const navigate = useNavigate();
  const { state } = useOnboarding();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const dp = state.datosPersonales;
  const fola = state.fola;

  async function handleSubmit() {
    if (!user) return;
    setLoading(true);
    try {
      await completeOnboarding(user.uid);
      navigate('/completado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#f9f9ff] text-[#191c21] min-h-screen pb-32">
      <TopNavBar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[#005149] font-bold tracking-widest text-xs uppercase font-label">Paso Final</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-2 text-[#00478d] font-headline">
                Revisa tus datos
              </h1>
            </div>
            <span className="text-[#00478d] font-bold text-lg">100%</span>
          </div>
          <div className="h-4 w-full bg-[#e1e2ea] rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-[#40dccb] to-[#005149] w-full rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: photo */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#f2f3fb] rounded-[2rem] p-8 shadow-sm border border-[#c2c6d4]/30">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#00478d]">account_circle</span>
                <h2 className="text-xl font-bold tracking-tight font-headline">Fotografía</h2>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full aspect-[340/402] max-w-[280px] bg-[#e1e2ea] rounded-2xl border-2 border-dashed border-[#727783] flex items-center justify-center overflow-hidden">
                  {dp.fotoUrl ? (
                    <img src={dp.fotoUrl} alt="Fotocheck" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#727783]">
                      <span className="material-symbols-outlined text-5xl">account_circle</span>
                      <p className="text-sm font-semibold">Sin foto</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#f2f3fb] p-8 rounded-[1.5rem]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#005149]/10 rounded-xl text-[#005149]">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="text-[#191c21] font-semibold mb-1">Veracidad de la información</p>
                  <p className="text-[#424752] text-sm leading-relaxed">
                    Al hacer clic en enviar, confirmas que toda la información brindada es verídica.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: summary */}
          <div className="lg:col-span-7">
            <div className="bg-[#f2f3fb] rounded-[2rem] p-10 space-y-10">
              {/* Personal info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#00478d]">person</span>
                  <h2 className="text-xl font-bold tracking-tight font-headline">Información Personal</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    ['Nombre Completo', dp.nombres || '—'],
                    ['DNI', dp.dni || '—'],
                    ['Teléfono', dp.telefono || '—'],
                    ['Fecha de Nacimiento', dp.fechaNacimiento || '—'],
                    ['Edad', dp.edad ? String(dp.edad) : '—'],
                    ['Correo', dp.correo || '—'],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-white p-6 rounded-xl shadow-sm border border-[#c2c6d4]/20">
                      <span className="text-xs font-bold text-[#58657a] uppercase tracking-wider block mb-1">{label}</span>
                      <p className="text-[#191c21] font-semibold truncate">{val}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FOLA info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#00478d]">health_and_safety</span>
                  <h2 className="text-xl font-bold tracking-tight font-headline">Afiliación FOLA</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    ['Nombre', fola.nombres || '—'],
                    ['DNI', fola.dni || '—'],
                    ['Fecha Nacimiento', fola.fechaNacimiento || '—'],
                    ['Sexo', fola.sexo || '—'],
                    ['Remuneración', fola.remuneracion ? `S/ ${fola.remuneracion}` : '—'],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-white p-6 rounded-xl shadow-sm border border-[#c2c6d4]/20">
                      <span className="text-xs font-bold text-[#58657a] uppercase tracking-wider block mb-1">{label}</span>
                      <p className="text-[#191c21] font-semibold">{val}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Oncosalud */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#00478d]">favorite</span>
                  <h2 className="text-xl font-bold tracking-tight font-headline">Oncosalud</h2>
                </div>
                <div className="bg-white p-5 rounded-xl flex items-center gap-4 border border-[#c2c6d4]/20">
                  <span className={`material-symbols-outlined ${state.oncosalud.desea ? 'text-[#005149]' : 'text-[#727783]'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {state.oncosalud.desea ? 'check_circle' : 'cancel'}
                  </span>
                  <div>
                    <p className="font-bold text-sm text-[#191c21]">Oncosalud</p>
                    <p className="text-xs text-[#424752] italic">{state.oncosalud.desea ? 'Afiliado' : 'No seleccionado'}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar
        onBack={() => navigate('/trainee/oncosalud')}
        onNext={handleSubmit}
        nextLabel={loading ? 'Enviando...' : 'Enviar Registro'}
        nextDisabled={loading}
        isSubmit
      />
    </div>
  );
}
