import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, getAllSubmissions, uploadPhoto } from '../../lib/services';
import { supabase } from '../../lib/supabase';
import { buildNombreCompleto } from '../../utils/names';
import type { FirestoreSubmission, AdminData, DatosPersonales, BeneficioEPS, BeneficioOncosalud, ExamenMedico, BeneficioFOLA } from '../../types';

type TypeFilter   = 'all' | 'planilla' | 'trainee';
type StatusFilter = 'all' | 'completed' | 'pending';

const DEFAULT_ADMIN: AdminData = { perfilNumero: '', tipo: '', protocolo: '' };

// ── EPS email config — replace with real addresses ────────────────────────────
const EPS_TO  = 'mateo.solorzano@neo.com.pe';          // TODO: replace with real TO address
const EPS_CC  = 'matsv2703@gmail.com,mateo.solorzano.v@uni.pe';  // TODO: replace with real CC addresses
const ONCO_TO = 'mateo.solorzano@neo.com.pe';

function buildEpsGmailUrl(s: FirestoreSubmission): string {
  const nombre = buildNombreCompleto(s.datosPersonales, '(sin nombre)');
  const dni    = s.datosPersonales?.dni     ?? '(sin DNI)';
  const correo = s.datosPersonales?.correo  ?? s.email ?? '(sin correo)';
  const body   =
    `Estimada Juana,\n\n` +
    `Espero que se encuentre bien.\n\n` +
    `Para comentarte que debemos incluir a los siguientes colaboradores en la Póliza EPS de Neo Consulting:\n\n` +
    `• ${nombre} - DNI ${dni}\n` +
    `  Correo: ${correo}\n\n` +
    `Muchas gracias por tu apoyo.\n\n` +
    `Saludos.`;
  const params = new URLSearchParams({
    to:   EPS_TO,
    cc:   EPS_CC,
    su:   'Inclusión Póliza EPS | Neo Consulting',
    body,
  });
  return `https://mail.google.com/mail/?view=cm&${params.toString()}`;
}

function buildOncoGmailUrl(s: FirestoreSubmission): string {
  const nombre  = s.oncosalud?.nombres || buildNombreCompleto(s.datosPersonales, '(sin nombre)');
  const dni     = s.oncosalud?.dni || s.datosPersonales?.dni || '(sin DNI)';
  const celular = s.oncosalud?.celular || s.datosPersonales?.telefono || '(sin celular)';
  const correo  = s.oncosalud?.correo || s.datosPersonales?.correo || s.email || '(sin correo)';
  const body =
    `Hola Juan,\n` +
    `Espero estés muy bien. Queremos afiliar a la siguiente persona a la póliza de Neo.\n` +
    `Favor tu apoyo en indicarnos qué datos y/o documentos necesitas para ello.\n` +
    `• Nombre: ${nombre}\n` +
    `• DNI: ${dni}\n` +
    `• Celular: ${celular}\n` +
    `• Correo: ${correo}\n\n` +
    `Quedo atenta, \n\n` +
    `Saludos.`;
  const params = new URLSearchParams({
    to: ONCO_TO,
    su: 'Inclusión seguro Oncológico | Neo Consulting',
    body,
  });
  return `https://mail.google.com/mail/?view=cm&${params.toString()}`;
}

// ── Reusable field components ─────────────────────────────────────────────────

const inputCls = 'w-full bg-[#F6F5FA] border border-[#B3B3C2]/40 rounded-xl px-4 py-2.5 text-sm text-[#000033] placeholder:text-[#9999AD] focus:outline-none focus:ring-2 focus:ring-[#0A29CD]/30 focus:border-[#0A29CD] transition-all';
const labelCls = 'block text-xs font-bold text-[#666685] uppercase tracking-widest mb-1';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#B3B3C2]/20">
      <span className="material-symbols-outlined text-[#0A29CD] text-[18px]">{icon}</span>
      <span className="text-sm font-black uppercase tracking-widest text-[#0A29CD]">{title}</span>
    </div>
  );
}

