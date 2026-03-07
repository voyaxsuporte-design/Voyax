import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Info, Loader2 } from 'lucide-react';
import { useAppContext } from '../../App';

interface CalendarPriceModalProps {
    onClose: () => void;
    onConfirm: (start: string, end: string) => void;
}

export default function CalendarPriceModal({ onClose, onConfirm }: CalendarPriceModalProps) {
    const { tripContextProps } = useAppContext();
    const [days, setDays] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStart, setSelectedStart] = useState<number | null>(12);
    const [selectedEnd, setSelectedEnd] = useState<number | null>(24);

    useEffect(() => {
        const fetchPricesFromAPI = async () => {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                const mockApiData = [
                    { date: 6, price: 980, color: 'text-white/40' },
                    { date: 7, price: 950, color: 'text-white/40' },
                    { date: 8, price: 1100, color: 'text-red-400' },
                    { date: 9, price: 1250, color: 'text-red-400' },
                    { date: 10, price: 1050, color: 'text-white/40' },
                    { date: 11, price: 890, color: 'text-emerald-400' },
                    { date: 12, price: 820, color: 'text-emerald-400' },
                    { date: 13, price: 850, color: 'text-emerald-400' },
                    { date: 14, price: 900, color: 'text-white/40' },
                    { date: 15, price: 920, color: 'text-white/40' },
                    { date: 16, price: 1150, color: 'text-red-400' },
                    { date: 17, price: 1300, color: 'text-red-400' },
                    { date: 18, price: 980, color: 'text-white/40' },
                    { date: 19, price: 880, color: 'text-emerald-400' },
                    { date: 20, price: 840, color: 'text-emerald-400' },
                    { date: 21, price: 820, color: 'text-emerald-400' },
                    { date: 22, price: 820, color: 'text-emerald-400' },
                    { date: 23, price: 850, color: 'text-emerald-400' },
                    { date: 24, price: 890, color: 'text-emerald-400' },
                    { date: 25, price: 1050, color: 'text-white/40' },
                    { date: 26, price: 1200, color: 'text-red-400' },
                ];
                setDays(mockApiData);
            } catch (error) {
                console.error("Erro ao buscar preços:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPricesFromAPI();
    }, []);

    const handleDayClick = (date: number) => {
        if (!selectedStart || (selectedStart && selectedEnd)) {
            setSelectedStart(date);
            setSelectedEnd(null);
        } else {
            if (date < selectedStart) {
                setSelectedStart(date);
            } else {
                setSelectedEnd(date);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 premium-blur"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0a0f1d] border border-white/10 rounded-[32px] p-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden min-h-[500px] flex flex-col"
            >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />

                <div className="flex justify-between items-start mb-8 shrink-0">
                    <div>
                        <h3 className="text-white text-2xl font-bold font-display tracking-tight mb-2">Selecione as Datas</h3>
                        <p className="text-white/40 text-sm flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            Preços dinâmicos via integração API (OUT 2024)
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors group z-10">
                        <X className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                        <p className="text-white/40 text-sm font-bold uppercase tracking-widest text-center">Buscando tarifas <br />em tempo real...</p>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-grow justify-between">
                        <div className="flex gap-6 mb-8 text-[10px] font-bold tracking-[0.1em] uppercase">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-white/60">Mais Barato</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/40" /><span className="text-white/60">Médio</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-white/60">Mais Caro</span></div>
                        </div>

                        <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center">
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                                <div key={day} className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">{day}</div>
                            ))}
                            <div className="col-span-1" />
                            {days.map((day, i) => {
                                const isSelected = selectedStart === day.date || selectedEnd === day.date;
                                const inRange = selectedStart && selectedEnd && day.date > selectedStart && day.date < selectedEnd;
                                return (
                                    <div
                                        key={i}
                                        onClick={() => handleDayClick(day.date)}
                                        className={`relative py-3 rounded-2xl cursor-pointer group transition-all
                                            ${isSelected ? 'bg-emerald-500 text-[#0a0f1d]' : 'hover:bg-white/5'}
                                            ${inRange ? 'bg-emerald-500/20' : ''}
                                        `}
                                    >
                                        <div className={`text-lg font-bold mb-1 ${isSelected ? 'text-[#0a0f1d]' : 'text-white'}`}>{day.date}</div>
                                        <div className={`text-[10px] font-bold ${isSelected ? 'text-[#0a0f1d]/70' : day.color}`}>€{day.price}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-10 flex justify-between items-center pt-6 border-t border-white/10 shrink-0">
                            <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-500/10 px-4 py-2 rounded-lg">
                                <Info className="w-4 h-4" />
                                <span>Seleção inteligente de tarifas para <strong>{tripContextProps.destination.name}</strong>.</span>
                            </div>
                            <button
                                onClick={() => {
                                    if (selectedStart && selectedEnd) {
                                        onConfirm(`${selectedStart} OUT 2024`, `${selectedEnd} OUT 2024`);
                                    } else {
                                        onClose();
                                    }
                                }}
                                className="bg-white text-[#0f172a] hover:bg-emerald-400 px-8 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-[0.1em]"
                            >
                                {selectedStart && selectedEnd ? 'Confirmar Datas' : 'Fechar'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
