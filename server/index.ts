import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import destinationsRouter from './routes/destinations';
import flightsRouter from './routes/flights';
import hotelsRouter from './routes/hotels';
import experiencesRouter from './routes/experiences';
import tripsRouter from './routes/trips';
import financialRouter from './routes/financial';
import chatRouter from './routes/chat';
import userRouter from './routes/user';

/**
 * ===================================================
 *  SERVIDOR EXPRESS — BACKEND DO VOYAX
 *
 *  Este arquivo inicia o servidor na porta 3001.
 *  O frontend (Vite) roda na porta 3000 e faz proxy
 *  de todas as chamadas /api/* para cá.
 *
 *  Para iniciar:  npm run server
 *  Para dev:      npm run dev:full (frontend + backend)
 * ===================================================
 */

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS — permite chamadas do frontend em produção e dev ──
app.use(cors({
    origin: [
        'https://voyax-frontend.onrender.com',
        'http://localhost:3000',
        'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para aceitar JSON no body das requisições
app.use(express.json());

// Log de requisições (útil para debug)
app.use((req, _res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// ── ROTAS DA API ──
app.use('/api/destinations', destinationsRouter);
app.use('/api/flights', flightsRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/experiences', experiencesRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/financial', financialRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);

// Rota de health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        version: '2.8.4',
        service: 'Voyax Premium Concierge API',
        timestamp: new Date().toISOString(),
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log('');
    console.log('  ╔═══════════════════════════════════════════╗');
    console.log('  ║                                           ║');
    console.log('  ║   🛫  VOYAX API SERVER                    ║');
    console.log(`  ║   📡  http://localhost:${PORT}               ║`);
    console.log('  ║   🔒  ZOE AI CORE V2.8.4                  ║');
    console.log('  ║                                           ║');
    console.log('  ╚═══════════════════════════════════════════╝');
    console.log('');
    console.log('  Rotas disponíveis:');
    console.log('  ─────────────────');
    console.log('  GET    /api/destinations');
    console.log('  GET    /api/flights?destination=Paris');
    console.log('  GET    /api/hotels?destination=Paris');
    console.log('  GET    /api/experiences?destination=Paris');
    console.log('  GET    /api/trips');
    console.log('  POST   /api/trips');
    console.log('  PATCH  /api/trips/:id');
    console.log('  DELETE /api/trips/:id');
    console.log('  GET    /api/financial/summary');
    console.log('  POST   /api/financial/debts');
    console.log('  POST   /api/chat');
    console.log('  GET    /api/user/profile');
    console.log('  GET    /api/health');
    console.log('');
});