// ── Email actions (visual only) ───────────────────────────────────────────────

function EmailActions({ s }: { s: FirestoreSubmission }) {
  const isTrainee = s.tipoUsuario === 'trainee';
  const base = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all border';
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {isTrainee ? (
        <button title="Enviar correo FOLA"
          className={`${base} bg-[#0A29CD]/8 border-[#0A29CD]/20 text-[#0A29CD] hover:bg-[#0A29CD]/15`}
          onClick={(e) => e.stopPropagation()}>
          <span className="material-symbols-outlined text-[14px]">health_and_safety</span>
          <span className="hidden sm:inline">FOLA</span>
        </button>
      ) : (
        <a href={buildEpsGmailUrl(s)} target="_blank" rel="noopener noreferrer" title="Enviar correo EPS"
          className={`${base} bg-[#0A29CD]/8 border-[#0A29CD]/20 text-[#0A29CD] hover:bg-[#0A29CD]/15`}
          onClick={(e) => e.stopPropagation()}>
          <span className="material-symbols-outlined text-[14px]">health_and_safety</span>
          <span className="hidden sm:inline">EPS</span>
        </a>
      )}
      <a href={buildOncoGmailUrl(s)} target="_blank" rel="noopener noreferrer" title="Enviar correo Oncosalud"
        className={`${base} bg-[#49C7FD]/10 border-[#49C7FD]/30 text-[#000033] hover:bg-[#49C7FD]/20`}
        onClick={(e) => e.stopPropagation()}>
        <span className="material-symbols-outlined text-[14px]">favorite</span>
        <span className="hidden sm:inline">Onco</span>
      </a>
      <button
        title={isTrainee ? 'Solo disponible para colaboradores en planilla' : 'Enviar correo Examen Ocupacional'}
        disabled={isTrainee}
        className={`${base} ${isTrainee ? 'bg-[#F6F5FA] border-[#B3B3C2]/30 text-[#B3B3C2] cursor-not-allowed' : 'bg-[#56E976]/10 border-[#56E976]/30 text-[#1a6b2e] hover:bg-[#56E976]/20'}`}
        onClick={(e) => e.stopPropagation()}>
        <span className="material-symbols-outlined text-[14px]">{isTrainee ? 'lock' : 'medical_services'}</span>
        <span className="hidden sm:inline">Examen</span>
      </button>
    </div>
  );
}

