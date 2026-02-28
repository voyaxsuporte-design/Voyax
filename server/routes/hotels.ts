import { Router } from 'express';
import getDatabase from '../database';

/**
 * ===================================================
 *  ROTA: /api/hotels
 *  Retorna hotéis disponíveis filtrados por destino,
 *  preço máximo e classificação (estrelas).
 *
 *  Exemplos:
 *    GET /api/hotels?destination=Paris
 *    GET /api/hotels?destination=Paris&maxPrice=8000
 *    GET /api/hotels?destination=Paris&rating=5
 * ===================================================
 */
const router = Router();

// GET /api/hotels — lista hotéis com filtros
router.get('/', (req, res) => {
    const db = getDatabase();
    const { destination, maxPrice, rating } = req.query;

    let query = 'SELECT * FROM hotels WHERE 1=1';
    const params: any[] = [];

    if (destination) {
        query += ' AND destination = ?';
        params.push(destination);
    }
    if (maxPrice) {
        query += ' AND price <= ?';
        params.push(Number(maxPrice));
    }
    if (rating) {
        query += ' AND rating = ?';
        params.push(Number(rating));
    }

    query += ' ORDER BY recommended DESC, guest_rating DESC';

    const hotels = db.prepare(query).all(...params);

    const result = hotels.map((h: any) => ({
        ...h,
        recommended: !!h.recommended,
        amenities: h.amenities ? h.amenities.split(',') : [],
    }));

    res.json(result);
});

// GET /api/hotels/:id
router.get('/:id', (req, res) => {
    const db = getDatabase();
    const hotel = db.prepare('SELECT * FROM hotels WHERE id = ?').get(req.params.id) as any;
    if (!hotel) return res.status(404).json({ error: 'Hotel não encontrado' });
    res.json({
        ...hotel,
        recommended: !!hotel.recommended,
        amenities: hotel.amenities ? hotel.amenities.split(',') : [],
    });
});

export default router;
