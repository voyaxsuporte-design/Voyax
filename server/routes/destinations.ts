import { Router } from 'express';
import getDatabase from '../database';

/**
 * ===================================================
 *  ROTA: /api/destinations
 *  Retorna a lista de destinos disponíveis.
 * ===================================================
 */
const router = Router();

// GET /api/destinations — lista todos os destinos
router.get('/', (_req, res) => {
    const db = getDatabase();
    const destinations = db.prepare('SELECT * FROM destinations').all();
    res.json(destinations);
});

// GET /api/destinations/:id — busca um destino por ID
router.get('/:id', (req, res) => {
    const db = getDatabase();
    const dest = db.prepare('SELECT * FROM destinations WHERE id = ?').get(req.params.id);
    if (!dest) return res.status(404).json({ error: 'Destino não encontrado' });
    res.json(dest);
});

export default router;
