import { Plane, Wallet, Globe, Compass, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { IMAGES } from '../../constants';
import ProfileMenu, { ProfileModals } from '../ProfileMenu';

interface NavbarProps {
    showProfileMenu: boolean;
    setShowProfileMenu: (v: boolean) => void;
    onOpenModal: (type: string) => void;
}

export default function Navbar({ showProfileMenu, setShowProfileMenu, onOpenModal }: NavbarProps) {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            {/* Top navbar */}
            <nav className="fixed top-0 left-0 right-0 z-[100] h-20 flex items-center justify-between px-4 md:px-8 lg:px-12">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/90 to-transparent backdrop-blur-sm pointer-events-none" />
                <div className="flex items-center gap-4 md:gap-12 relative">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer group">
                        <Plane className="w-5 h-5 text-emerald-400 fill-emerald-400/20 group-hover:text-emerald-300 transition-colors duration-300" />
                        <h1 className="text-xl font-black tracking-tight text-white">Voyax</h1>
                    </Link>
                    <div className="hidden md:flex items-center gap-10">
                        <Link
                            to="/minhas-viagens"
                            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${currentPath === '/minhas-viagens' ? 'text-emerald-400' : 'text-white/40 hover:text-white'}`}
                        >
                            <Compass className="w-3.5 h-3.5" /> MINHAS VIAGENS
                        </Link>
                        <Link
                            to="/financeiro"
                            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${currentPath === '/financeiro' ? 'text-emerald-400' : 'text-white/40 hover:text-white'}`}
                        >
                            <Wallet className="w-3.5 h-3.5" /> FINANCEIRO
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-6 relative">
                    <div className="relative">
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
                </div>
            </nav>

            {/* Mobile bottom tab bar — visible only on < md screens */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#0a1628]/95 backdrop-blur-xl border-t border-white/[0.06] pb-[env(safe-area-inset-bottom)]">
                <div className="flex items-center justify-around h-14">
                    <Link
                        to="/"
                        className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${currentPath === '/' || currentPath === '/chat' ? 'text-emerald-400' : 'text-white/30'}`}
                    >
                        <Home className="w-5 h-5" />
                        <span className="text-[8px] font-bold uppercase tracking-wider">Início</span>
                    </Link>
                    <Link
                        to="/minhas-viagens"
                        className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${currentPath === '/minhas-viagens' ? 'text-emerald-400' : 'text-white/30'}`}
                    >
                        <Compass className="w-5 h-5" />
                        <span className="text-[8px] font-bold uppercase tracking-wider">Viagens</span>
                    </Link>
                    <Link
                        to="/financeiro"
                        className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${currentPath === '/financeiro' ? 'text-emerald-400' : 'text-white/30'}`}
                    >
                        <Wallet className="w-5 h-5" />
                        <span className="text-[8px] font-bold uppercase tracking-wider">Financeiro</span>
                    </Link>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${showProfileMenu ? 'text-emerald-400' : 'text-white/30'}`}
                    >
                        <div className="w-5 h-5 rounded-full border border-current overflow-hidden">
                            <img src={IMAGES.userAvatar} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider">Perfil</span>
                    </button>
                </div>
            </div>
        </>
    );
}
