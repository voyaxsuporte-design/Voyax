import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CloudSun, Banknote, ChevronRight, ChevronDown, ArrowLeftRight, Settings, Edit3 } from 'lucide-react';
import { IMAGES, DESTINATIONS, Destination } from '../constants';
import type { BudgetData } from './modals/BudgetPlannerModal';

interface TripContextPanelProps {
    onOpenCalendar?: () => void;
    onOpenBudget?: () => void;
    budgetData?: BudgetData | null;
    destination: Destination;
    onChangeDestination: (dest: Destination) => void;
    tripDates: { departure: string; return: string };
    onNext?: () => void;
    nextLabel?: string;
    currentStep?: number; // 1=flights, 2=hotels, 3=experiences, 4=checkout
    selectedFlightPrice?: number;
}

export default function TripContextPanel({
    onOpenCalendar,
    onOpenBudget,
    budgetData,
    destination,
    onChangeDestination,
    tripDates,
    onNext,
    nextLabel,
    currentStep = 1,
    selectedFlightPrice = 0,
}: TripContextPanelProps) {
    const [isDestMenuOpen, setIsDestMenuOpen] = useState(false);
    const [isAlterarActive, setIsAlterarActive] = useState(false);
    const destRef = useRef<HTMLDivElement>(null);
    const progress = currentStep * 25;

    // Close dropdown when clicking outside the destination area
    useEffect(() => {
        if (!isDestMenuOpen) return;
        const handler = (e: MouseEvent) => {
            if (destRef.current && !destRef.current.contains(e.target as Node)) {
                setIsDestMenuOpen(false);
            }
        };
        // Use a small delay so the button's own onClick fires first
        const timer = setTimeout(() => {
            document.addEventListener('click', handler);
        }, 0);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handler);
        };
    }, [isDestMenuOpen]);

    const handleAlterar = () => {
        const next = !isDestMenuOpen;
        setIsDestMenuOpen(next);
        if (next) {
            setIsAlterarActive(true);
            setTimeout(() => setIsAlterarActive(false), 1500);
        } else {
            setIsAlterarActive(false);
        }
    };
    const budgetTotal = budgetData ? (budgetData.passagens + budgetData.hospedagem + budgetData.experiencias + budgetData.alimentacao + budgetData.transporte) : 3420;

    return (
        <div className="flex flex-col h-full w-full">
            {/* Destination Image */}
            <div className="relative h-44 rounded-t-2xl overflow-hidden shrink-0">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
            </div>

            {/* Main Content */}
            <div className="bg-[#0d1b2a]/90 border border-white/5 rounded-b-2xl p-6 flex flex-col flex-grow backdrop-blur-xl">
                {/* Destination + Status */}
                <div className="flex items-start justify-between mb-6" ref={destRef}>
                    <div className="relative">
                        <div
                            onClick={() => setIsDestMenuOpen(!isDestMenuOpen)}
                            className="cursor-pointer group"
                        >
                            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                {destination.name}, {destination.country}
                                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${isDestMenuOpen ? 'rotate-180' : ''}`} />
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">STATUS:</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">PLANEJAMENTO</span>
                            </div>
                        </div>

                        <AnimatePresence>
                            {isDestMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-[#0a1628] border border-white/10 rounded-xl p-2 z-[50] shadow-[0_30px_60px_rgba(0,0,0,0.8)] max-h-52 overflow-y-auto chat-scroll w-56"
                                >
                                    {DESTINATIONS.map((dest) => (
                                        <button
                                            key={dest.name}
                                            onClick={() => { onChangeDestination(dest); setIsDestMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            </div>
                                            <div>
                                                <p className="text-white text-xs font-bold group-hover:text-emerald-400">{dest.name}</p>
                                                <p className="text-white/40 text-[8px] uppercase font-bold">{dest.country}</p>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        title="Trocar destino"
                        onClick={handleAlterar}
                        className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 ${isAlterarActive
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white/80'
                            }`}
                    >
                        <Settings className="w-3 h-3" /> ALTERAR
                    </button>
                </div>

                {/* Period */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">PERÍODO DA VIAGEM</span>
                        <button
                            onClick={onOpenCalendar}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-black uppercase tracking-widest text-emerald-400/70 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400/40 hover:shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all duration-300"
                        >
                            <Calendar className="w-3 h-3" /> PERSONALIZAR
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">PARTIDA</p>
                            <p className="text-white font-bold text-sm tracking-tight">{tripDates.departure}</p>
                        </div>
                        <ArrowLeftRight className="w-4 h-4 text-white/20 shrink-0" />
                        <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">RETORNO</p>
                            <p className="text-white font-bold text-sm tracking-tight">{tripDates.return}</p>
                        </div>
                    </div>
                </div>

                {/* Climate & Exchange */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-1.5 mb-1">
                            <CloudSun className="w-3 h-3 text-emerald-500/50" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">CLIMA</span>
                        </div>
                        <p className="text-white font-bold text-sm">{destination.climate}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Banknote className="w-3 h-3 text-emerald-500/50" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">CÂMBIO</span>
                        </div>
                        <p className="text-white font-bold text-sm">{destination.exchange}</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">PROGRESSO</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-emerald-500/60 rounded-full"
                        />
                    </div>
                </div>

                {/* Budget */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 cursor-pointer hover:bg-white/[0.07] transition-colors duration-200" onClick={onOpenBudget}>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">ORÇAMENTO ESTIMADO</span>
                        <span className="text-white font-bold text-lg tracking-tighter">€ {budgetTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-bold text-white/30 uppercase tracking-widest">
                            <span>Passagem (selecionada)</span>
                            <span className="text-white/50">€ {selectedFlightPrice > 0 ? selectedFlightPrice.toLocaleString() : '1.120'}</span>
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-white/30 uppercase tracking-widest">
                            <span>Demais serviços</span>
                            <span className="text-white/50">€ 2.300</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5">
                        <button
                            onClick={(e) => { e.stopPropagation(); onOpenBudget?.(); }}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-500/8 border border-emerald-500/20 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-400/80 hover:bg-emerald-500/15 hover:border-emerald-400/40 hover:text-emerald-300 hover:shadow-[0_0_10px_rgba(16,185,129,0.12)] transition-all duration-300"
                        >
                            <Edit3 className="w-3 h-3" />
                            Planejar orçamento
                        </button>
                    </div>
                </div>



                {/* CTA */}
                {onNext && (
                    <button
                        onClick={onNext}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:from-emerald-400 hover:to-teal-400 hover:shadow-[0_4px_24px_rgba(16,185,129,0.4)] hover:scale-[1.01] active:scale-100 transition-all duration-300 flex items-center justify-center gap-3 group mt-auto shadow-[0_4px_16px_rgba(16,185,129,0.25)]"
                    >
                        {nextLabel || 'PROSSEGUIR'}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
}
