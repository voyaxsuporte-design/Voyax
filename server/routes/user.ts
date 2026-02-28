import { Router } from 'express';
import getDatabase from '../database';

/**
 * ===================================================
 *  ROTA: /api/user
 *  Perfil do usuário.
 *
 *  GET   /api/user/profile       → retorna o perfil
 *  PATCH /api/user/profile       → atualiza o perfil
 * ===================================================
 */
const router = Router();

// GET /api/user/profile — retorna o perfil do usuário
router.get('/profile', (_req, res) => {
    const db = getDatabase();
    const profile = db.prepare('SELECT * FROM user_profile WHERE id = 1').get();
    if (!profile) return res.status(404).json({ error: 'Perfil não encontrado' });
    res.json(profile);
});

// PATCH /api/user/profile — atualiza o perfil
router.patch('/profile', (req, res) => {
    const db = getDatabase();
    const fields = ['name', 'email', 'plan', 'avatar', 'monthly_income', 'miles'];
    const updates: string[] = [];
    const values: any[] = [];

    for (const field of fields) {
        if (req.body[field] !== undefined) {
            updates.push(`${field} = ?`);
            values.push(req.body[field]);
        }
    }

    if (updates.length === 0) return res.status(400).json({ error: 'Nenhum campo para atualizar' });

    values.push(1); // user id = 1
    db.prepare(`UPDATE user_profile SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const updated = db.prepare('SELECT * FROM user_profile WHERE id = 1').get();
    res.json(updated);
});

export default router;
