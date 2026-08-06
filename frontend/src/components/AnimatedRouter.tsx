import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';

// Eager: the entry route, and it holds the LCP image. Lazying it would cost a
// round trip on the page most visitors land on.
import Home from './Home/Home';
import ProtectedRoute from './ProtectedRouter';
import RouteFallback from './Loading/LoadingComponent';

/**
 * Single source of truth for route chunks, so NavBar can prefetch exactly what
 * a click would load. Duplicate import() calls are free — the module registry
 * dedupes them.
 */
export const pageImports = {
  '/about': () => import('./About/About'),
  '/service': () => import('./Service/Service'),
  '/project': () => import('./Project/Project'),
  '/references': () => import('./References/References'),
  '/contact': () => import('./Contact/Contact'),
} as const;

const About = lazy(pageImports['/about']);
const Service = lazy(pageImports['/service']);
const Project = lazy(pageImports['/project']);
const References = lazy(pageImports['/references']);
const Contact = lazy(pageImports['/contact']);
const ProjectDetail = lazy(() => import('./Project/ProjectDetail'));
const Login = lazy(() => import('./Login/Login'));
const AdminPanel = lazy(() => import('./AdminPanel/AdminPanel'));
const NotFound = lazy(() => import('./NotFound/NotFound'));

/**
 * Page transitions are a CSS enter animation keyed on the pathname.
 *
 * This used to be framer-motion + AnimatePresence mode="wait", which cost ~40KB
 * gzip on the critical path — for a single fade — and held the incoming page
 * back until the outgoing one finished animating. An enter-only transition
 * removes the dead time and the dependency; prefers-reduced-motion is handled
 * globally in index.css.
 */
const AnimatedRouter = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Keep the scroll position when the user goes Back, reset it otherwise.
    if (navigationType !== 'POP') window.scrollTo(0, 0);
  }, [location.pathname, navigationType]);

  return (
    <div key={location.pathname} className="page-enter flex flex-col flex-grow">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Service />} />
          <Route path="/project" element={<Project />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/references" element={<References />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          {/* Vizyon is now a section of Hakkımızda; keep old links alive. */}
          <Route path="/vision" element={<Navigate to="/about#vizyon" replace />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="editor">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AnimatedRouter;
