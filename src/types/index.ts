export type TipoUsuario = 'planilla' | 'trainee';

export interface DatosPersonales {
  foto?: File | null;
  fotoUrl: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  telefono: string;
  fechaNacimiento: string;
  edad: number | '';
  correo: string;
  direccion: string;
}

export interface BeneficioEPS {
  desea: boolean;
}

export interface BeneficioOncosalud {
  desea: boolean;
  nombres: string;
  dni: string;
  celular: string;
  correo: string;
}

export interface ExamenMedico {
  fechaSugerida: string;
}

export interface BeneficioFOLA {
  nombres: string;
  dni: string;
  fechaNacimiento: string;
  sexo: string;
  remuneracion: number | '';
}

export interface OnboardingData {
  tipoUsuario: TipoUsuario | null;
  datosPersonales: DatosPersonales;
  beneficioEPS: BeneficioEPS;
  oncosalud: BeneficioOncosalud;
  examenMedico: ExamenMedico;
  fola: BeneficioFOLA;
}

export interface AdminData {
  perfilNumero: string;
  tipo: 'EMPO' | 'EMOA' | 'EMOR' | '';
  protocolo: string;
}

export interface FirestoreSubmission {
  uid: string;
  email: string;
  tipoUsuario: TipoUsuario;
  datosPersonales: Omit<DatosPersonales, 'foto'>;
  beneficioEPS?: BeneficioEPS;
  oncosalud?: BeneficioOncosalud;
  examenMedico?: ExamenMedico;
  fola?: BeneficioFOLA;
  adminData?: AdminData;
  completado: boolean;
  createdAt: Date;
  completadoAt?: Date;
}

export interface UserRole {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}
