import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { OnboardingProvider } from './context/OnboardingContext';
import { useOnboarding } from './context/OnboardingContext';
import { useAuth } from './hooks/useAuth';
import { getOnboardingData, isOnboardingComplete } from './lib/services';

// Pages
import VistaInicio from './pages/VistaInicio';
import Login from './pages/auth/Login';
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
    <div className="min-h-screen flex items-center justify-center bg-[#F6F5FA]">
      <div className="w-10 h-10 border-4 border-[#0A29CD] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/** Basic auth guard — redirects to login if not authenticated */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
}

/** Onboarding guard — if the user already completed the process, redirect to /completado?ya=1 */
function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { loadAll } = useOnboarding();
  const [checking, setChecking] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!user) { setChecking(false); return; }
    const currentUser = user;
    let cancelled = false;

    async function checkStatusAndLoadData() {
      setChecking(true);
      try {
        const [done, data] = await Promise.all([
          isOnboardingComplete(currentUser.id),
          getOnboardingData(currentUser.id),
        ]);
        if (cancelled) return;
        setCompleted(done);
        if (data) loadAll(data);
      } catch (e) {
        console.error('Error cargando estado de onboarding:', e);
        if (!cancelled) setCompleted(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    checkStatusAndLoadData();
    return () => { cancelled = true; };
  }, [user, loadAll]);

  if (loading || checking) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (completed) return <Navigate to="/completado?ya=1" replace />;
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
      <Route path="/auth/register" element={<Navigate to="/auth/login" replace />} />

      {/* Protected — general */}
      <Route path="/tipo-usuario" element={<OnboardingRoute><TipoUsuario /></OnboardingRoute>} />
      <Route path="/completado" element={<ProtectedRoute><ProcesoCompleto /></ProtectedRoute>} />

      {/* Planilla flow */}
      <Route path="/planilla/datos-personales" element={<OnboardingRoute><P1_DatosPersonales /></OnboardingRoute>} />
      <Route path="/planilla/eps"              element={<OnboardingRoute><P2_BeneficioEPS /></OnboardingRoute>} />
      <Route path="/planilla/oncosalud"        element={<OnboardingRoute><P3_Oncosalud /></OnboardingRoute>} />
      <Route path="/planilla/examen-medico"    element={<OnboardingRoute><P4_ExamenMedico /></OnboardingRoute>} />
      <Route path="/planilla/revision"         element={<OnboardingRoute><P5_Revision /></OnboardingRoute>} />

      {/* Trainee flow */}
      <Route path="/trainee/datos-personales" element={<OnboardingRoute><T1_DatosPersonales /></OnboardingRoute>} />
      <Route path="/trainee/fola"             element={<OnboardingRoute><T2_BeneficioFOLA /></OnboardingRoute>} />
      <Route path="/trainee/oncosalud"        element={<OnboardingRoute><T3_Oncosalud /></OnboardingRoute>} />
      <Route path="/trainee/revision"         element={<OnboardingRoute><T4_Revision /></OnboardingRoute>} />

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
