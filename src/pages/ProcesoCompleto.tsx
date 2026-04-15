import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TopNavBar } from '../components/layout/TopNavBar';

const FAQ_ITEMS = [
  {
    icon: 'description',
    question: '¿Cuándo recibiré mi contrato?',
    answer: 'Tu contrato será enviado a tu correo NEO, a más tardar 48 horas después de tu fecha de ingreso.',
  },
  {
    icon: 'card_membership',
    question: '¿Cómo sé si ya me encuentro afiliado al seguro?',
    answer:
      '- En el caso seas Trainee, te llegará a tu correo personal la confirmación de tu afiliación a la póliza FOLA.\n- En el caso seas Neo por planilla, el equipo de Talento y Cultura, te enviará por correo la confirmación de tu inclusión a la póliza EPS.',
  },
  {
    icon: 'contact_support',
    question: 'Cometí un error en mis datos, ¿Cómo lo arreglo?',
    answer: 'Por favor, comunícate con el área de RRHH a people@neo.com.pe para realizar la corrección.',
  },
  {
    icon: 'calendar_month',
    question: 'Ya completé mis datos, ¿Cuáles son los siguientes pasos?',
    answer: 'El equipo de Talento y Cultura te enviarán un mail con los siguientes pasos. Cualquier duda adicional puedes escribir a people@neo.com.pe.',
  },
];

function renderAnswer(answer: string) {
  const parts = answer.split('people@neo.com.pe');
  if (parts.length === 1) return <p className="text-[#4D4D70] leading-relaxed whitespace-pre-line">{answer}</p>;
  return (
    <p className="text-[#4D4D70] leading-relaxed whitespace-pre-line">
      {parts.map((part, i) =>
        i < parts.length - 1 ? (
          <span key={i}>
            {part}
            <a href="mailto:people@neo.com.pe" className="font-bold text-[#0A29CD] hover:underline">
              people@neo.com.pe
            </a>
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

function FaqItem({ icon, question, answer }: { icon: string; question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-2xl transition-all duration-300 border ${open ? 'bg-white border-[#0A29CD]/20 shadow-md' : 'bg-white border-[#B3B3C2]/20 hover:shadow-sm'}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-5 flex items-center gap-4 focus:outline-none"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${open ? 'bg-[#0A29CD] text-white' : 'bg-[#0A29CD]/10 text-[#0A29CD]'}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <span className="flex-grow font-headline text-base font-bold text-[#000033]">{question}</span>
        <span
          className="material-symbols-outlined text-[#9999AD] transition-transform duration-300 flex-shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 ml-14">
          {renderAnswer(answer)}
        </div>
      )}
    </div>
  );
}

export default function ProcesoCompleto() {
  const [searchParams] = useSearchParams();
  const yaCompletado = searchParams.get('ya') === '1';

  return (
    <div className="bg-[#F6F5FA] text-[#000033] min-h-screen flex flex-col font-body">
      <TopNavBar />

      {yaCompletado && (
        <div className="w-full bg-[#0A29CD] text-white px-6 py-3 flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-[#56E976] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <p className="text-sm font-semibold">
            Ya completaste tu proceso de onboarding. Esta es tu página de referencia.
          </p>
        </div>
      )}

      <main className="flex-grow pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">

        {/* Hero: left = texto + stats | right = FAQ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#56E976] text-[#000033] mb-6">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="text-xs font-bold uppercase tracking-widest">Registro Completado</span>
              </div>

              <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#000033] leading-tight tracking-tight mb-4">
                ¡Gracias por completar<br />
                <span className="text-[#0A29CD]">tu información!</span>
              </h1>
              <p className="text-[#4D4D70] text-lg leading-relaxed">
                Tu registro fue enviado exitosamente al equipo de Talento y Cultura.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-3">
              {[
                { icon: 'task_alt', label: 'Proceso completado', color: 'text-[#56E976]' },
                { icon: 'mail', label: 'Recibirás un correo de confirmación', color: 'text-[#49C7FD]' },
                { icon: 'support_agent', label: 'Soporte: people@neo.com.pe', color: 'text-[#FFEE53]' },
              ].map((s) => (
                <div key={s.label} className="bg-[#000033] rounded-2xl px-6 py-4 flex items-center gap-4">
                  <span className={`material-symbols-outlined ${s.color} text-2xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {s.icon}
                  </span>
                  <p className="text-white text-sm font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — FAQ */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0A29CD]">Soporte</span>
              <h2 className="font-headline text-2xl font-bold text-[#000033] mt-1 mb-3">Preguntas Frecuentes</h2>
              <div className="h-1.5 w-14 bg-gradient-to-r from-[#49C7FD] to-[#0A29CD] rounded-full" />
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <FaqItem key={item.question} {...item} />
              ))}
            </div>
          </div>

        </section>
      </main>

      <footer className="w-full py-8 bg-[#000033] flex flex-col md:flex-row justify-between items-center px-12 gap-4">
        <img src="/logo_neo.png" alt="NEO" className="h-8 w-auto brightness-0 invert opacity-80" />
        <p className="text-xs uppercase tracking-widest text-[#9999AD]">
          © {new Date().getFullYear()} Neo Seguros. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
