import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './providers/AuthProvider';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { ProjectCreate } from './pages/ProjectCreate';
import { Guide } from './pages/Guide';
import { Agencies } from './pages/Agencies';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Visions } from './pages/Visions';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { Legal } from './pages/Legal';
import { AuthForm } from './components/auth/AuthForm';
import { MyPage } from './pages/MyPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    const currentPath = window.location.pathname;
    return <Navigate to="/signin" state={{ from: currentPath }} />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/visions" element={<Visions />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/signin" element={<AuthForm />} />
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="/projects/create" element={<PrivateRoute><ProjectCreate /></PrivateRoute>} />
          <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}; 