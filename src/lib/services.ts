import { supabase } from './supabase';
import type { OnboardingData, FirestoreSubmission, TipoUsuario, AdminData } from '../types';

const REQUEST_TIMEOUT_MS = 15000;

function withTimeout<T>(request: PromiseLike<T>, message: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return Promise.race([
    Promise.resolve(request),
    new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(message)), REQUEST_TIMEOUT_MS);
    }),
  ]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
}

// ── Auth helpers ────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ── Users / roles ───────────────────────────────────────────────────────────

export async function setUserRole(uid: string, email: string, role: 'admin' | 'user' = 'user') {
  const { error } = await supabase
    .from('users')
    .upsert({ id: uid, email, role });
  if (error) throw error;
}

export async function getUserRole(uid: string): Promise<'admin' | 'user'> {
  const { data } = await withTimeout(
    supabase
      .from('users')
      .select('role')
      .eq('id', uid)
      .maybeSingle(),
    'No se pudo validar el rol del usuario. Intenta recargar la pagina.'
  );
  if (!data) return 'user';
  return (data.role as 'admin' | 'user') || 'user';
}

// ── Column name mappers (camelCase ↔ snake_case) ─────────────────────────────

type DbRow = Record<string, unknown>;

/** camelCase OnboardingData keys → snake_case DB columns */
function toDb(data: Partial<OnboardingData & { completado?: boolean; email?: string }>): DbRow {
  const row: DbRow = {};
  if ('tipoUsuario'    in data) row['tipo_usuario']     = data.tipoUsuario;
  if ('datosPersonales' in data) {
    // Never persist blob: URLs — they are session-only object URLs
    const dp = data.datosPersonales ? { ...data.datosPersonales } : data.datosPersonales;
    if (dp && dp.fotoUrl?.startsWith('blob:')) dp.fotoUrl = '';
    row['datos_personales'] = dp;
  }
  if ('beneficioEPS'   in data) row['beneficio_eps']    = data.beneficioEPS;
  if ('oncosalud'      in data) row['oncosalud']        = data.oncosalud;
  if ('examenMedico'   in data) row['examen_medico']    = data.examenMedico;
  if ('fola'           in data) row['fola']             = data.fola;
  if ('email'          in data) row['email']            = data.email;
  if ('completado'     in data) row['completado']       = data.completado;
  return row;
}

/** snake_case DB row → camelCase OnboardingData */
function fromDb(row: DbRow): Partial<OnboardingData> {
  const dp = row['datos_personales'] as OnboardingData['datosPersonales'] | undefined;
  // blob: URLs only exist in the tab that created them — strip them out
  if (dp && dp.fotoUrl?.startsWith('blob:')) dp.fotoUrl = '';
  return {
    tipoUsuario:     row['tipo_usuario']     as OnboardingData['tipoUsuario']     ?? null,
    datosPersonales: dp,
    beneficioEPS:    row['beneficio_eps']    as OnboardingData['beneficioEPS']    ?? undefined,
    oncosalud:       row['oncosalud']        as OnboardingData['oncosalud']       ?? undefined,
    examenMedico:    row['examen_medico']    as OnboardingData['examenMedico']    ?? undefined,
    fola:            row['fola']             as OnboardingData['fola']            ?? undefined,
  };
}

// ── Onboarding ──────────────────────────────────────────────────────────────

export async function saveOnboardingStep(
  uid: string,
  data: Partial<OnboardingData & { completado?: boolean; email?: string }>
) {
  const { error } = await withTimeout(
    supabase
      .from('users')
      .update({ ...toDb(data), updated_at: new Date().toISOString() })
      .eq('id', uid),
    'La carga de datos esta tardando demasiado. Revisa tu conexion e intenta nuevamente.'
  );
  if (error) throw error;
}

export async function completeOnboarding(uid: string) {
  const { error } = await withTimeout(
    supabase
      .from('users')
      .update({ completado: true, completado_at: new Date().toISOString() })
      .eq('id', uid),
    'El envio final esta tardando demasiado. Revisa tu conexion e intenta nuevamente.'
  );
  if (error) throw error;
}

export async function saveTipoUsuario(uid: string, email: string, tipoUsuario: TipoUsuario) {
  await saveOnboardingStep(uid, { tipoUsuario, email });
}

// ── Photos (Supabase Storage) ───────────────────────────────────────────────

export async function uploadPhoto(uid: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${uid}/fotocheck.${ext}`;

  const { error } = await withTimeout(
    supabase.storage
      .from('fotos')
      .upload(path, file, { upsert: true }),
    'La foto esta tardando demasiado en subir. Continuaremos sin bloquear el formulario.'
  );

  if (error) throw error;

  const { data } = supabase.storage.from('fotos').getPublicUrl(path);
  return data.publicUrl;
}

// ── Admin ───────────────────────────────────────────────────────────────────

export async function isOnboardingComplete(uid: string): Promise<boolean> {
  const { data } = await withTimeout(
    supabase
      .from('users')
      .select('completado')
      .eq('id', uid)
      .maybeSingle(),
    'No se pudo validar el estado del onboarding.'
  );
  return data?.completado === true;
}

export async function getOnboardingData(uid: string): Promise<Partial<OnboardingData> | null> {
  const { data } = await withTimeout(
    supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .maybeSingle(),
    'No se pudieron cargar los datos guardados del onboarding.'
  );
  if (!data) return null;
  return fromDb(data as DbRow);
}

export async function getAllSubmissions(): Promise<FirestoreSubmission[]> {
  // Fetch from users (all non-admin users)
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'user')
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    uid: row.id,
    email: row.email ?? '',
    tipoUsuario: row.tipo_usuario ?? null,
    datosPersonales: row.datos_personales,
    beneficioEPS: row.beneficio_eps,
    oncosalud: row.oncosalud,
    examenMedico: row.examen_medico,
    fola: row.fola,
    adminData: row.admin_data,
    completado: row.completado === true,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    completadoAt: row.completado_at ? new Date(row.completado_at) : undefined,
  }));
}

export async function saveAdminData(uid: string, adminData: AdminData): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ admin_data: adminData, updated_at: new Date().toISOString() })
    .eq('id', uid);
  if (error) throw error;
}

export async function saveFullRecord(
  uid: string,
  data: Partial<OnboardingData & { completado?: boolean; email?: string }>,
  adminData: AdminData,
  newPhoto?: File
): Promise<string | null> {
  let fotoUrl: string | null = null;
  if (newPhoto) {
    try {
      fotoUrl = await uploadPhoto(uid, newPhoto);
    } catch (e) {
      console.warn('No se pudo subir la foto:', e);
    }
  }
  const payload: Partial<OnboardingData & { completado?: boolean; email?: string }> = { ...data };
  if (fotoUrl && payload.datosPersonales) {
    payload.datosPersonales = { ...payload.datosPersonales, fotoUrl };
  }
  const { error } = await supabase
    .from('users')
    .update({ ...toDb(payload), admin_data: adminData, updated_at: new Date().toISOString() })
    .eq('id', uid);
  if (error) throw error;
  return fotoUrl;
}
