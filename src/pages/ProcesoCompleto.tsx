import { useState } from 'react';
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

function FaqItem({ icon, question, answer }: { icon: string; question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-white rounded-2xl transition-all duration-300 hover:shadow-md border ${open ? 'border-[#00478d]/20' : 'border-transparent'}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-6 md:p-8 flex items-center gap-6 focus:outline-none"
      >
        <div className="w-12 h-12 rounded-xl bg-[#d6e3ff] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[#00478d]">{icon}</span>
        </div>
        <div className="flex-grow">
          <h3 className="font-headline text-lg md:text-xl font-bold text-[#191c21]">{question}</h3>
        </div>
        <span
          className="material-symbols-outlined text-[#9ba3ae] transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-6 md:px-8 pb-8 ml-[4.5rem]">
          <p className="text-[#424752] leading-relaxed whitespace-pre-line">
            {answer.includes('people@neo.com.pe') ? (
              <>
                {answer.split('people@neo.com.pe').map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>
                      {part}
                      <span className="font-bold text-[#00478d]">people@neo.com.pe</span>
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </>
            ) : (
              answer
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProcesoCompleto() {
  return (
    <div className="bg-[#f9f9ff] text-[#191c21] min-h-screen flex flex-col font-body">
      <TopNavBar />

      <main className="flex-grow pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Success Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#65f9e7] text-[#00201d] mb-6">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-xs font-bold uppercase tracking-widest font-label">Registro Completado</span>
            </div>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-[#00478d] mb-8 leading-tight tracking-tight">
              ¡Gracias por completar tu información!
            </h1>
            <p className="text-[#424752] text-lg md:text-xl leading-relaxed max-w-2xl">
              Tu registro ha sido enviado exitosamente. Si tienes alguna duda, puedes consultar nuestra sección de
              preguntas frecuentes a continuación.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="bg-gradient-to-b from-[#00478d] to-[#005eb8] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-[#00478d]/20 hover:opacity-90 active:scale-95 transition-all font-headline">
                Ir al Tablero Principal
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: 'verified_user', title: 'Integridad', desc: 'Actuamos con honestidad y transparencia' },
                { icon: 'school', title: 'Aprendizaje constante', desc: 'Evolucionamos cada día a través del conocimiento' },
                { icon: 'trending_up', title: 'Orientación a resultados', desc: 'Enfocados en alcanzar la excelencia' },
                { icon: 'science', title: 'Experimentación', desc: 'Probamos nuevas ideas para innovar' },
              ].map((card) => (
                <div key={card.title} className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#f0f1f8] flex flex-col items-center text-center group hover:border-[#00478d]/20 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-[#d6e3ff] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[#00478d] text-3xl">{card.icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-[#191c21]">{card.title}</h3>
                  <p className="text-xs text-[#424752] mt-2">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#f2f3fb] rounded-[2.5rem] p-8 md:p-16 mt-8">
          <div className="mb-12">
            <h2 className="font-headline text-3xl font-bold text-[#00478d] mb-2">Preguntas Frecuentes</h2>
            <div className="h-1.5 w-24 bg-[#005149] rounded-full" />
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.question} {...item} />
            ))}
          </div>
        </section>

        {/* Progress indicator */}
        <div className="mt-24 max-w-md mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9ba3ae] mb-4">Progreso del Onboarding</p>
          <div className="h-3 w-full bg-[#e1e2ea] rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-[#40dccb] to-[#005149] rounded-full animate-pulse" />
          </div>
          <p className="mt-3 text-[#005149] font-bold text-sm">¡100% Completado!</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 mt-auto bg-[#f0f1f8] border-t border-[#e1e2ea]/10 flex flex-col md:flex-row justify-between items-center px-12">
        <p className="text-xs uppercase tracking-widest text-[#9ba3ae] mb-4 md:mb-0">
          © 2024 Neo HR Systems. All rights reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-xs uppercase tracking-widest text-[#9ba3ae] hover:underline hover:text-[#00478d]">Privacy Policy</a>
          <a href="#" className="text-xs uppercase tracking-widest text-[#9ba3ae] hover:underline hover:text-[#00478d]">Terms of Service</a>
          <a href="#" className="text-xs uppercase tracking-widest text-[#9ba3ae] hover:underline hover:text-[#00478d]">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
