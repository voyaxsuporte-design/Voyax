import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, ChevronRight, Sparkles, MapPin, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMAGES, DESTINATIONS, Destination } from '../../constants';
import TripContextPanel from '../../components/TripContextPanel';
import { useAppContext } from '../../App';
import { PaywallModal } from '../../components/PaywallGate';
import TripEditDrawer from '../../components/TripEditDrawer';

/**
 * ===================================================
 *  PÁGINA DO CHAT (ChatPage)
 *  URL: /chat
 *
 *  Tela de conversa com a Zoe (OpenAI).
 *  A IA extrai destinos automaticamente de qualquer
 *  mensagem e atualiza o estado global.
 *
 *  Paywall: disparado após a 3ª resposta da Zoe
 *  quando o usuário é FREE.
 * ===================================================
 */

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'zoe';
  timestamp: Date;
}

/**
 * Create a Destination object from an AI-extracted destination.
 * Tries to match with a known DESTINATION first (for image/climate/exchange).
 * If no match, creates a dynamic generic Destination.
 */
function createDestination(name: string, country: string): Destination {
  // Try to find in the known DESTINATIONS list
  const known = DESTINATIONS.find(
    d => d.name.toLowerCase() === name.toLowerCase() ||
      d.country.toLowerCase() === country.toLowerCase()
  );
  if (known) return known;

  // Create a dynamic destination for any city/country
  return {
    name,
    country,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    climate: '—',
    exchange: '—',
  };
}

/**
 * Call the Zoe API with conversation history and trip context.
 * Returns { reply, extractedDestination? }
 */
async function callZoeAPI(
  userMessage: string,
  conversationHistory: Message[],
  tripContext: { destination: string; country: string },
): Promise<{ reply: string; extractedDestination?: { name: string; country: string } }> {
  const history = conversationHistory.slice(-6).map(m => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text,
  }));

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        conversationHistory: history,
        tripContext,
      }),
    });

    const data = await res.json();
    return {
      reply: data.reply || 'Desculpe, não consegui processar sua solicitação.',
      extractedDestination: data.extractedDestination || undefined,
    };
  } catch (err) {
    console.error('Zoe API error:', err);
    return { reply: 'Desculpe, estou com um pequeno problema técnico. Tente novamente em instantes.' };
  }
}

