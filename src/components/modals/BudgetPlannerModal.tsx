import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    X,
    Plane,
    Building2,
    Sparkles,
    UtensilsCrossed,
    Car,
    Target,
    Rocket,
    Check,
    Wallet
} from 'lucide-react';

export interface BudgetData {
    passagens: number;
    hospedagem: number;
    experiencias: number;
    alimentacao: number;
    transporte: number;
    hasPlanned: boolean;
}

interface BudgetPlannerModalProps {
    onClose: () => void;
    onConfirm: (data: BudgetData) => void;
    initialData?: BudgetData;
}

const CATEGORIES = [
    { key: 'passagens' as const, label: 'Passagens Aéreas', icon: Plane, color: 'from-sky-500 to-blue-600', accent: 'sky', defaultValue: 5000 },
    { key: 'hospedagem' as const, label: 'Hospedagem', icon: Building2, color: 'from-emerald-500 to-teal-600', accent: 'emerald', defaultValue: 3000 },
    { key: 'experiencias' as const, label: 'Experiências & Lazer', icon: Sparkles, color: 'from-violet-500 to-purple-600', accent: 'violet', defaultValue: 2000 },
    { key: 'alimentacao' as const, label: 'Alimentação', icon: UtensilsCrossed, color: 'from-amber-500 to-orange-600', accent: 'amber', defaultValue: 1500 },
    { key: 'transporte' as const, label: 'Transporte Local', icon: Car, color: 'from-rose-500 to-pink-600', accent: 'rose', defaultValue: 800 },
];

const MAX_BUDGET = 30000;

export default function BudgetPlannerModal({ onClose, onConfirm, initialData }: BudgetPlannerModalProps) {
    const [mode, setMode] = useState<'choose' | 'plan'>(initialData?.hasPlanned ? 'plan' : 'choose');
    const [budget, setBudget] = useState({
        passagens: initialData?.passagens || 5000,
        hospedagem: initialData?.hospedagem || 3000,
        experiencias: initialData?.experiencias || 2000,
        alimentacao: initialData?.alimentacao || 1500,
        transporte: initialData?.transporte || 800,
    });

    const budgetValues = [budget.passagens, budget.hospedagem, budget.experiencias, budget.alimentacao, budget.transporte];
    const total = budgetValues.reduce((sum, val) => sum + val, 0);
    const maxCategory = Math.max(...budgetValues);

    type BudgetKey = keyof typeof budget;
    const handleChange = (key: BudgetKey, value: string) => {
        const num = parseInt(value.replace(/\D/g, '')) || 0;
        setBudget(prev => ({ ...prev, [key]: Math.min(num, MAX_BUDGET) }));
    };

    const handleSlider = (key: BudgetKey, value: number) => {
        setBudget(prev => ({ ...prev, [key]: value }));
    };

    const handleConfirm = () => {
        onConfirm({
            passagens: budget.passagens,
            hospedagem: budget.hospedagem,
            experiencias: budget.experiencias,
            alimentacao: budget.alimentacao,
            transporte: budget.transporte,
            hasPlanned: true,
        });
    };

    const handleSkip = () => {
        onConfirm({
            passagens: 0,
            hospedagem: 0,
            experiencias: 0,
            alimentacao: 0,
            transporte: 0,
            hasPlanned: false,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/70 premium-blur"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                className="relative w-full max-w-2xl bg-[#0a0f1d] border border-white/10 rounded-[32px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />

                {/* Header */}
                <div className="flex justify-between items-start p-8 pb-0 shrink-0">
                    <div>
                        <h3 className="text-white text-2xl font-bold font-display tracking-tight mb-2">Planejamento de Orçamento</h3>
                        <p className="text-white/40 text-sm flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Defina limites para cada categoria ou pule esta etapa
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors group z-10"
                    >
                        <X className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto chat-scroll p-8">
                    <AnimatePresence mode="wait">
                        {mode === 'choose' ? (
                            <motion.div
                                key="choose"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                {/* Option 1: Plan Budget */}
                                <button
                                    onClick={() => setMode('plan')}
                                    className="w-full text-left p-6 rounded-[24px] border border-white/10 bg-white/[0.03] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="high-fidelity-texture" />
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                            <Target className="w-7 h-7 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg mb-1 group-hover:text-emerald-400 transition-colors">Definir Orçamento</h4>
                                            <p className="text-white/40 text-sm leading-relaxed">
                                                Escolha quanto quer gastar em cada categoria — passagens, hospedagem, experiências e mais.
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                {/* Option 2: Skip */}
                                <button
                                    onClick={handleSkip}
                                    className="w-full text-left p-6 rounded-[24px] border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all group relative overflow-hidden"
                                >
                                    <div className="high-fidelity-texture" />
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                                            <Rocket className="w-7 h-7 text-white/50" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg mb-1">Decidir Depois</h4>
                                            <p className="text-white/40 text-sm leading-relaxed">
                                                Prefira escolher com calma quando ver os preços reais de passagens, hotéis e experiências.
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="plan"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-5"
                            >
                                {CATEGORIES.map((cat, i) => {
                                    const percentage = maxCategory > 0 ? (budget[cat.key] / maxCategory) * 100 : 0;
                                    return (
                                        <motion.div
                                            key={cat.key}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.07 }}
                                            className="bg-white/[0.03] border border-white/10 rounded-[20px] p-5 hover:border-white/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0 shadow-lg`}>
                                                    <cat.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-white/80 text-sm font-medium flex-grow">{cat.label}</span>
                                                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-1 group-hover:border-white/20 transition-colors">
                                                    <span className="text-white/30 text-xs pl-3">R$</span>
                                                    <input
                                                        type="text"
                                                        value={budget[cat.key].toLocaleString('pt-BR')}
                                                        onChange={e => handleChange(cat.key, e.target.value)}
                                                        className="bg-transparent border-none outline-none text-white text-sm font-bold text-right w-24 py-2.5 pr-3 focus:ring-0"
                                                    />
                                                </div>
                                            </div>

                                            {/* Slider */}
                                            <div className="relative">
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={MAX_BUDGET}
                                                    step={100}
                                                    value={budget[cat.key]}
                                                    onChange={e => handleSlider(cat.key, parseInt(e.target.value))}
                                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(16,185,129,0.5)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-500 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125
                            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(16,185,129,0.5)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-emerald-500"
                                                    style={{
                                                        background: `linear-gradient(to right, rgba(16,185,129,0.5) 0%, rgba(16,185,129,0.5) ${(budget[cat.key] / MAX_BUDGET) * 100}%, rgba(255,255,255,0.05) ${(budget[cat.key] / MAX_BUDGET) * 100}%, rgba(255,255,255,0.05) 100%)`
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                {mode === 'plan' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="shrink-0 p-8 pt-0"
                    >
                        <div className="border-t border-white/10 pt-6">
                            {/* Total */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase block mb-1">Orçamento Total</span>
                                    <span className="text-white text-3xl font-bold tracking-tight font-display">
                                        R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setMode('choose')}
                                    className="text-white/40 hover:text-white text-[10px] font-bold tracking-[0.15em] uppercase transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
                                >
                                    Voltar
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSkip}
                                    className="flex-1 py-4 rounded-2xl border border-white/10 text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white/5 hover:text-white transition-all"
                                >
                                    Pular Planejamento
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-[2] py-4 rounded-2xl bg-white text-[#0f172a] hover:bg-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase transition-all shadow-2xl flex items-center justify-center gap-2 group"
                                >
                                    <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Confirmar Orçamento
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
