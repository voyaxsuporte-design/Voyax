import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../../constants';
import TripContextPanel from '../../components/TripContextPanel';
import { useAppContext } from '../../App';
import { PaywallModal } from '../../components/PaywallGate';

/**
 * ===================================================
 *  PÁGINA DO CHAT (ChatPage)
 *  URL: /chat
 *
 *  Tela de conversa com a Zoe.
 *  Paywall: disparado após a 3ª resposta da Zoe
 *  quando o usuário é FREE.
 * ===================================================
 */

const SUGGESTIONS = [
  "Experimente sugerir: 'Roteiro de 5 dias em Paris'",
  "Experimente sugerir: 'Opções de hotéis em Nova York'",
  "Experimente sugerir: 'Restaurantes com estrela Michelin em Tóquio'",
  "Experimente sugerir: 'Voo executivo para Dubai amanhã'"
];

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'zoe';
  timestamp: Date;
}

// Zoe replies pool — rotacionadas para dar variedade
const ZOE_REPLIES = [
  'Com certeza! Estou analisando as melhores opções de voos diretos e hotéis com vista para a Torre Eiffel. Vamos começar selecionando o seu voo?',
  'Entendido. Já verifico disponibilidade e preços exclusivos para o seu perfil. Posso sugerir algumas datas com melhor custo-benefício?',
  'Criei um planejamento inicial baseado no seu perfil — voos selecionados, hotéis boutique e experiências exclusivas. Para continuar e ver os detalhes, ative seu plano Voyax Black.',
];

const ChatInputArea = ({ onSend, blocked }: { onSend: (text: string) => void; blocked: boolean }) => {
  const [input, setInput] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (!input.trim() || blocked) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="pb-4 pt-4 shrink-0 mt-auto">
      <div className={`bg-white/[0.05] premium-blur border rounded-[32px] p-2 flex items-center shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden group transition-all duration-700 ${blocked ? 'border-white/5 opacity-50 pointer-events-none' : 'border-white/10 focus-within:border-emerald-500/30'}`}>
        <div className="high-fidelity-texture" />
        <div className="flex items-center pl-8 gap-5 flex-grow relative">
          <Sparkles className="text-white/20 w-5 h-5 font-light group-focus-within:text-emerald-400 transition-colors z-10" />
          {!input && (
            <div className="absolute left-[68px] right-0 pointer-events-none flex items-center h-full truncate">
              <AnimatePresence mode="wait">
                <motion.span
                  key={suggestionIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/30 text-lg font-light tracking-tight text-crisp truncate"
                >
                  {SUGGESTIONS[suggestionIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent text-white placeholder-transparent text-lg w-full font-light tracking-tight py-5 text-crisp relative z-10"
            placeholder="Fale com Zoe sobre sua próxima jornada..."
          />
        </div>
        <div className="flex items-center gap-3 pr-3">
          <button className="p-3 text-white/20 hover:text-white transition-colors hover:bg-white/5 rounded-2xl">
            <Mic className="w-6 h-6" />
          </button>
          <button
            onClick={handleSend}
            className="bg-white text-[#0f172a] p-4 rounded-[20px] hover:bg-emerald-400 transition-all shadow-xl group/send"
          >
            <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const navigate = useNavigate();
  const { tripContextProps, searchQuery, setSearchQuery, userPlan } = useAppContext();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou a Zoe. Notei que você está interessado em uma viagem para Paris em Outubro. Gostaria que eu preparasse algumas opções de voos em classe executiva e hotéis boutique para você?',
      sender: 'zoe',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  // Count of Zoe messages sent AFTER the initial greeting
  const zoeReplyCountRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const injectedRef = useRef(false);

  // Paywall triggers on 3rd Zoe reply for free users
  const PAYWALL_TRIGGER = 3;
  const isBlocked = userPlan === 'free' && zoeReplyCountRef.current >= PAYWALL_TRIGGER;

  // Inject message from Home page search on first render
  useEffect(() => {
    if (injectedRef.current || !searchQuery.trim()) return;
    injectedRef.current = true;
    const query = searchQuery;
    setSearchQuery('');
    const userMsg: Message = {
      id: Date.now().toString(),
      text: query,
      sender: 'user',
      timestamp: new Date(),
    };
    setTimeout(() => {
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        zoeReplyCountRef.current += 1;
        const zoeReply: Message = {
          id: (Date.now() + 1).toString(),
          text: `Entendido! Estou analisando as melhores opções para "${query}". Vou montar um roteiro premium com voos selecionados e hotéis exclusivos para você. Vamos começar pelas passagens?`,
          sender: 'zoe',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, zoeReply]);
      }, 2200);
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    // If free user hit limit, show paywall instead of replying
    if (userPlan === 'free' && zoeReplyCountRef.current >= PAYWALL_TRIGGER) {
      setShowPaywall(true);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const nextReplyIndex = Math.min(zoeReplyCountRef.current, ZOE_REPLIES.length - 1);
      const replyText = ZOE_REPLIES[nextReplyIndex];
      zoeReplyCountRef.current += 1;

      const zoeMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: 'zoe',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, zoeMsg]);

      // Trigger paywall after the 3rd Zoe reply (the "planejamento pronto" message)
      if (userPlan === 'free' && zoeReplyCountRef.current >= PAYWALL_TRIGGER) {
        setTimeout(() => setShowPaywall(true), 700);
      }
    }, 2000);
  };

  const goToFlights = () => {
    if (userPlan === 'free') { setShowPaywall(true); return; }
    navigate('/passagens');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-screen max-h-screen overflow-hidden pt-28 pb-8 max-w-7xl mx-auto w-full px-6 grid grid-cols-12 gap-8"
      >
        <div className="col-span-12 lg:col-span-8 flex flex-col h-full min-h-0 overflow-hidden lg:border-r border-white/5 lg:pr-6 relative">
          <div
            ref={scrollRef}
            className="flex-grow overflow-y-auto chat-scroll py-4 space-y-5 min-h-0"
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.sender === 'zoe' ? (
                    <div className="w-10 h-10 rounded-2xl border border-white/[0.08] overflow-hidden flex-shrink-0 shadow-xl bg-emerald-500/10 mt-1">
                      <img
                        src={IMAGES.zoeAvatar}
                        alt="Zoe"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-10 flex-shrink-0" />
                  )}
                  <div className={`px-5 py-4 rounded-2xl relative ${msg.sender === 'user'
                    ? 'bg-white/[0.08] border border-white/[0.10] ml-auto'
                    : 'bg-white/[0.04] border border-white/[0.06]'
                    }`}>
                    <p className="text-white/90 text-[15px] leading-relaxed font-light tracking-wide">
                      {msg.text}
                    </p>
                    {msg.sender === 'zoe' && msg.id !== '1' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={goToFlights}
                        className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all"
                      >
                        Ver opções de voos <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl border border-white/10 overflow-hidden flex-shrink-0 bg-emerald-500/10">
                    <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-5 rounded-[24px] bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <ChatInputArea onSend={handleSend} blocked={isBlocked} />
        </div>

        <div className="hidden lg:flex col-span-4 h-full min-h-0 pl-2 overflow-y-auto chat-scroll">
          <div className="w-full">
            <TripContextPanel
              {...tripContextProps}
              onNext={goToFlights}
              nextLabel="Prosseguir para Passagens"
            />
          </div>
        </div>
      </motion.div>

      {/* Paywall modal */}
      <AnimatePresence>
        {showPaywall && (
          <PaywallModal onClose={() => setShowPaywall(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
