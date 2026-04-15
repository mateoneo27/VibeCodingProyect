import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '../components/layout/TopNavBar';

export default function VistaInicio() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F6F5FA] text-[#000033] font-body selection:bg-[#0A29CD]/20">
      <TopNavBar />

      <main className="min-h-[calc(100vh-64px)] w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center px-4 py-2 bg-[#0A29CD]/10 text-[#0A29CD] font-label text-xs font-semibold uppercase tracking-widest rounded-full">
                NUEVO INGRESO
              </div>

              <div className="space-y-4">
                <p className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-[#4D4D70]">
                  ¡Bienvenido al equipo!
                </p>
                <img src="/logo_neo.png" alt="NEO" className="h-16 md:h-20 w-auto" />
              </div>

              <p className="text-lg md:text-xl text-[#4D4D70] leading-relaxed font-body">
                Estamos felices de tenerte con nosotros. Para iniciar tu proceso de onboarding de manera efectiva,
                necesitamos recolectar algunos datos clave sobre tus beneficios y afiliaciones.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <button
                  onClick={() => navigate('/auth/login')}
                  className="w-full sm:w-auto px-10 py-5 bg-[#0A29CD] text-white font-headline font-bold rounded-2xl shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300 active:scale-95 text-lg"
                >
                  Iniciar Sesión
                </button>
                <div className="flex items-center text-[#4D4D70] font-medium text-sm">
                  <span className="material-symbols-outlined mr-2 text-[#0A29CD]">schedule</span>
                  Toma aproximadamente 5 minutos
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {[
                { icon: 'verified', title: 'Integridad', desc: 'Actuamos con honestidad y transparencia en cada paso.', color: 'text-[#0A29CD]', bg: 'bg-[#0A29CD]/10', accent: '#49C7FD' },
                { icon: 'auto_stories', title: 'Aprendizaje', desc: 'Crecemos todos los días a través de la curiosidad.', color: 'text-[#000033]', bg: 'bg-[#56E976]/20', accent: '#56E976' },
                { icon: 'ads_click', title: 'Resultados', desc: 'Impactamos positivamente en nuestros objetivos.', color: 'text-[#4D4D70]', bg: 'bg-[#FFEE53]/30', accent: '#FFEE53' },
                { icon: 'biotech', title: 'Experimentación', desc: 'No tememos fallar, amamos descubrir nuevas formas.', color: 'text-[#0A29CD]', bg: 'bg-[#49C7FD]/20', accent: '#49C7FD' },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-white p-6 rounded-3xl border border-[#B3B3C2]/30 flex flex-col items-start gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${card.color} text-2xl`}>{card.icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-[#000033]">{card.title}</h3>
                  <p className="text-xs text-[#4D4D70] leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Decorative blobs */}
      <div className="fixed top-1/4 -right-24 w-96 h-96 bg-[#49C7FD]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-1/4 -left-24 w-96 h-96 bg-[#56E976]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </div>
  );
}
