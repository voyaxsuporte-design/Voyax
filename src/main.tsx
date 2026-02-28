import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css';

/**
 * ===================================================
 *  PONTO DE ENTRADA DO APLICATIVO
 *  Este arquivo inicia o React e carrega o Router.
 * ===================================================
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
