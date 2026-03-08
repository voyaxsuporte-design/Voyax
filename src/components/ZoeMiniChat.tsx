import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles } from 'lucide-react';
import { IMAGES } from '../constants';
import { useZoeChat, type PageContext } from '../hooks/useZoeChat';

/**
 * ===================================================
 *  ZOE MINI CHAT — Assistente contextual
 *
 *  Usado nos módulos: Passagens, Hotéis,
 *  Experiências, Checkout.
 *
 *  Agora usa o hook compartilhado useZoeChat para
 *  manter a conversa contínua entre todas as páginas.
 *
 *  Props:
 *    context     — 'passagens' | 'hoteis' | 'experiencias' | 'checkout'
 *    destination — nome do destino (ex: "Paris")
 * ===================================================
 */

type Context = 'passagens' | 'hoteis' | 'experiencias' | 'checkout';

interface ZoeMiniChatProps {
    context: Context;
    destination?: string;
}

// Map the UI context names to PageContext values used by the hook
const CONTEXT_TO_PAGE: Record<Context, PageContext> = {
    passagens: 'flights',
    hoteis: 'hotels',
    experiencias: 'experiences',
    checkout: 'checkout',
};

// ── Suggestions per module (quick buttons) ──────────
const CONTEXT_SUGGESTIONS: Record<Context, string[]> = {
    passagens: [
        'Qual voo tem menor escala?',
        'Melhor horário de chegada',
        'Compara preços por classe',
    ],
    hoteis: [
        'Melhor bairro para minha viagem?',
        'Qual hotel tem melhor custo-benefício?',
        'Ajustar orçamento de hospedagem',
    ],
    experiencias: [
        'Monta um roteiro para 5 dias',
        'Quais são as mais exclusivas?',
        'Atividades gastronômicas',
    ],
    checkout: [
        'O que está incluído no total?',
        'Posso cancelar depois?',
        'Minhas escolhas são as melhores?',
    ],
};

export default function ZoeMiniChat({ context, destination = 'seu destino' }: ZoeMiniChatProps) {
    const pageContext = CONTEXT_TO_PAGE[context];
    const { messages, isTyping, sendMessage } = useZoeChat(pageContext);

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const suggestions = CONTEXT_SUGGESTIONS[context];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = (text: string) => {
        if (!text.trim()) return;
        sendMessage(text);
        setInput('');
    };

    const handleClose = () => {
        setIsOpen(false);
        setInput('');
    };

    return (
        <>
            {/* ── Botão flutuante "Ajuda da Zoe" ── */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.85, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 8 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-14 md:bottom-8 right-4 md:right-8 z-[200] flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full bg-[#0d1b2a]/90 border border-emerald-500/25 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(16,185,129,0.1)] hover:border-emerald-400/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 group"
                    >
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                            <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400/80 group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                            Ajuda da Zoe
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ── Mini chat overlay ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        className="fixed bottom-14 md:bottom-8 right-2 md:right-8 left-2 md:left-auto z-[200] md:w-[360px] max-h-[520px] flex flex-col rounded-3xl bg-[#0d1b2a]/95 border border-white/[0.08] backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)]"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] shrink-0">
                            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0">
                                <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-grow">
                                <p className="text-white text-[13px] font-bold leading-none">Zoe</p>
                                <p className="text-emerald-400/60 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                                    Assistente de Viagem
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <X className="w-3.5 h-3.5 text-white/40" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-3 min-h-0 chat-scroll">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'zoe' && (
                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0 mt-0.5">
                                            <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed font-light ${msg.sender === 'user'
                                            ? 'bg-white/[0.08] border border-white/[0.10] text-white/90'
                                            : 'bg-white/[0.04] border border-white/[0.06] text-white/85'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            <AnimatePresence>
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex gap-2.5 items-center"
                                    >
                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                                            <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                                        </div>
                                        <div className="px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-1">
                                            {[0, 0.2, 0.4].map((delay) => (
                                                <motion.div
                                                    key={delay}
                                                    animate={{ scale: [1, 1.3, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.9, delay }}
                                                    className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div ref={bottomRef} />
                        </div>

                        {/* Quick suggestions — shown only when just the greeting is present */}
                        {messages.length <= 1 && !isTyping && (
                            <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleSend(s)}
                                        className="px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400/70 text-[10px] font-bold hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-400/40 transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="px-4 pb-4 pt-2 shrink-0">
                            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-3.5 py-2 focus-within:border-emerald-500/25 transition-all duration-300">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400/30 shrink-0" />
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                                    placeholder="Pergunte à Zoe..."
                                    className="flex-grow bg-transparent border-none outline-none text-white/80 placeholder-white/20 text-[13px] font-light"
                                />
                                <button
                                    onClick={() => handleSend(input)}
                                    disabled={!input.trim()}
                                    className="w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                                >
                                    <Send className="w-3 h-3 text-[#0a1628]" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
