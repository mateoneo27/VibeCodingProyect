import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '../../components/layout/TopNavBar';
import { BottomNavBar } from '../../components/layout/BottomNavBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../hooks/useAuth';
import { completeOnboarding } from '../../lib/services';

export default function P5_Revision() {
  const navigate = useNavigate();
  const { state } = useOnboarding();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const dp = state.datosPersonales;

  async function handleSubmit() {
    if (!user) return;
    setLoading(true);
    try {
      await completeOnboarding(user.id);
      navigate('/completado');
    } catch (e) {
      console.error('Error completando onboarding:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#f6f5fa] text-[#000033] min-h-screen pb-32">
      <TopNavBar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[#0a29cd] font-bold tracking-widest text-xs uppercase font-label">Paso Final</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-2 text-[#0a29cd] font-headline">
                Revisa tus datos
              </h1>
            </div>
            <span className="text-[#0a29cd] font-bold text-lg">100%</span>
          </div>
          <div className="h-4 w-full bg-[#ccccd6] rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-[#49c7fd] to-[#0a29cd] w-full rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: photo */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#f6f5fa] rounded-[2rem] p-8 shadow-sm border border-[#b3b3c2]/30">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#0a29cd]">account_circle</span>
                <h2 className="text-xl font-bold tracking-tight font-headline">Fotografía</h2>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full aspect-[340/402] max-w-[280px] bg-[#ccccd6] rounded-2xl border-2 border-dashed border-[#9999ad] flex items-center justify-center overflow-hidden">
                  {dp.fotoUrl ? (
                    <img src={dp.fotoUrl} alt="Fotocheck" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#9999ad]">
                      <span className="material-symbols-outlined text-5xl">account_circle</span>
                      <p className="text-sm font-semibold">Sin foto</p>
                    </div>
                  )}
                </div>
                <div className="w-full mt-6 grid grid-cols-2 gap-3">
                  {[['Formato', 'JPG'], ['Tamaño', '340x402 px'], ['Peso', '25-30 KB'], ['Fondo', 'Blanco']].map(([k, v]) => (
                    <div key={k} className="bg-white p-3 rounded-xl border border-[#b3b3c2]/20">
                      <p className="text-[10px] uppercase font-bold text-[#666685] tracking-wider mb-1">{k}</p>
                      <p className="text-xs font-semibold text-[#000033]">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#f6f5fa] p-8 rounded-[1.5rem]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#0a29cd]/10 rounded-xl text-[#0a29cd]">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="text-[#000033] font-semibold mb-1">Veracidad de la información</p>
                  <p className="text-[#666685] text-sm leading-relaxed">
                    Al hacer clic en enviar, confirmas que toda la información brindada es verídica.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: summary */}
          <div className="lg:col-span-7">
            <div className="bg-[#f6f5fa] rounded-[2rem] p-10 space-y-10">
              {/* Personal info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0a29cd]">person</span>
                  <h2 className="text-xl font-bold tracking-tight font-headline">Información Personal</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    ['Nombres', dp.nombres || '—'],
                    ['Apellido Paterno', dp.apellidoPaterno || '—'],
                    ['Apellido Materno', dp.apellidoMaterno || '—'],
                    ['DNI', dp.dni || '—'],
                    ['Teléfono', dp.telefono || '—'],
                    ['Fecha de Nacimiento', dp.fechaNacimiento || '—'],
                    ['Edad', dp.edad ? String(dp.edad) : '—'],
                    ['Correo', dp.correo || '—'],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-white p-6 rounded-xl shadow-sm border border-[#b3b3c2]/20">
                      <span className="text-xs font-bold text-[#666685] uppercase tracking-wider block mb-1">{label}</span>
                      <p className="text-[#000033] font-semibold truncate">{val}</p>
                    </div>
                  ))}
                  <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-[#b3b3c2]/20">
                    <span className="text-xs font-bold text-[#666685] uppercase tracking-wider block mb-1">Dirección</span>
                    <p className="text-[#000033] font-semibold">{dp.direccion || '—'}</p>
                  </div>
                </div>
              </section>

              {/* Benefits */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0a29cd]">health_and_safety</span>
                  <h2 className="text-xl font-bold tracking-tight font-headline">Beneficios Seleccionados</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-xl flex items-center gap-4 border border-[#b3b3c2]/20">
                    <span className={`material-symbols-outlined ${state.beneficioEPS.desea ? 'text-[#0a29cd]' : 'text-[#9999ad]'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {state.beneficioEPS.desea ? 'check_circle' : 'cancel'}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-[#000033]">EPS Rímac</p>
                      <p className="text-xs text-[#666685] italic">{state.beneficioEPS.desea ? 'Plan Base — Afiliado' : 'No seleccionado'}</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl flex items-center gap-4 border border-[#b3b3c2]/20">
                    <span className={`material-symbols-outlined ${state.oncosalud.desea ? 'text-[#0a29cd]' : 'text-[#9999ad]'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {state.oncosalud.desea ? 'check_circle' : 'cancel'}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-[#000033]">Oncosalud</p>
                      <p className="text-xs text-[#666685] italic">{state.oncosalud.desea ? 'Cobertura Integral' : 'No seleccionado'}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Examen */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0a29cd]">medical_services</span>
                  <h2 className="text-xl font-bold tracking-tight font-headline">Examen Médico</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#b3b3c2]/20">
                  <span className="text-xs font-bold text-[#666685] uppercase tracking-wider block mb-1">Fecha Sugerida</span>
                  <p className="text-[#000033] font-semibold">{state.examenMedico.fechaSugerida || '—'}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar
        onBack={() => navigate('/planilla/examen-medico')}
        onNext={handleSubmit}
        nextLabel={loading ? 'Enviando...' : 'Enviar Registro'}
        nextDisabled={loading}
        isSubmit
      />
    </div>
  );
}
