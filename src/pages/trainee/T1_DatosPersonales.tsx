import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavBar } from '../../components/layout/TopNavBar';
import { BottomNavBar } from '../../components/layout/BottomNavBar';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PhotoUpload } from '../../components/ui/PhotoUpload';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../hooks/useAuth';
import { saveOnboardingStep, uploadPhoto } from '../../lib/services';


export default function T1_DatosPersonales() {
  const navigate = useNavigate();
  const { state, setDatosPersonales } = useOnboarding();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const dp = state.datosPersonales;

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setDatosPersonales({ foto: file, fotoUrl: url });
  }

  function isValid() {
    return dp.fotoUrl && dp.nombres && dp.apellidoPaterno && dp.apellidoMaterno && dp.dni && dp.telefono && dp.fechaNacimiento && dp.edad !== '' && dp.correo && dp.direccion && dp.sexo;
  }

  async function handleNext() {
    if (!isValid() || !user) return;
    setLoading(true);
    try {
      let fotoUrl = dp.fotoUrl;
      if (dp.foto) {
        try {
          fotoUrl = await uploadPhoto(user.id, dp.foto);
          setDatosPersonales({ fotoUrl });
        } catch {
          console.warn('No se pudo subir la foto, se usará URL local.');
        }
      }
      await saveOnboardingStep(user.id, {
        datosPersonales: {
          fotoUrl,
          nombres: dp.nombres,
          apellidoPaterno: dp.apellidoPaterno,
          apellidoMaterno: dp.apellidoMaterno,
          dni: dp.dni,
          telefono: dp.telefono,
          fechaNacimiento: dp.fechaNacimiento,
          edad: dp.edad,
          correo: dp.correo,
          direccion: dp.direccion,
          sexo: dp.sexo,
        },
      });
      navigate('/trainee/fola');
    } catch (e: unknown) {
      console.error('Error guardando datos personales:', (e as { message?: string })?.message ?? e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#f6f5fa] text-[#000033] min-h-screen pb-32">
      <TopNavBar />
      <main className="max-w-5xl mx-auto px-6 pt-12">
        <ProgressBar step="Paso 01" title="Datos Personales" percent={25} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left info */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <p className="text-[#666685] leading-relaxed text-lg">
                Como <span className="font-bold text-[#0a29cd]">NEO Trainee</span>, necesitamos validar tu identidad
                y datos de contacto para tu registro formal. Esta información es estrictamente confidencial.
              </p>

              <div className="bg-[#f6f5fa] p-6 rounded-xl">
                <h3 className="font-headline font-bold text-[#000033] mb-4">Fotografía para Fotocheck</h3>
                <ul className="space-y-3 text-sm text-[#666685]">
                  {[
                    ['Formato', 'JPG'],
                    ['Tamaño', '340 x 402 píxeles'],
                    ['Peso', '25 a 30 KB'],
                    ['Fondo', 'Color blanco'],
                    ['Vestimenta', 'Business Casual o Casual'],
                  ].map(([label, val]) => (
                    <li key={label} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#0a29cd]">check_circle</span>
                      <span><b>{label}:</b> {val}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-[#b3b3c2]/30 flex gap-3">
                  <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                  <p className="text-xs font-semibold text-[#ba1a1a] leading-tight">Nota: No se aceptan selfies.</p>
                </div>
              </div>

              <div className="bg-[#f6f5fa] p-6 rounded-xl flex gap-4 items-start">
                <span className="material-symbols-outlined text-[#0a29cd]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <div>
                  <p className="font-bold text-[#000033] text-sm">Seguridad Garantizada</p>
                  <p className="text-xs text-[#666685]">Tus datos están protegidos bajo los más altos estándares de privacidad corporativa.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8">
            <div className="bg-[#f6f5fa] rounded-[2rem] p-1">
              <div className="bg-white rounded-[1.8rem] p-8 md:p-12 shadow-[0_12px_32px_rgba(25,28,33,0.04)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <PhotoUpload preview={dp.fotoUrl} onFileChange={handleFile} />

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">Nombres</label>
                    <input
                      type="text"
                      value={dp.nombres}
                      onChange={(e) => setDatosPersonales({ nombres: e.target.value })}
                      placeholder="Ej: Juan Carlos"
                      className="w-full bg-[#ccccd6] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0a29cd] focus:bg-white transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">Apellido Paterno</label>
                    <input
                      type="text"
                      value={dp.apellidoPaterno}
                      onChange={(e) => setDatosPersonales({ apellidoPaterno: e.target.value })}
                      placeholder="Ej: Perez"
                      className="w-full bg-[#ccccd6] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0a29cd] focus:bg-white transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">Apellido Materno</label>
                    <input
                      type="text"
                      value={dp.apellidoMaterno}
                      onChange={(e) => setDatosPersonales({ apellidoMaterno: e.target.value })}
                      placeholder="Ej: Garcia"
                      className="w-full bg-[#ccccd6] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0a29cd] focus:bg-white transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">DNI</label>
                    <input
                      type="text"
                      value={dp.dni}
                      onChange={(e) => setDatosPersonales({ dni: e.target.value })}
                      placeholder="8 dígitos"
                      maxLength={8}
                      className="w-full bg-[#ccccd6] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0a29cd] focus:bg-white transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">Teléfono</label>
                    <input
                      type="tel"
                      value={dp.telefono}
                      onChange={(e) => setDatosPersonales({ telefono: e.target.value })}
                      placeholder="+51 900 000 000"
                      className="w-full bg-[#ccccd6] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0a29cd] focus:bg-white transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={dp.fechaNacimiento}
                      onChange={(e) => setDatosPersonales({ fechaNacimiento: e.target.value })}
                      className="w-full bg-[#ccccd6] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0a29cd] focus:bg-white transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">Edad</label>
                    <input
                      type="number"
                      value={dp.edad}
                      onChange={(e) => setDatosPersonales({ edad: Number(e.target.value) })}
                      min={16}
                      max={100}
                      className="w-full bg-[#ccccd6] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0a29cd] focus:bg-white transition-all outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">Sexo</label>
                    <select
                      value={dp.sexo}
                      onChange={(e) => setDatosPersonales({ sexo: e.target.value })}
                      className="w-full bg-[#ccccd6] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0a29cd] focus:bg-white transition-all outline-none appearance-none"
                    >
                      <option value="" disabled>Seleccionar...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={dp.correo}
                      onChange={(e) => setDatosPersonales({ correo: e.target.value })}
                      placeholder="usuario@ejemplo.com"
                      className="w-full bg-[#ccccd6] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0a29cd] focus:bg-white transition-all outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666685] px-1">Dirección</label>
                    <textarea
                      value={dp.direccion}
                      onChange={(e) => setDatosPersonales({ direccion: e.target.value })}
                      placeholder="Av. Las Camelias 455, San Isidro, Lima"
                      rows={2}
                      className="w-full bg-[#ccccd6] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#0a29cd] focus:bg-white transition-all outline-none resize-none"
                    />
                  </div>

                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#f6f5fa] p-6 rounded-2xl flex items-center gap-4">
                <div className="bg-[#0a29cd] p-3 rounded-xl">
                  <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                </div>
                <p className="text-sm font-medium text-[#4d4d70]">Todos los campos son obligatorios para continuar.</p>
              </div>
              <div className="bg-[#0a29cd]/5 p-6 rounded-2xl flex items-center gap-4">
                <div className="bg-[#0a29cd] p-3 rounded-xl">
                  <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <p className="text-sm font-medium text-[#0a29cd]">Tu conexión es segura y tus datos están cifrados.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar
        onBack={() => navigate('/tipo-usuario')}
        onNext={handleNext}
        nextDisabled={!isValid() || loading}
        nextLabel={loading ? 'Guardando...' : 'Next Step'}
      />
    </div>
  );
}
