import { Routes, Route } from 'react-router-dom';
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
import { MyPage } from './pages/MyPage';
import { Favorites } from './pages/Favorites';
import { MyProjects } from './pages/MyProjects';
import { OshiTags } from './pages/OshiTags';
import { OshiTagDetail } from './pages/OshiTagDetail';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { PrivateRoute } from './components/auth/PrivateRoute';

export const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* パブリックルート */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/visions" element={<Visions />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/oshi-tags/:tagId" element={<OshiTagDetail />} />

          {/* 保護されたルート */}
          <Route
            path="/projects/create"
            element={
              <PrivateRoute>
                <ProjectCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/mypage"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-projects"
            element={
              <PrivateRoute>
                <MyProjects />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />
          <Route
            path="/oshi-tags"
            element={
              <PrivateRoute>
                <OshiTags />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}; 