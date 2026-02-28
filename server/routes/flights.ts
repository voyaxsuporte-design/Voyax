import { Router } from 'express';
import getDatabase from '../database';

/**
 * ===================================================
 *  ROTA: /api/flights
 *  Retorna voos disponíveis filtrados por destino.
 *
 *  Exemplos:
 *    GET /api/flights?destination=Paris
 *    GET /api/flights?destination=Paris&cabin=Business
 * ===================================================
 */
const router = Router();

// GET /api/flights — lista voos (filtro opcional por destino)
router.get('/', (req, res) => {
    const db = getDatabase();
    const { destination, cabin } = req.query;

    let query = 'SELECT * FROM flights WHERE 1=1';
    const params: any[] = [];

    if (destination) {
        query += ' AND destination = ?';
        params.push(destination);
    }
    if (cabin) {
        query += ' AND cabin = ?';
        params.push(cabin);
    }

    query += ' ORDER BY recommended DESC, price ASC';

    const flights = db.prepare(query).all(...params);

    // Converte "recommended" de 0/1 para boolean
    const result = flights.map((f: any) => ({
        ...f,
        recommended: !!f.recommended,
    }));

    res.json(result);
});

// GET /api/flights/:id — busca um voo por ID
router.get('/:id', (req, res) => {
    const db = getDatabase();
    const flight = db.prepare('SELECT * FROM flights WHERE id = ?').get(req.params.id);
    if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });
    res.json({ ...(flight as any), recommended: !!(flight as any).recommended });
});

export default router;
