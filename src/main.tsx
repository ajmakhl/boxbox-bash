import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Tooltip } from '@base-ui/react/tooltip';
import { Toast } from '@base-ui/react/toast';
import App from './App.tsx';
import Home from './pages/Home.tsx';
import Notes from './pages/Notes.tsx';
import Teams from './pages/Teams.tsx';
import { ToastViewport } from '@components/ToastProvider.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toast.Provider timeout={4000}>
      <Tooltip.Provider delay={0}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />}>
              <Route index element={<Home />} />
              <Route path='notes' element={<Notes />} />
              <Route path='teams' element={<Teams />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastViewport />
      </Tooltip.Provider>
    </Toast.Provider>
  </StrictMode>,
);
