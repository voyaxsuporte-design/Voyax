import { Router } from 'express';
import getDatabase from '../database';

/**
 * ===================================================
 *  ROTA: /api/financial
 *  Resumo financeiro e gerenciamento de dívidas.
 *
 *  GET  /api/financial/summary → resumo completo
 *  GET  /api/financial/debts   → listar dívidas
 *  POST /api/financial/debts   → adicionar dívida
 *  DELETE /api/financial/debts/:id → deletar dívida
 * ===================================================
 */
const router = Router();

// GET /api/financial/summary — resumo financeiro completo
router.get('/summary', (_req, res) => {
    const db = getDatabase();
    const profile = db.prepare('SELECT monthly_income, miles FROM user_profile WHERE id = 1').get() as any;
    const debts = db.prepare('SELECT * FROM debts ORDER BY created_at DESC').all();
    const trips = db.prepare('SELECT price FROM trips WHERE status = ?').all('confirmed');

    const totalDebts = debts.reduce((acc: number, d: any) => acc + d.value, 0);
    const tripSpending = [12000, 8500, 15000, 22000, 18000, 31000, 42000]; // histórico mensal

    res.json({
        income: profile?.monthly_income || 0,
        miles: profile?.miles || 0,
        totalDebts,
        freeBalance: (profile?.monthly_income || 0) - totalDebts,
        debts,
        tripSpending,
        confirmedTrips: trips.length,
    });
});

// GET /api/financial/debts — listar dívidas
router.get('/debts', (_req, res) => {
    const db = getDatabase();
    const debts = db.prepare('SELECT * FROM debts ORDER BY created_at DESC').all();
    res.json(debts);
});

// POST /api/financial/debts — adicionar dívida
router.post('/debts', (req, res) => {
    const db = getDatabase();
    const { label, value, due_date } = req.body;

    if (!label || !value || !due_date) {
        return res.status(400).json({ error: 'Campos obrigatórios: label, value, due_date' });
    }

    const result = db.prepare('INSERT INTO debts (label, value, due_date) VALUES (?, ?, ?)').run(label, value, due_date);
    const newDebt = db.prepare('SELECT * FROM debts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newDebt);
});

// DELETE /api/financial/debts/:id — deletar dívida
router.delete('/debts/:id', (req, res) => {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM debts WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Dívida não encontrada' });

    db.prepare('DELETE FROM debts WHERE id = ?').run(req.params.id);
    res.json({ message: 'Dívida deletada com sucesso' });
});

export default router;
