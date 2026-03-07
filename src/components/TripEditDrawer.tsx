/**
 * ===================================================
 *  TRIP EDIT DRAWER — Mobile bottom sheet
 *
 *  Slide-up drawer for editing trip details on mobile.
 *  Visible only on screens < md (768px).
 *
 *  Sections: Destination, Dates, Travelers, Budget.
 *  Changing destination resets flight/hotel/experience
 *  (handled in App.tsx's handleChangeDestination).
 * ===================================================
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    X, MapPin, Calendar, Users, Wallet,
    ChevronDown, Minus, Plus, Edit3
} from 'lucide-react';
import { DESTINATIONS, Destination } from '../constants';
import { useAppContext } from '../App';

interface TripEditDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function TripEditDrawer({ open, onClose }: TripEditDrawerProps) {
    const {
        tripContextProps,
        travelers,
        setTravelers,
    } = useAppContext();

    const {
        destination,
        onChangeDestination,
        tripDates,
        onOpenCalendar,
        onOpenBudget,
        budgetData,
    } = tripContextProps;

    const [showDestList, setShowDestList] = useState(false);

    const budgetTotal = budgetData
        ? budgetData.passagens + budgetData.hospedagem + budgetData.experiencias + budgetData.alimentacao + budgetData.transporte
        : 3420;

    const handleSelectDestination = (dest: Destination) => {
        onChangeDestination(dest);
        setShowDestList(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[260] max-h-[85vh] flex flex-col"
                    >
                        <div className="bg-[#0d1b2a]/98 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col max-h-[85vh]">
                            {/* Texture */}
                            <div className="high-fidelity-texture" />

                            {/* Handle bar */}
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 rounded-full bg-white/20" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pb-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <Edit3 className="w-4 h-4 text-emerald-400" />
                                    <h3 className="text-white font-bold text-base tracking-tight">Modificar Viagem</h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="px-6 pb-8 space-y-4 overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>

                                {/* ── DESTINATION ── */}
                                <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
                                    <button
                                        onClick={() => setShowDestList(!showDestList)}
                                        className="w-full flex items-center gap-3 p-4"
                                    >
                                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                            <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                        <div className="flex-grow text-left">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">
                                                <MapPin className="w-3 h-3 inline-block mr-1 -mt-0.5" />DESTINO
                                            </p>
                                            <p className="text-white font-bold text-sm">{destination.name}, {destination.country}</p>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${showDestList ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showDestList && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-3 pb-3 space-y-1 max-h-48 overflow-y-auto chat-scroll">
                                                    {DESTINATIONS.map((dest) => (
                                                        <button
                                                            key={dest.name}
                                                            onClick={() => handleSelectDestination(dest)}
                                                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${dest.name === destination.name
                                                                ? 'bg-emerald-500/10 border border-emerald-500/20'
                                                                : 'hover:bg-white/5 border border-transparent'
                                                                }`}
                                                        >
                                                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                                                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                            </div>
                                                            <div>
                                                                <p className={`text-xs font-bold ${dest.name === destination.name ? 'text-emerald-400' : 'text-white'}`}>
                                                                    {dest.name}
                                                                </p>
                                                                <p className="text-white/40 text-[8px] uppercase font-bold">{dest.country}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* ── DATES ── */}
                                <button
                                    onClick={() => { onOpenCalendar(); onClose(); }}
                                    className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 flex items-center gap-3 text-left group hover:bg-white/[0.06] transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                        <Calendar className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">PERÍODO</p>
                                        <p className="text-white font-bold text-sm">{tripDates.departure} → {tripDates.return}</p>
                                    </div>
                                    <Edit3 className="w-3.5 h-3.5 text-white/20 group-hover:text-emerald-400/60 transition-colors" />
                                </button>

                                {/* ── TRAVELERS ── */}
                                <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                        <Users className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">VIAJANTES</p>
                                        <p className="text-white font-bold text-sm">{travelers} {travelers === 1 ? 'pessoa' : 'pessoas'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setTravelers(Math.max(1, travelers - 1))}
                                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="text-white font-bold text-sm w-6 text-center">{travelers}</span>
                                        <button
                                            onClick={() => setTravelers(Math.min(10, travelers + 1))}
                                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* ── BUDGET ── */}
                                <button
                                    onClick={() => { onOpenBudget(); onClose(); }}
                                    className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 flex items-center gap-3 text-left group hover:bg-white/[0.06] transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                        <Wallet className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">ORÇAMENTO</p>
                                        <p className="text-white font-bold text-sm">€ {budgetTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <Edit3 className="w-3.5 h-3.5 text-white/20 group-hover:text-emerald-400/60 transition-colors" />
                                </button>

                                {/* ── CONFIRM ── */}
                                <button
                                    onClick={onClose}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(16,185,129,0.25)] active:scale-[0.98]"
                                >
                                    CONFIRMAR
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