// ── Chat Input Area ────────────────────────────────
const ChatInputArea = ({ onSend, blocked }: { onSend: (text: string) => void; blocked: boolean }) => {
  const [input, setInput] = useState('');
  const { tripContextProps } = useAppContext();
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const suggestions = [
    `Experimente sugerir: 'Roteiro de 5 dias em ${tripContextProps.destination.name}'`,
    "Experimente sugerir: 'Quero viajar para a China'",
    "Experimente sugerir: 'Restaurantes com estrela Michelin em Tóquio'",
    "Experimente sugerir: 'Viagem para Bangkok'",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [suggestions.length]);

  const handleSend = () => {
    if (!input.trim() || blocked) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="pb-2 sm:pb-4 pt-2 sm:pt-4 shrink-0 mt-auto px-0">
      <div className={`bg-white/[0.05] premium-blur border rounded-2xl sm:rounded-[32px] p-1.5 sm:p-2 flex items-center shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden group transition-all duration-700 ${blocked ? 'border-white/5 opacity-50 pointer-events-none' : 'border-white/10 focus-within:border-emerald-500/30'}`}>
        <div className="high-fidelity-texture" />
        <div className="flex items-center pl-3 sm:pl-4 md:pl-8 gap-2 sm:gap-3 md:gap-5 flex-grow relative min-w-0">
          <Sparkles className="text-white/20 w-4 h-4 sm:w-5 sm:h-5 font-light group-focus-within:text-emerald-400 transition-colors z-10 shrink-0" />
          {!input && (
            <div className="absolute left-[40px] sm:left-[52px] md:left-[68px] right-0 pointer-events-none hidden sm:flex items-center h-full truncate">
              <AnimatePresence mode="wait">
                <motion.span
                  key={suggestionIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/30 text-sm sm:text-base md:text-lg font-light tracking-tight text-crisp truncate"
                >
                  {suggestions[suggestionIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent text-white placeholder-white/20 text-sm sm:text-base md:text-lg w-full font-light tracking-tight py-3 sm:py-4 md:py-5 text-crisp relative z-10"
            placeholder="Fale com a Zoe..."
          />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 pr-1.5 sm:pr-3">
          <button className="hidden sm:block p-2 sm:p-3 text-white/20 hover:text-white transition-colors hover:bg-white/5 rounded-2xl">
            <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleSend}
            className="bg-white text-[#0f172a] p-3 sm:p-4 rounded-xl sm:rounded-[20px] hover:bg-emerald-400 transition-all shadow-xl group/send"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────
export default function ChatPage() {
  const navigate = useNavigate();
  const { tripContextProps, searchQuery, setSearchQuery, userPlan } = useAppContext();
  const destination = tripContextProps.destination;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Olá! Sou a Zoe, sua concierge premium. Estou aqui para ajudar com tudo sobre sua viagem. Para onde gostaria de ir?`,
      sender: 'zoe',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showTripDrawer, setShowTripDrawer] = useState(false);
  const zoeReplyCountRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const injectedRef = useRef(false);
  const isSendingRef = useRef(false);

  // Paywall triggers on 3rd Zoe reply for free users
  const PAYWALL_TRIGGER = 3;
  const isBlocked = userPlan === 'free' && zoeReplyCountRef.current >= PAYWALL_TRIGGER;

  /**
   * Process AI response: update destination if AI extracted one,
   * add Zoe's message to chat, handle paywall.
   */
  const processAIResponse = (
    reply: string,
    extractedDestination?: { name: string; country: string },
  ) => {
    // If AI extracted a destination, update the global trip state
    if (extractedDestination) {
      const newDest = createDestination(extractedDestination.name, extractedDestination.country);
      if (newDest.name !== tripContextProps.destination.name) {
        tripContextProps.onChangeDestination(newDest);
      }
    }

    zoeReplyCountRef.current += 1;

    const zoeMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: reply,
      sender: 'zoe',
      timestamp: new Date(),
    };

    // Prevent duplicate messages
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last && last.sender === 'zoe' && last.text === reply) {
        return prev;
      }
      return [...prev, zoeMsg];
    });

    // Trigger paywall after the 3rd Zoe reply for free users
    if (userPlan === 'free' && zoeReplyCountRef.current >= PAYWALL_TRIGGER) {
      setTimeout(() => setShowPaywall(true), 700);
    }
  };

  /**
   * Send a user message to the Zoe API and process the response.
   * Guarded by isSendingRef to prevent double calls.
   */
  const sendToZoe = async (userText: string, allMessages: Message[]) => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    setIsTyping(true);

    try {
      const { reply, extractedDestination } = await callZoeAPI(
        userText,
        allMessages,
        {
          destination: tripContextProps.destination.name,
          country: tripContextProps.destination.country,
        },
      );
      processAIResponse(reply, extractedDestination);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, estou com um problema técnico. Tente novamente.',
        sender: 'zoe',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
      isSendingRef.current = false;
    }
  };

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
      setMessages(prev => {
        const updated = [...prev, userMsg];
        sendToZoe(query, updated);
        return updated;
      });
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    // Prevent double sends
    if (isTyping || isSendingRef.current) return;

    // If free user hit limit, show paywall
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

    setMessages(prev => {
      const updated = [...prev, userMsg];
      sendToZoe(text, updated);
      return updated;
    });
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
        className="fixed inset-0 z-20 pt-20 lg:pt-28 pb-16 md:pb-8 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto w-full h-full px-3 sm:px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-8">
          <div className="lg:col-span-8 flex flex-col min-h-0 overflow-hidden lg:border-r border-white/5 lg:pr-6 relative">
            {/* Mobile trip summary bar — responsive two-row layout */}
            <div className="lg:hidden flex flex-col gap-1.5 py-2 pb-2.5 px-1 border-b border-white/5 shrink-0">
              {/* Row 1: Destination + Edit */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-white font-bold text-sm truncate">
                    {tripContextProps.destination.name}, {tripContextProps.destination.country}
                  </span>
                </div>
                <button
                  onClick={() => setShowTripDrawer(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all shrink-0"
                >
                  <Settings className="w-3 h-3" /> EDITAR
                </button>
              </div>
              {/* Row 2: Date */}
              <div className="flex items-center gap-2 pl-[22px]">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-wide">
                  {tripContextProps.tripDates.departure} — {tripContextProps.tripDates.return}
                </span>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto chat-scroll py-2 sm:py-4 space-y-3 sm:space-y-5 min-h-0"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 sm:gap-4 max-w-[95%] sm:max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.sender === 'zoe' ? (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border border-white/[0.08] overflow-hidden flex-shrink-0 shadow-xl bg-emerald-500/10 mt-1">
                        <img
                          src={IMAGES.zoeAvatar}
                          alt="Zoe"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-8 sm:w-10 flex-shrink-0" />
                    )}
                    <div className={`px-3.5 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl relative ${msg.sender === 'user'
                      ? 'bg-white/[0.08] border border-white/[0.10] ml-auto'
                      : 'bg-white/[0.04] border border-white/[0.06]'
                      }`}>
                      <p className="text-white/90 text-[13px] sm:text-[15px] leading-relaxed font-light tracking-wide">
                        {msg.text}
                      </p>
                      {msg.sender === 'zoe' && msg.id !== '1' && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={goToFlights}
                          className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all"
                        >
                          Ver opções de voos <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
                  <div className="flex gap-2 sm:gap-5">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden flex-shrink-0 bg-emerald-500/10">
                      <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-3 sm:p-5 rounded-2xl sm:rounded-[24px] bg-white/5 border border-white/10 flex items-center gap-1.5">
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
        </div>
      </motion.div>

      {/* Paywall modal */}
      <AnimatePresence>
        {showPaywall && (
          <PaywallModal onClose={() => setShowPaywall(false)} />
        )}
      </AnimatePresence>

      <TripEditDrawer open={showTripDrawer} onClose={() => setShowTripDrawer(false)} />
    </>
  );
}
