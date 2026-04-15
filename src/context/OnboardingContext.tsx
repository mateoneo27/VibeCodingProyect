import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type {
  OnboardingData,
  TipoUsuario,
  DatosPersonales,
  BeneficioEPS,
  BeneficioOncosalud,
  ExamenMedico,
  BeneficioFOLA,
} from '../types';

const defaultDatosPersonales: DatosPersonales = {
  foto: null,
  fotoUrl: '',
  nombres: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  dni: '',
  telefono: '',
  fechaNacimiento: '',
  edad: '',
  correo: '',
  direccion: '',
};

const defaultOncosalud: BeneficioOncosalud = {
  desea: true,
  nombres: '',
  dni: '',
  celular: '',
  correo: '',
};

const defaultFOLA: BeneficioFOLA = {
  nombres: '',
  dni: '',
  fechaNacimiento: '',
  sexo: '',
  remuneracion: '',
};

const initialState: OnboardingData = {
  tipoUsuario: null,
  datosPersonales: defaultDatosPersonales,
  beneficioEPS: { desea: true },
  oncosalud: defaultOncosalud,
  examenMedico: { fechaSugerida: '' },
  fola: defaultFOLA,
};

type Action =
  | { type: 'SET_TIPO_USUARIO'; payload: TipoUsuario }
  | { type: 'SET_DATOS_PERSONALES'; payload: Partial<DatosPersonales> }
  | { type: 'SET_BENEFICIO_EPS'; payload: Partial<BeneficioEPS> }
  | { type: 'SET_ONCOSALUD'; payload: Partial<BeneficioOncosalud> }
  | { type: 'SET_EXAMEN_MEDICO'; payload: Partial<ExamenMedico> }
  | { type: 'SET_FOLA'; payload: Partial<BeneficioFOLA> }
  | { type: 'LOAD_ALL'; payload: Partial<OnboardingData> }
  | { type: 'RESET' };

function reducer(state: OnboardingData, action: Action): OnboardingData {
  switch (action.type) {
    case 'SET_TIPO_USUARIO':
      return { ...state, tipoUsuario: action.payload };
    case 'SET_DATOS_PERSONALES':
      return { ...state, datosPersonales: { ...state.datosPersonales, ...action.payload } };
    case 'SET_BENEFICIO_EPS':
      return { ...state, beneficioEPS: { ...state.beneficioEPS, ...action.payload } };
    case 'SET_ONCOSALUD':
      return { ...state, oncosalud: { ...state.oncosalud, ...action.payload } };
    case 'SET_EXAMEN_MEDICO':
      return { ...state, examenMedico: { ...state.examenMedico, ...action.payload } };
    case 'SET_FOLA':
      return { ...state, fola: { ...state.fola, ...action.payload } };
    case 'LOAD_ALL':
      return {
        ...state,
        ...(action.payload.tipoUsuario !== undefined && { tipoUsuario: action.payload.tipoUsuario }),
        ...(action.payload.datosPersonales && { datosPersonales: { ...defaultDatosPersonales, ...action.payload.datosPersonales, foto: null } }),
        ...(action.payload.beneficioEPS && { beneficioEPS: action.payload.beneficioEPS }),
        ...(action.payload.oncosalud && { oncosalud: { ...defaultOncosalud, ...action.payload.oncosalud } }),
        ...(action.payload.examenMedico && { examenMedico: action.payload.examenMedico }),
        ...(action.payload.fola && { fola: { ...defaultFOLA, ...action.payload.fola } }),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface OnboardingContextType {
  state: OnboardingData;
  setTipoUsuario: (t: TipoUsuario) => void;
  setDatosPersonales: (d: Partial<DatosPersonales>) => void;
  setBeneficioEPS: (d: Partial<BeneficioEPS>) => void;
  setOncosalud: (d: Partial<BeneficioOncosalud>) => void;
  setExamenMedico: (d: Partial<ExamenMedico>) => void;
  setFola: (d: Partial<BeneficioFOLA>) => void;
  loadAll: (d: Partial<OnboardingData>) => void;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTipoUsuario = useCallback((t: TipoUsuario) => dispatch({ type: 'SET_TIPO_USUARIO', payload: t }), []);
  const setDatosPersonales = useCallback((d: Partial<DatosPersonales>) => dispatch({ type: 'SET_DATOS_PERSONALES', payload: d }), []);
  const setBeneficioEPS = useCallback((d: Partial<BeneficioEPS>) => dispatch({ type: 'SET_BENEFICIO_EPS', payload: d }), []);
  const setOncosalud = useCallback((d: Partial<BeneficioOncosalud>) => dispatch({ type: 'SET_ONCOSALUD', payload: d }), []);
  const setExamenMedico = useCallback((d: Partial<ExamenMedico>) => dispatch({ type: 'SET_EXAMEN_MEDICO', payload: d }), []);
  const setFola = useCallback((d: Partial<BeneficioFOLA>) => dispatch({ type: 'SET_FOLA', payload: d }), []);
  const loadAll = useCallback((d: Partial<OnboardingData>) => dispatch({ type: 'LOAD_ALL', payload: d }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <OnboardingContext.Provider value={{ state, setTipoUsuario, setDatosPersonales, setBeneficioEPS, setOncosalud, setExamenMedico, setFola, loadAll, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
