import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import { useAuth } from './hooks/useAuth';

// Pages
import VistaInicio from './pages/VistaInicio';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TipoUsuario from './pages/TipoUsuario';
import ProcesoCompleto from './pages/ProcesoCompleto';

// Planilla
import P1_DatosPersonales from './pages/planilla/P1_DatosPersonales';
import P2_BeneficioEPS from './pages/planilla/P2_BeneficioEPS';
import P3_Oncosalud from './pages/planilla/P3_Oncosalud';
import P4_ExamenMedico from './pages/planilla/P4_ExamenMedico';
import P5_Revision from './pages/planilla/P5_Revision';

// Trainee
import T1_DatosPersonales from './pages/trainee/T1_DatosPersonales';
import T2_BeneficioFOLA from './pages/trainee/T2_BeneficioFOLA';
import T3_Oncosalud from './pages/trainee/T3_Oncosalud';
import T4_Revision from './pages/trainee/T4_Revision';

// Admin
import AdminDashboard from './pages/admin/Dashboard';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff]">
      <div className="w-10 h-10 border-4 border-[#00478d] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (role !== 'admin') return <Navigate to="/tipo-usuario" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<VistaInicio />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      {/* Protected — general */}
      <Route path="/tipo-usuario" element={<ProtectedRoute><TipoUsuario /></ProtectedRoute>} />
      <Route path="/completado" element={<ProtectedRoute><ProcesoCompleto /></ProtectedRoute>} />

      {/* Planilla flow */}
      <Route path="/planilla/datos-personales" element={<ProtectedRoute><P1_DatosPersonales /></ProtectedRoute>} />
      <Route path="/planilla/eps" element={<ProtectedRoute><P2_BeneficioEPS /></ProtectedRoute>} />
      <Route path="/planilla/oncosalud" element={<ProtectedRoute><P3_Oncosalud /></ProtectedRoute>} />
      <Route path="/planilla/examen-medico" element={<ProtectedRoute><P4_ExamenMedico /></ProtectedRoute>} />
      <Route path="/planilla/revision" element={<ProtectedRoute><P5_Revision /></ProtectedRoute>} />

      {/* Trainee flow */}
      <Route path="/trainee/datos-personales" element={<ProtectedRoute><T1_DatosPersonales /></ProtectedRoute>} />
      <Route path="/trainee/fola" element={<ProtectedRoute><T2_BeneficioFOLA /></ProtectedRoute>} />
      <Route path="/trainee/oncosalud" element={<ProtectedRoute><T3_Oncosalud /></ProtectedRoute>} />
      <Route path="/trainee/revision" element={<ProtectedRoute><T4_Revision /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <OnboardingProvider>
        <AppRoutes />
      </OnboardingProvider>
    </BrowserRouter>
  );
}
