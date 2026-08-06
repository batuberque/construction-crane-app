import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './services/query-client';
import './index.css';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import AnimatedRouter from './components/AnimatedRouter';

/**
 * The shell is deliberately NOT lazy. AnimatedRouter is what *contains* the
 * route-level lazy() calls, so lazying it meant none of those imports could
 * even be discovered until its own chunk had downloaded and executed — three
 * sequential round trips before first paint.
 */
const App = () => (
  <div className="flex flex-col min-h-screen bg-graphite">
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <AnimatedRouter />
        <Footer />
      </QueryClientProvider>
    </BrowserRouter>
  </div>
);

const container = document.getElementById('root');

if (!container) {
  throw new Error('no container to render to');
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