function SubmissionName({ s }: { s: FirestoreSubmission }) {
  return <>{buildNombreCompleto(s.datosPersonales, '(sin nombre)')}</>;
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function UserModal({
  s,
  onClose,
  onSaved,
}: {
  s: FirestoreSubmission;
  onClose: () => void;
  onSaved: (uid: string, updated: Partial<FirestoreSubmission>) => void;
}) {
  const isTrainee = s.tipoUsuario === 'trainee';
  const photoInputRef = useRef<HTMLInputElement>(null);

  // ── editable state ──
  const [dp, setDp]     = useState<Omit<DatosPersonales, 'foto'>>({
    fotoUrl:         s.datosPersonales?.fotoUrl         ?? '',
    nombres:         s.datosPersonales?.nombres         ?? '',
    apellidoPaterno: s.datosPersonales?.apellidoPaterno ?? '',
    apellidoMaterno: s.datosPersonales?.apellidoMaterno ?? '',
    dni:             s.datosPersonales?.dni             ?? '',
    telefono:        s.datosPersonales?.telefono        ?? '',
    fechaNacimiento: s.datosPersonales?.fechaNacimiento ?? '',
    edad:            s.datosPersonales?.edad            ?? '',
    correo:          s.datosPersonales?.correo          ?? '',
    direccion:       s.datosPersonales?.direccion       ?? '',
  });
  const [eps, setEps]   = useState<BeneficioEPS>(s.beneficioEPS ?? { desea: false });
  const [onco, setOnco] = useState<BeneficioOncosalud>(s.oncosalud ?? { desea: false, nombres: '', dni: '', celular: '', correo: '' });
  const [exam, setExam] = useState<ExamenMedico>(s.examenMedico ?? { fechaSugerida: '' });
  const [fola, setFola] = useState<BeneficioFOLA>(s.fola ?? { nombres: '', dni: '', fechaNacimiento: '', sexo: '', remuneracion: '' });
  const [admin, setAdmin] = useState<AdminData>(s.adminData ?? DEFAULT_ADMIN);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(s.datosPersonales?.fotoUrl ?? '');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Solo se aceptan archivos de imagen.'); return; }
    if (file.size > 100 * 1024) { alert('Máximo 100 KB.'); return; }
    setNewPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      let fotoUrl = dp.fotoUrl;
      if (newPhoto) {
        fotoUrl = await uploadPhoto(s.uid, newPhoto);
      }

      const datosPersonales = { ...dp, fotoUrl };
      const { error } = await supabase
        .from('users')
        .update({
          datos_personales: datosPersonales,
          beneficio_eps: eps,
          oncosalud: onco,
          examen_medico: exam,
          fola,
          admin_data: admin,
          updated_at: new Date().toISOString(),
        })
        .eq('id', s.uid);

      if (error) throw error;

      const updated: FirestoreSubmission = {
        ...s,
        datosPersonales,
        beneficioEPS: eps,
        oncosalud: onco,
        examenMedico: exam,
        fola,
        adminData: admin,
      };

      onSaved(s.uid, updated);
      setDp(datosPersonales);
      setEps(eps);
      setOnco(onco);
      setExam(exam);
      setFola(fola);
      setAdmin(admin);
      setPhotoPreview(fotoUrl);
      setSaved(true);
      setNewPhoto(null);
    } catch (e) {
      console.error('Error guardando:', e);
      alert(`No se pudo guardar: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000033]/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="bg-[#000033] px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Photo — clickable to change */}
            <div className="relative cursor-pointer group" onClick={() => photoInputRef.current?.click()}>
              {photoPreview ? (
                <img src={photoPreview} alt="Fotocheck" className="w-14 h-14 rounded-xl object-cover border-2 border-white/20" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center border-2 border-white/20">
                  <span className="material-symbols-outlined text-white/40 text-3xl">account_circle</span>
                </div>
              )}
              <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-lg">photo_camera</span>
              </div>
            </div>
            <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

            <div>
              <h2 className="text-lg font-bold text-white font-headline leading-none">{buildNombreCompleto(dp, '(sin nombre)')}</h2>
              <p className="text-white/50 text-sm mt-0.5">{s.email}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${isTrainee ? 'bg-[#49C7FD]/20 text-[#49C7FD]' : 'bg-[#0A29CD]/30 text-[#49C7FD]'}`}>
              {s.tipoUsuario ?? '—'}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.completado ? 'bg-[#56E976]/20 text-[#56E976]' : 'bg-[#FFEE53]/20 text-[#FFEE53]'}`}>
              {s.completado ? 'Completado' : 'Pendiente'}
            </span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-grow px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ── LEFT COLUMN ── */}
            <div className="space-y-6">

              {/* Datos Personales */}
              <div>
                <SectionHeader icon="person" title="Datos Personales" />
                <div className="space-y-3">
                  <Field label="Nombres">
                    <input className={inputCls} value={dp.nombres} onChange={(e) => { setDp(p => ({ ...p, nombres: e.target.value })); setSaved(false); }} placeholder="Juan Carlos" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Apellido Paterno">
                      <input className={inputCls} value={dp.apellidoPaterno} onChange={(e) => { setDp(p => ({ ...p, apellidoPaterno: e.target.value })); setSaved(false); }} placeholder="Pérez" />
                    </Field>
                    <Field label="Apellido Materno">
                      <input className={inputCls} value={dp.apellidoMaterno} onChange={(e) => { setDp(p => ({ ...p, apellidoMaterno: e.target.value })); setSaved(false); }} placeholder="García" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="DNI">
                      <input className={inputCls} value={dp.dni} maxLength={8} onChange={(e) => { setDp(p => ({ ...p, dni: e.target.value })); setSaved(false); }} placeholder="12345678" />
                    </Field>
                    <Field label="Teléfono">
                      <input className={inputCls} value={dp.telefono} onChange={(e) => { setDp(p => ({ ...p, telefono: e.target.value })); setSaved(false); }} placeholder="+51 999 999 999" />
                    </Field>
                    <Field label="Fecha de Nacimiento">
                      <input type="date" className={inputCls} value={dp.fechaNacimiento} onChange={(e) => { setDp(p => ({ ...p, fechaNacimiento: e.target.value })); setSaved(false); }} />
                    </Field>
                    <Field label="Edad">
                      <input type="number" className={inputCls} value={dp.edad} min={14} max={100} onChange={(e) => { setDp(p => ({ ...p, edad: Number(e.target.value) })); setSaved(false); }} />
                    </Field>
                  </div>
                  <Field label="Correo Electrónico">
                    <input type="email" className={inputCls} value={dp.correo} onChange={(e) => { setDp(p => ({ ...p, correo: e.target.value })); setSaved(false); }} placeholder="usuario@neo.com.pe" />
                  </Field>
                  <Field label="Dirección">
                    <textarea className={inputCls + ' resize-none'} rows={2} value={dp.direccion} onChange={(e) => { setDp(p => ({ ...p, direccion: e.target.value })); setSaved(false); }} placeholder="Av. Las Camelias 455, Lima" />
                  </Field>
                </div>
              </div>

              {/* FOLA (trainee) */}
              {isTrainee && (
                <div>
                  <SectionHeader icon="health_and_safety" title="Seguro FOLA" />
                  <div className="space-y-3">
                    <Field label="Nombre Completo">
                      <input className={inputCls} value={fola.nombres} onChange={(e) => { setFola(p => ({ ...p, nombres: e.target.value })); setSaved(false); }} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="DNI">
                        <input className={inputCls} value={fola.dni} maxLength={8} onChange={(e) => { setFola(p => ({ ...p, dni: e.target.value })); setSaved(false); }} />
                      </Field>
                      <Field label="Fecha Nacimiento">
                        <input type="date" className={inputCls} value={fola.fechaNacimiento} onChange={(e) => { setFola(p => ({ ...p, fechaNacimiento: e.target.value })); setSaved(false); }} />
                      </Field>
                      <Field label="Sexo">
                        <select className={inputCls} value={fola.sexo} onChange={(e) => { setFola(p => ({ ...p, sexo: e.target.value })); setSaved(false); }}>
                          <option value="">Seleccionar...</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Femenino">Femenino</option>
                        </select>
                      </Field>
                      <Field label="Remuneración (S/)">
                        <input type="number" className={inputCls} value={fola.remuneracion} onChange={(e) => { setFola(p => ({ ...p, remuneracion: Number(e.target.value) })); setSaved(false); }} placeholder="0.00" />
                      </Field>
                    </div>
                  </div>
                </div>
              )}

              {/* EPS (planilla) */}
              {!isTrainee && (
                <div>
                  <SectionHeader icon="health_and_safety" title="EPS Rímac" />
                  <div className="flex gap-4">
                    {[{ val: true, label: 'Sí, afiliar' }, { val: false, label: 'No' }].map(({ val, label }) => (
                      <label key={label} className={`flex-1 flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${eps.desea === val ? 'border-[#0A29CD] bg-[#0A29CD]/5' : 'border-[#B3B3C2]/30 hover:border-[#B3B3C2]'}`}>
                        <input type="radio" name="eps" checked={eps.desea === val} onChange={() => { setEps({ desea: val }); setSaved(false); }} className="accent-[#0A29CD]" />
                        <span className="text-sm font-semibold text-[#000033]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-6">

              {/* Oncosalud */}
              <div>
                <SectionHeader icon="favorite" title="Oncosalud" />
                <div className="space-y-3">
                  <div className="flex gap-4">
                    {[{ val: true, label: 'Sí, afiliar' }, { val: false, label: 'No' }].map(({ val, label }) => (
                      <label key={label} className={`flex-1 flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${onco.desea === val ? 'border-[#0A29CD] bg-[#0A29CD]/5' : 'border-[#B3B3C2]/30 hover:border-[#B3B3C2]'}`}>
                        <input type="radio" name="onco" checked={onco.desea === val} onChange={() => { setOnco(p => ({ ...p, desea: val })); setSaved(false); }} className="accent-[#0A29CD]" />
                        <span className="text-sm font-semibold text-[#000033]">{label}</span>
                      </label>
                    ))}
                  </div>
                  {onco.desea && (
                    <div className="space-y-3">
                      <Field label="Nombre Completo">
                        <input className={inputCls} value={onco.nombres} onChange={(e) => { setOnco(p => ({ ...p, nombres: e.target.value })); setSaved(false); }} />
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="DNI">
                          <input className={inputCls} value={onco.dni} maxLength={8} onChange={(e) => { setOnco(p => ({ ...p, dni: e.target.value })); setSaved(false); }} />
                        </Field>
                        <Field label="Celular">
                          <input className={inputCls} value={onco.celular} onChange={(e) => { setOnco(p => ({ ...p, celular: e.target.value })); setSaved(false); }} />
                        </Field>
                      </div>
                      <Field label="Correo">
                        <input type="email" className={inputCls} value={onco.correo} onChange={(e) => { setOnco(p => ({ ...p, correo: e.target.value })); setSaved(false); }} />
                      </Field>
                    </div>
                  )}
                </div>
              </div>

              {/* Examen Médico (planilla) */}
              {!isTrainee && (
                <div>
                  <SectionHeader icon="medical_services" title="Examen Médico" />
                  <Field label="Fecha y hora sugerida">
                    <input className={inputCls} value={exam.fechaSugerida} onChange={(e) => { setExam({ fechaSugerida: e.target.value }); setSaved(false); }} placeholder="Ej: Próximo martes 8:00 AM" />
                  </Field>
                </div>
              )}

              {/* Registro (read-only) */}
              <div>
                <SectionHeader icon="schedule" title="Registro" />
                <div className="space-y-2 bg-[#F6F5FA] rounded-xl px-4 py-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666685] font-medium">Ingresado</span>
                    <span className="font-semibold text-[#000033]">{s.createdAt ? new Date(s.createdAt).toLocaleString('es-PE') : '—'}</span>
                  </div>
                  {s.completadoAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#666685] font-medium">Completado</span>
                      <span className="font-semibold text-[#000033]">{new Date(s.completadoAt).toLocaleString('es-PE')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Datos Internos Admin ── */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#B3B3C2]/20">
                  <span className="material-symbols-outlined text-[#0A29CD] text-[18px]">admin_panel_settings</span>
                  <span className="text-sm font-black uppercase tracking-widest text-[#0A29CD]">Datos Internos (Admin)</span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#666685] uppercase tracking-widest mb-1">
                      Perfil N°
                    </label>
                    <input 
                      className="w-full bg-[#F6F5FA] border border-[#B3B3C2]/40 rounded-xl px-4 py-2.5 text-sm text-[#000033] placeholder:text-[#9999AD] focus:outline-none focus:ring-2 focus:ring-[#0A29CD]/30 focus:border-[#0A29CD] transition-all" 
                      placeholder="Ej: 0042" 
                      value={admin.perfilNumero}
                      onChange={(e) => { setAdmin((p) => ({ ...p, perfilNumero: e.target.value })); setSaved(false); }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#666685] uppercase tracking-widest mb-1">
                      Tipo
                    </label>
                    <select 
                      className="w-full bg-[#F6F5FA] border border-[#B3B3C2]/40 rounded-xl px-4 py-2.5 text-sm text-[#000033] focus:outline-none focus:ring-2 focus:ring-[#0A29CD]/30 focus:border-[#0A29CD] transition-all appearance-none"
                      value={admin.tipo}
                      onChange={(e) => { setAdmin((p) => ({ ...p, tipo: e.target.value as AdminData['tipo'] })); setSaved(false); }}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="EMPO">EMPO</option>
                      <option value="EMOA">EMOA</option>
                      <option value="EMOR">EMOR</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#666685] uppercase tracking-widest mb-1">
                      Protocolo
                    </label>
                    <input 
                      className="w-full bg-[#F6F5FA] border border-[#B3B3C2]/40 rounded-xl px-4 py-2.5 text-sm text-[#000033] placeholder:text-[#9999AD] focus:outline-none focus:ring-2 focus:ring-[#0A29CD]/30 focus:border-[#0A29CD] transition-all" 
                      placeholder="AD" 
                      value={admin.protocolo}
                      onChange={(e) => { setAdmin((p) => ({ ...p, protocolo: e.target.value })); setSaved(false); }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-[#B3B3C2]/20 flex-shrink-0">
          <p className="text-sm text-[#9999AD]">Haz clic en la foto para cambiarla.</p>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-bold text-[#1a6b2e]">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Guardado
              </span>
            )}
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#B3B3C2]/40 text-sm font-semibold text-[#666685] hover:bg-[#F6F5FA] transition-all">
              Cerrar
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-2.5 bg-[#0A29CD] text-white rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2">
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Guardando...</>
              ) : (
                <><span className="material-symbols-outlined text-[16px]">save</span>Guardar cambios</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Add User Modal ────────────────────────────────────────────────────────────

function AddUserModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    setLoading(true);
    try {
      // Call the RPC function directly via REST endpoint for faster timeout
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/create_new_user`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ user_email: email, user_password: '123456' }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 409) {
        setError('Este correo ya está registrado.');
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${response.status}`);
      }

      setCreated(true);
    } catch (err) {
      const msg = (err as Error).message ?? '';
      if (msg.includes('abort') || msg.includes('timeout')) {
        setError('La operación tardó demasiado. Verifica que la función existe en Supabase SQL Editor.');
      } else if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('duplicate')) {
        setError('Este correo ya está registrado.');
      } else if (msg.toLowerCase().includes('does not exist')) {
        setError('La función no existe. Ejecuta el SQL en Supabase SQL Editor.');
      } else {
        setError(`No se pudo registrar el usuario: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000033]/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-[#000033] px-7 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A29CD]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">person_add</span>
            </div>
            <h2 className="text-lg font-bold text-white font-headline">Agregar Usuario</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {created ? (
          /* Success state */
          <div className="px-7 py-12 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#56E976]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#1a6b2e] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-[#000033] font-headline">¡Usuario registrado!</h3>
            <p className="text-sm text-[#666685]">
              El correo <strong className="text-[#000033]">{email}</strong> fue registrado exitosamente.
            </p>
            <div className="bg-[#F6F5FA] rounded-xl px-5 py-3 mt-2 w-full">
              <p className="text-xs text-[#666685]">El usuario debe ir al sitio y crear su cuenta con esta dirección de correo.</p>
            </div>
            <button onClick={onClose} className="mt-4 px-8 py-3 bg-[#0A29CD] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all">
              Cerrar
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleCreate} className="px-7 py-8 space-y-6">
            <div>
              <p className="text-sm text-[#666685] mb-4">
                Registra el correo electrónico del nuevo usuario. Luego deberá ir al sitio y crear su propia cuenta.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#666685]">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@neo.com.pe"
                className="w-full bg-[#F6F5FA] border border-[#B3B3C2]/40 rounded-xl px-4 py-3 text-sm text-[#000033] placeholder:text-[#9999AD] focus:outline-none focus:ring-2 focus:ring-[#0A29CD]/30 focus:border-[#0A29CD] transition-all"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-[#ba1a1a] bg-[#ffdad6] px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button onClick={onClose} className="flex-1 px-5 py-3 rounded-xl border border-[#B3B3C2]/40 text-sm font-semibold text-[#666685] hover:bg-[#F6F5FA] transition-all">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 px-5 py-3 bg-[#0A29CD] text-white rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creando...</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">person_add</span>Crear Usuario</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions]   = useState<FirestoreSubmission[]>([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch]             = useState('');
  const [modalUser, setModalUser]       = useState<FirestoreSubmission | null>(null);
  const [showAddUser, setShowAddUser]   = useState(false);

  useEffect(() => {
    getAllSubmissions().then(setSubmissions).finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    try {
      await signOut();
    } catch (e) {
      console.error('Error signing out:', e);
    } finally {
      navigate('/');
    }
  }

  function handleSaved(uid: string, updated: Partial<FirestoreSubmission>) {
    setSubmissions((prev) => prev.map((s) => s.uid === uid ? { ...s, ...updated } : s));
    setModalUser((prev) => prev?.uid === uid ? { ...prev, ...updated } : prev);
  }

  const filtered = submissions.filter((s) => {
    if (filter !== 'all' && s.tipoUsuario !== filter) return false;
    if (statusFilter === 'completed' && !s.completado) return false;
    if (statusFilter === 'pending'   && s.completado)  return false;
    if (search) {
      const q = search.toLowerCase();
      const nombreCompleto = buildNombreCompleto(s.datosPersonales).toLowerCase();
      if (
        !nombreCompleto.includes(q) &&
        !(s.email ?? '').toLowerCase().includes(q) &&
        !(s.datosPersonales?.dni ?? '').toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const total     = submissions.length;
  const completed = submissions.filter((s) => s.completado).length;
  const planilla  = submissions.filter((s) => s.tipoUsuario === 'planilla').length;
  const trainee   = submissions.filter((s) => s.tipoUsuario === 'trainee').length;

  return (
    <div className="bg-[#F6F5FA] text-[#000033] min-h-screen flex flex-col">

      {modalUser && <UserModal s={modalUser} onClose={() => setModalUser(null)} onSaved={handleSaved} />}
      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} />}

      <header className="sticky top-0 w-full z-40 bg-[#000033] shadow-lg">
        <div className="flex justify-between items-center px-8 py-3">
          <div className="flex items-center gap-4">
            <img src="/logo_neo.png" alt="NEO" className="h-9 w-auto brightness-0 invert" />
            <div className="w-px h-6 bg-white/20" />
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Panel Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowAddUser(true)} className="flex items-center gap-2 bg-[#0A29CD] text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-[#0A29CD]/90 transition-all">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Agregar Usuario
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-white/60 hover:text-white font-semibold text-sm transition-colors">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#000033] font-headline">Panel de Onboarding</h1>
          <p className="text-[#666685] mt-1">Gestiona y revisa los registros de nuevos colaboradores.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',       value: total,     icon: 'group',        bg: 'bg-[#000033]',    accent: 'text-[#49C7FD]', textVal: 'text-white',     sub: 'text-white/50' },
            { label: 'Completados', value: completed, icon: 'check_circle', bg: 'bg-[#56E976]/15', accent: 'text-[#1a6b2e]', textVal: 'text-[#000033]', sub: 'text-[#666685]' },
            { label: 'En Planilla', value: planilla,  icon: 'badge',        bg: 'bg-[#0A29CD]/10', accent: 'text-[#0A29CD]', textVal: 'text-[#000033]', sub: 'text-[#666685]' },
            { label: 'Trainees',    value: trainee,   icon: 'school',       bg: 'bg-[#49C7FD]/15', accent: 'text-[#000033]', textVal: 'text-[#000033]', sub: 'text-[#666685]' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 flex items-center gap-4`}>
              <span className={`material-symbols-outlined text-3xl ${stat.accent}`} style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
              <div>
                <p className={`text-3xl font-black font-headline ${stat.textVal}`}>{stat.value}</p>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${stat.sub}`}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9999AD] text-[20px]">search</span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, DNI o correo..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#B3B3C2]/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A29CD]/30 focus:border-[#0A29CD]" />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {(['all', 'planilla', 'trainee'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-[#0A29CD] text-white' : 'bg-white text-[#666685] border border-[#B3B3C2]/30 hover:border-[#0A29CD]/40'}`}>
                {f === 'all' ? 'Todos' : f === 'planilla' ? 'Planilla' : 'Trainee'}
              </button>
            ))}
            <div className="w-px h-5 bg-[#B3B3C2]/40 mx-1" />
            {(['all', 'completed', 'pending'] as const).map((f) => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === f ? 'bg-[#000033] text-white' : 'bg-white text-[#666685] border border-[#B3B3C2]/30 hover:border-[#000033]/40'}`}>
                {f === 'all' ? 'Todos' : f === 'completed' ? 'Completados' : 'Pendientes'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#0A29CD] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-[#666685] border border-[#B3B3C2]/20">
            <span className="material-symbols-outlined text-5xl text-[#B3B3C2] mb-3 block">inbox</span>
            No hay registros con estos filtros.
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#9999AD] uppercase tracking-widest mb-3">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </p>
            {filtered.map((s) => (
              <div key={s.uid} className="bg-white rounded-2xl border border-[#B3B3C2]/20 hover:shadow-sm hover:border-[#B3B3C2]/40 transition-all">
                <div className="flex items-center px-5 py-4 gap-4">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden ${s.tipoUsuario === 'planilla' ? 'bg-[#0A29CD]/10' : 'bg-[#49C7FD]/15'}`}>
                    {s.datosPersonales?.fotoUrl ? (
                      <img src={s.datosPersonales.fotoUrl} alt="" className="w-10 h-10 object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className={`material-symbols-outlined text-[18px] ${s.tipoUsuario === 'planilla' ? 'text-[#0A29CD]' : 'text-[#000033]'}`}>
                          {s.tipoUsuario === 'planilla' ? 'badge' : 'school'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <button className="flex-grow min-w-0 text-left" onClick={() => setModalUser(s)}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-[#000033] text-sm truncate"><SubmissionName s={s} /></p>
                      {s.adminData?.perfilNumero && (
                        <span className="text-[10px] font-bold bg-[#FFEE53]/40 text-[#7a6800] px-2 py-0.5 rounded-full">#{s.adminData.perfilNumero}</span>
                      )}
                      {s.adminData?.tipo && (
                        <span className="text-[10px] font-bold bg-[#000033]/10 text-[#000033] px-2 py-0.5 rounded-full">{s.adminData.tipo}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-[11px] text-[#666685] truncate">{s.email}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${s.tipoUsuario === 'planilla' ? 'bg-[#0A29CD]/10 text-[#0A29CD]' : 'bg-[#49C7FD]/20 text-[#000033]'}`}>
                        {s.tipoUsuario ?? '—'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.completado ? 'bg-[#56E976]/20 text-[#1a6b2e]' : 'bg-[#FFEE53]/30 text-[#7a6800]'}`}>
                        {s.completado ? 'Completo' : 'Pendiente'}
                      </span>
                    </div>
                  </button>

                  <EmailActions s={s} />

                  <button onClick={() => setModalUser(s)} className="text-[#B3B3C2] hover:text-[#0A29CD] transition-colors ml-1 flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
