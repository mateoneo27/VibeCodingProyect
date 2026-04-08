import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '../components/layout/TopNavBar';
import { BottomNavBar } from '../components/layout/BottomNavBar';

export default function VistaInicio() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f9f9ff] text-[#191c21] font-body selection:bg-[#d6e3ff] selection:text-[#001b3d]">
      <TopNavBar />

      <main className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center px-4 py-2 bg-[#d6e3fc] text-[#0e1c2e] font-label text-xs font-semibold uppercase tracking-widest rounded-full">
                NUEVO INGRESO
              </div>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-[#191c21] leading-tight">
                ¡Bienvenido al <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00478d] to-[#005eb8]">
                  equipo NEO!
                </span>
              </h1>
              <p className="text-lg md:text-xl text-[#424752] leading-relaxed font-body">
                Estamos felices de tenerte con nosotros. Para iniciar tu proceso de onboarding de manera efectiva,
                necesitamos recolectar algunos datos clave sobre tus beneficios y afiliaciones.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <button
                  onClick={() => navigate('/auth/register')}
                  className="w-full sm:w-auto px-10 py-5 bg-gradient-to-b from-[#00478d] to-[#005eb8] text-white font-headline font-bold rounded-2xl shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300 active:scale-95 text-lg"
                >
                  Empezar Registro
                </button>
                <div className="flex items-center text-[#424752] font-medium text-sm">
                  <span className="material-symbols-outlined mr-2 text-[#005149]">schedule</span>
                  Toma aproximadamente 5 minutos
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {[
                { icon: 'verified', title: 'Integridad', desc: 'Actuamos con honestidad y transparencia en cada paso.', color: 'text-[#00478d]', bg: 'bg-[#00478d]/10' },
                { icon: 'auto_stories', title: 'Aprendizaje', desc: 'Crecemos todos los días a través de la curiosidad.', color: 'text-[#005149]', bg: 'bg-[#005149]/10' },
                { icon: 'ads_click', title: 'Resultados', desc: 'Impactamos positivamente en nuestros objetivos.', color: 'text-[#525f74]', bg: 'bg-[#525f74]/10' },
                { icon: 'biotech', title: 'Experimentación', desc: 'No tememos fallar, amamos descubrir nuevas formas.', color: 'text-[#005eb8]', bg: 'bg-[#005eb8]/10' },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-[#e7e8f0] p-6 rounded-3xl border border-[#c2c6d4]/30 flex flex-col items-start gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${card.color} text-2xl`}>{card.icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-[#191c21]">{card.title}</h3>
                  <p className="text-xs text-[#424752] leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="w-full bg-[#f2f3fb] py-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="font-headline text-3xl font-extrabold text-[#191c21] mb-4">¿Qué sigue en tu camino?</h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-[#005149] to-[#65f9e7] rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: 'person_add', title: 'Información Personal', desc: 'Validaremos tus datos básicos y documentos de identidad para el registro formal en la plataforma.', step: '01', color: 'text-[#00478d]', bg: 'bg-[#d6e3ff]' },
                { icon: 'medical_services', title: 'Beneficios y Salud', desc: 'Configura tus preferencias de seguro médico, fondos de retiro y otros beneficios corporativos exclusivos.', step: '02', color: 'text-[#005149]', bg: 'bg-[#65f9e7]' },
                { icon: 'terminal', title: 'Herramientas', desc: 'Solicita el equipo necesario y accede a tus credenciales de Neo para comenzar a trabajar.', step: '03', color: 'text-[#525f74]', bg: 'bg-[#d6e3fc]' },
              ].map((s) => (
                <div key={s.step} className="bg-white p-8 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_32px_rgba(25,28,33,0.06)] flex flex-col justify-between group">
                  <div>
                    <div className={`w-14 h-14 rounded-xl ${s.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <span className={`material-symbols-outlined ${s.color} text-3xl`}>{s.icon}</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold mb-3">{s.title}</h3>
                    <p className="text-[#424752] text-sm leading-relaxed">{s.desc}</p>
                  </div>
                  <div className={`mt-8 flex items-center ${s.color} font-bold text-sm`}>
                    Paso {s.step}{' '}
                    <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-24 px-8 text-center max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl p-12 rounded-[2.5rem] border border-[#c2c6d4]/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-9xl">verified_user</span>
            </div>
            <h2 className="font-headline text-3xl font-extrabold mb-6">¿Todo listo para el despegue?</h2>
            <p className="text-[#424752] mb-10 max-w-lg mx-auto">
              Tu futuro en Neo comienza aquí. Haz clic abajo para asegurar que tu integración sea perfecta desde el primer día.
            </p>
            <button
              onClick={() => navigate('/auth/register')}
              className="bg-[#00478d] text-white font-headline font-bold py-4 px-12 rounded-2xl hover:bg-[#005eb8] transition-all shadow-lg active:scale-98"
            >
              Empezar Registro
            </button>
          </div>
        </section>
      </main>

      <BottomNavBar
        onBack={() => {}}
        onNext={() => navigate('/auth/register')}
        nextLabel="Empezar"
        backLabel="Volver"
        showProgress
        progressPercent={0}
      />
      <div className="h-24" />
    </div>
  );
}
