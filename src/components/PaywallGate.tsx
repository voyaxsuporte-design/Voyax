/**
 * ===================================================
 *  PAYWALL GATE — Controle de acesso premium
 *
 *  Uso:
 *   <PaywallGate>
 *     <ConteudoProtegido />
 *   </PaywallGate>
 *
 *  • Free  → mostra overlay + abre modal de upgrade
 *  • Trial → acesso completo temporário
 *  • Premium → acesso completo
 * ===================================================
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Zap, Plane, Hotel, Compass, Shield, Star, Lock, X, Check } from 'lucide-react';
import { useAppContext, UserPlan } from '../App';
import { IMAGES } from '../constants';

// ── Benefit row ────────────────────────────────────────────────
const BENEFITS = [
    { icon: Zap, label: 'Zoe sem limites', sub: 'Conversas ilimitadas com a IA' },
    { icon: Plane, label: 'Passagens Aéreas', sub: 'Acesso às opções de voos selecionados' },
    { icon: Hotel, label: 'Hotéis Premium', sub: 'Acesso à curadoria exclusiva' },
    { icon: Compass, label: 'Experiências', sub: 'Acesso a roteiros e passeios únicos' },
];

// ── PaywallModal — usado inline no Chat ────────────────────────
export function PaywallModal({ onClose }: { onClose: () => void }) {
    const { setUserPlan, tripContextProps } = useAppContext();
    const destName = tripContextProps.destination.name;

    const activate = (plan: UserPlan) => {
        setUserPlan(plan);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center px-4"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="relative w-full max-w-lg bg-[#080e1c] border border-white/10 rounded-[36px] overflow-hidden shadow-[0_48px_100px_rgba(0,0,0,0.8)]"
            >
                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Close */}
                <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-white/30 hover:text-white/60 transition-colors z-10">
                    <X className="w-4 h-4" />
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-emerald-500/20 relative">
                            <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-emerald-500/10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">Zoe Concierge</span>
                            </div>
                            <h2 className="text-white font-bold text-xl tracking-tight">
                                Seu planejamento está pronto
                            </h2>
                        </div>
                    </div>

                    {/* Zoe message card */}
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-6">
                        <p className="text-white/70 text-sm leading-relaxed font-light">
                            Criei um planejamento inicial baseado no seu perfil — voos em classe executiva, hotéis boutique e experiências exclusivas em {destName}. Para visualizar e confirmar, ative o plano <span className="text-emerald-400 font-medium">Voyax Black</span>.
                        </p>
                    </div>

                    {/* Lock visual */}
                    <div className="flex items-center gap-2 mb-5">
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
                            <Lock className="w-3 h-3 text-white/30" />
                            <span className="text-white/30 text-[9px] font-black uppercase tracking-widest">Conteúdo exclusivo</span>
                        </div>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>

                    {/* Benefits grid */}
                    <div className="grid grid-cols-2 gap-2 mb-7">
                        {BENEFITS.map((b, i) => (
                            <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                <b.icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="text-white/60 text-[10px] font-medium leading-tight">{b.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3">
                        <button
                            onClick={() => activate('premium')}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#0f172a] font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                        >
                            <Crown className="w-4 h-4" />
                            Ativar Voyax Black — R$ 29/mês
                        </button>
                        <button
                            onClick={() => activate('trial')}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:text-white/70 transition-all"
                        >
                            Teste grátis por 3 dias
                        </button>
                    </div>

                    {/* Fine print */}
                    <p className="text-center text-white/20 text-[9px] mt-4">
                        Cancele quando quiser. Sem compromisso.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ── PaywallGate — wrapper para páginas protegidas ──────────────
interface PaywallGateProps {
    children: React.ReactNode;
    /** Label curto da página bloqueada, ex: "Passagens" */
    pageName: string;
    icon?: React.ElementType;
}

export function PaywallGate({ children, pageName, icon: Icon = Lock }: PaywallGateProps) {
    const { userPlan, setUserPlan } = useAppContext();
    const isBlocked = userPlan === 'free';
    const [dismissed, setDismissed] = useState(false);

    const activate = (plan: UserPlan) => {
        setUserPlan(plan);
        setDismissed(true);
    };

    if (!isBlocked) return <>{children}</>;

    return (
        <div className="relative min-h-screen">
            {/* Blurred content behind */}
            <div className="pointer-events-none select-none" style={{ filter: 'blur(8px)', opacity: 0.3 }}>
                {children}
            </div>

            {/* Paywall overlay */}
            <div className="absolute inset-0 z-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-[#080e1c]/98 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-[0_48px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

                        {/* Icon + heading */}
                        <div className="text-center mb-6 relative">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                <Icon className="w-7 h-7 text-emerald-400" />
                            </div>
                            <h3 className="text-white font-bold text-xl tracking-tight mb-1">{pageName}</h3>
                            <p className="text-white/40 text-sm font-light">Esta área é exclusiva para membros Voyax Black</p>
                        </div>

                        {/* What's locked */}
                        <div className="space-y-2 mb-6">
                            {BENEFITS.slice(0, 4).map((b, i) => (
                                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.05] last:border-0">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <b.icon className="w-3 h-3 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-white/70 text-xs font-medium">{b.label}</p>
                                    </div>
                                    <Check className="w-3 h-3 text-emerald-400/60 ml-auto" />
                                </div>
                            ))}
                        </div>

                        {/* Plan comparison pills */}
                        <div className="flex gap-2 mb-6">
                            <div className="flex-1 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-center">
                                <p className="text-white/25 text-[8px] font-black uppercase tracking-widest mb-1">Free</p>
                                <p className="text-white/40 text-xs">Acesso limitado</p>
                            </div>
                            <div className="flex-1 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-center">
                                <p className="text-emerald-400 text-[8px] font-black uppercase tracking-widest mb-1">Black</p>
                                <p className="text-white/70 text-xs">Acesso completo</p>
                            </div>
                        </div>

                        {/* CTAs */}
                        <button
                            onClick={() => activate('premium')}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#0f172a] font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity mb-2 flex items-center justify-center gap-2"
                        >
                            <Crown className="w-3.5 h-3.5" />
                            Ativar Voyax Black
                        </button>
                        <button
                            onClick={() => activate('trial')}
                            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Teste grátis por 3 dias
                        </button>

                        <p className="text-center text-white/15 text-[9px] mt-3">Cancele quando quiser.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
