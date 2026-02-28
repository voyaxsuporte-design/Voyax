import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/home/HomePage';
import ChatPage from './pages/chat/ChatPage';
import PassagensPage from './pages/passagens/PassagensPage';
import HospedagemPage from './pages/hospedagem/HospedagemPage';
import ExperienciasPage from './pages/experiencias/ExperienciasPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import MinhasViagensPage from './pages/minhas-viagens/MinhasViagensPage';
import FinanceiroPage from './pages/financeiro/FinanceiroPage';

/**
 * ===================================================
 *  ROTAS DO VOYAX
 *  Aqui ficam todas as rotas (URLs) do aplicativo.
 *  Cada rota aponta para uma página (Page).
 * ===================================================
 */
export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            // Página inicial — "Olá, eu sou a Zoe"
            { index: true, element: <HomePage /> },

            // Chat com a Zoe
            { path: 'chat', element: <ChatPage /> },

            // Fluxo de Reserva (Booking Flow)
            { path: 'passagens', element: <PassagensPage /> },
            { path: 'hospedagem', element: <HospedagemPage /> },
            { path: 'experiencias', element: <ExperienciasPage /> },
            { path: 'checkout', element: <CheckoutPage /> },

            // Outras telas
            { path: 'minhas-viagens', element: <MinhasViagensPage /> },
            { path: 'financeiro', element: <FinanceiroPage /> },
        ],
    },
]);
