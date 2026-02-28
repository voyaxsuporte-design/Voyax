import { Router } from 'express';
import getDatabase from '../database';

/**
 * ===================================================
 *  ROTA: /api/trips
 *  CRUD completo de viagens do usuário.
 *
 *  GET    /api/trips        → listar viagens
 *  POST   /api/trips        → criar viagem
 *  PATCH  /api/trips/:id    → atualizar viagem
 *  DELETE /api/trips/:id    → deletar viagem
 * ===================================================
 */
const router = Router();

// GET /api/trips — listar viagens
router.get('/', (_req, res) => {
    const db = getDatabase();
    const trips = db.prepare('SELECT * FROM trips ORDER BY created_at DESC').all();
    res.json(trips);
});

// GET /api/trips/:id — buscar viagem por ID
router.get('/:id', (req, res) => {
    const db = getDatabase();
    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Viagem não encontrada' });
    res.json(trip);
});

// POST /api/trips — criar nova viagem
router.post('/', (req, res) => {
    const db = getDatabase();
    const { destination, country, dates, status, image, hotel, cabin, price } = req.body;

    if (!destination || !country || !dates || !image) {
        return res.status(400).json({ error: 'Campos obrigatórios: destination, country, dates, image' });
    }

    const result = db.prepare(
        'INSERT INTO trips (destination, country, dates, status, image, hotel, cabin, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(destination, country, dates, status || 'draft', image, hotel || null, cabin || null, price || null);

    const newTrip = db.prepare('SELECT * FROM trips WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newTrip);
});

// PATCH /api/trips/:id — atualizar viagem
router.patch('/:id', (req, res) => {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Viagem não encontrada' });

    const fields = ['destination', 'country', 'dates', 'status', 'image', 'hotel', 'cabin', 'price'];
    const updates: string[] = [];
    const values: any[] = [];

    for (const field of fields) {
        if (req.body[field] !== undefined) {
            updates.push(`${field} = ?`);
            values.push(req.body[field]);
        }
    }

    if (updates.length === 0) return res.status(400).json({ error: 'Nenhum campo para atualizar' });

    values.push(req.params.id);
    db.prepare(`UPDATE trips SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const updated = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
    res.json(updated);
});

// DELETE /api/trips/:id — deletar viagem
router.delete('/:id', (req, res) => {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Viagem não encontrada' });

    db.prepare('DELETE FROM trips WHERE id = ?').run(req.params.id);
    res.json({ message: 'Viagem deletada com sucesso' });
});

export default router;
