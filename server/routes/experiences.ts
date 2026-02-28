import { Router } from 'express';
import getDatabase from '../database';

/**
 * ===================================================
 *  ROTA: /api/experiences
 *  Retorna experiências/passeios por destino.
 *
 *  Exemplo: GET /api/experiences?destination=Paris
 * ===================================================
 */
const router = Router();

// GET /api/experiences — lista experiências
router.get('/', (req, res) => {
    const db = getDatabase();
    const { destination } = req.query;

    let query = 'SELECT * FROM experiences WHERE 1=1';
    const params: any[] = [];

    if (destination) {
        query += ' AND destination = ?';
        params.push(destination);
    }

    query += ' ORDER BY recommended DESC, rating DESC';

    const experiences = db.prepare(query).all(...params);

    const result = experiences.map((e: any) => ({
        ...e,
        recommended: !!e.recommended,
    }));

    res.json(result);
});

// GET /api/experiences/:id
router.get('/:id', (req, res) => {
    const db = getDatabase();
    const exp = db.prepare('SELECT * FROM experiences WHERE id = ?').get(req.params.id) as any;
    if (!exp) return res.status(404).json({ error: 'Experiência não encontrada' });
    res.json({ ...exp, recommended: !!exp.recommended });
});

export default router;
