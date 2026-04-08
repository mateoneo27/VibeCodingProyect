import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { getAllSubmissions } from '../../firebase/services';
import type { FirestoreSubmission } from '../../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<FirestoreSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'planilla' | 'trainee'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [selected, setSelected] = useState<FirestoreSubmission | null>(null);

  useEffect(() => {
    getAllSubmissions()
      .then(setSubmissions)
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await signOut(auth);
    navigate('/');
  }

  const filtered = submissions.filter((s) => {
    if (filter !== 'all' && s.tipoUsuario !== filter) return false;
    if (statusFilter === 'completed' && !s.completado) return false;
    if (statusFilter === 'pending' && s.completado) return false;
    return true;
  });

  const completedCount = submissions.filter((s) => s.completado).length;
  const planillaCount = submissions.filter((s) => s.tipoUsuario === 'planilla').length;
  const traineeCount = submissions.filter((s) => s.tipoUsuario === 'trainee').length;

  return (
    <div className="bg-[#f9f9ff] text-[#191c21] min-h-screen flex flex-col">
      <header className="sticky top-0 w-full z-50 bg-[#f9f9ff]/70 backdrop-blur-xl shadow-[0_12px_32px_rgba(25,28,33,0.06)]">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="text-2xl font-black tracking-tighter text-[#00478d] font-headline">Neo Admin</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#424752] hover:text-[#00478d] font-semibold text-sm transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Salir
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#191c21] font-headline mb-2">
            Panel de Onboarding
          </h1>
          <p className="text-[#424752]">Gestiona y revisa los registros de nuevos colaboradores.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Registros', value: submissions.length, icon: 'group', color: 'text-[#00478d]', bg: 'bg-[#d6e3ff]' },
            { label: 'Completados', value: completedCount, icon: 'check_circle', color: 'text-[#005149]', bg: 'bg-[#65f9e7]/30' },
            { label: 'En Planilla', value: planillaCount, icon: 'badge', color: 'text-[#00478d]', bg: 'bg-[#d6e3ff]' },
            { label: 'Trainees', value: traineeCount, icon: 'school', color: 'text-[#525f74]', bg: 'bg-[#d6e3fc]' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1e2ea]">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
              </div>
              <p className="text-3xl font-black text-[#191c21] font-headline">{stat.value}</p>
              <p className="text-xs font-semibold text-[#424752] uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {(['all', 'planilla', 'trainee'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f ? 'bg-[#00478d] text-white' : 'bg-white text-[#424752] border border-[#e1e2ea] hover:border-[#00478d]'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'planilla' ? 'Planilla' : 'Trainee'}
            </button>
          ))}
          <div className="w-px h-6 bg-[#e1e2ea] self-center" />
          {(['all', 'completed', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === f ? 'bg-[#005149] text-white' : 'bg-white text-[#424752] border border-[#e1e2ea] hover:border-[#005149]'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'completed' ? 'Completados' : 'Pendientes'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#00478d] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List */}
            <div className="lg:col-span-2 space-y-3">
              {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center text-[#424752]">
                  <span className="material-symbols-outlined text-5xl text-[#c2c6d4] mb-4 block">inbox</span>
                  No hay registros con estos filtros.
                </div>
              ) : (
                filtered.map((s) => (
                  <button
                    key={s.uid}
                    onClick={() => setSelected(s)}
                    className={`w-full text-left bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md ${
                      selected?.uid === s.uid ? 'border-[#00478d]/40 shadow-md' : 'border-[#e1e2ea] hover:border-[#c2c6d4]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.tipoUsuario === 'planilla' ? 'bg-[#d6e3ff]' : 'bg-[#d6e3fc]'}`}>
                          <span className={`material-symbols-outlined text-sm ${s.tipoUsuario === 'planilla' ? 'text-[#00478d]' : 'text-[#525f74]'}`}>
                            {s.tipoUsuario === 'planilla' ? 'badge' : 'school'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-[#191c21]">{s.datosPersonales?.nombres || s.email}</p>
                          <p className="text-xs text-[#424752]">{s.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.tipoUsuario === 'planilla' ? 'bg-[#d6e3ff] text-[#00478d]' : 'bg-[#d6e3fc] text-[#525f74]'}`}>
                          {s.tipoUsuario}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${s.completado ? 'bg-[#005149]' : 'bg-[#c2c6d4]'}`} />
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-1">
              {selected ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e1e2ea] sticky top-24 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold font-headline">Detalle</h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${selected.completado ? 'bg-[#65f9e7]/30 text-[#005149]' : 'bg-[#e1e2ea] text-[#424752]'}`}>
                      {selected.completado ? 'Completado' : 'Pendiente'}
                    </span>
                  </div>

                  {selected.datosPersonales?.fotoUrl && (
                    <img src={selected.datosPersonales.fotoUrl} alt="Fotocheck" className="w-24 h-auto rounded-xl mx-auto object-cover shadow" />
                  )}

                  <div className="space-y-3">
                    {[
                      ['Tipo', selected.tipoUsuario],
                      ['Nombre', selected.datosPersonales?.nombres],
                      ['DNI', selected.datosPersonales?.dni],
                      ['Teléfono', selected.datosPersonales?.telefono],
                      ['Correo', selected.datosPersonales?.correo || selected.email],
                      ['Dirección', selected.datosPersonales?.direccion],
                      ...(selected.tipoUsuario === 'planilla'
                        ? [
                            ['EPS Rímac', selected.beneficioEPS?.desea ? 'Sí' : 'No'],
                            ['Oncosalud', selected.oncosalud?.desea ? 'Sí' : 'No'],
                            ['Fecha Examen', selected.examenMedico?.fechaSugerida || '—'],
                          ]
                        : [
                            ['FOLA - Sexo', selected.fola?.sexo],
                            ['FOLA - Remuneración', selected.fola?.remuneracion ? `S/ ${selected.fola.remuneracion}` : '—'],
                            ['Oncosalud', selected.oncosalud?.desea ? 'Sí' : 'No'],
                          ]),
                    ].filter(([, v]) => v).map(([label, val]) => (
                      <div key={label} className="flex justify-between gap-4 py-2 border-b border-[#f0f1f8] last:border-0">
                        <span className="text-xs font-bold text-[#58657a] uppercase tracking-wider">{label}</span>
                        <span className="text-xs font-semibold text-[#191c21] text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center text-[#424752] border border-[#e1e2ea]">
                  <span className="material-symbols-outlined text-5xl text-[#c2c6d4] mb-4 block">person_search</span>
                  <p className="text-sm">Selecciona un registro para ver el detalle.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
