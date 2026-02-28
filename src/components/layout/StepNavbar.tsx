import { Plane, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from '../ProfileMenu';
import { IMAGES } from '../../constants';

interface StepNavbarProps {
    showProfileMenu: boolean;
    setShowProfileMenu: (v: boolean) => void;
    onOpenModal: (type: string) => void;
}

export const BOOKING_STEPS = [
    { path: '/passagens', label: 'PASSAGENS' },
    { path: '/hospedagem', label: 'HOTÉIS' },
    { path: '/experiencias', label: 'EXPERIÊNCIAS' },
    { path: '/checkout', label: 'CHECKOUT' },
];

export default function StepNavbar({ showProfileMenu, setShowProfileMenu, onOpenModal }: StepNavbarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentIndex = BOOKING_STEPS.findIndex((s) => s.path === location.pathname);

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center px-8 bg-[#0a1628]/90 backdrop-blur-xl border-b border-white/5">
            <button
                onClick={() => navigate('/chat')}
                className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors mr-auto"
            >
                <ArrowLeft className="w-4 h-4" /> Voltar ao Chat
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
                <Plane className="w-4 h-4 text-emerald-400 mr-1" />
                <span className="text-white font-black text-base tracking-tight mr-6">Voyax</span>
                {BOOKING_STEPS.map((step, i) => (
                    <div key={step.path} className="flex items-center">
                        <span
                            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${i === currentIndex
                                ? 'text-white border-b-2 border-emerald-400 pb-0.5'
                                : i < currentIndex
                                    ? 'text-emerald-400/60'
                                    : 'text-white/30'
                                }`}
                        >
                            {step.label}
                        </span>
                        {i < BOOKING_STEPS.length - 1 && (
                            <span className="text-white/20 mx-3 text-sm">→</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="ml-auto relative">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                    <div className="text-right hidden lg:block">
                        <p className="text-white text-xs font-bold">Gabriel Oliveira</p>
                        <p className="text-emerald-400/60 text-[8px] font-bold uppercase tracking-widest">MEMBRO BLACK</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden hover:border-emerald-500/40 transition-all shadow-2xl">
                        <img src={IMAGES.userAvatar} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                </div>
                <AnimatePresence>
                    {showProfileMenu && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfileMenu(false)} className="fixed inset-0 z-[-1]" />
                            <ProfileMenu onClose={() => setShowProfileMenu(false)} onOpenModal={(t) => { onOpenModal(t); setShowProfileMenu(false); }} />
                        </>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
