import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, MapPin, CheckCircle2, Star, Sparkles, Trash2, Plus,
  Plane, Hotel, Compass, Wallet, ChevronRight, ArrowLeft,
  Send, Mic, Edit3, X, LayoutList, MessageSquare,
} from 'lucide-react';
import { IMAGES } from '../../constants';

/**
 * ===================================================
 *  PÁGINA MINHAS VIAGENS (MinhasViagensPage)
 *  URL: /minhas-viagens
 *
 *  Três áreas:
 *  1 — Lista de viagens (esquerda)
 *  2 — Painel de gestão da viagem (centro/direita)
 *  3 — Interface de modificação com a Zoe (centro/direita)
 * ===================================================
 */

interface Trip {
  id: string;
  destination: string;
  country: string;
  dates: string;
  status: 'confirmed' | 'planning' | 'draft';
  image: string;
  price: string;
  type: string;
  flight: string;
  hotel: string;
  experiences: string[];
  checklist: string[];
}

const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    destination: 'Paris',
    country: 'França',
    dates: '12 – 24 Mai 2024',
    status: 'confirmed',
    image: IMAGES.destinationParis,
    price: 'R$ 42.500',
    type: 'Luxury Leisure',
    flight: 'AF457 — GRU → CDG · Classe Executiva',
    hotel: 'Hôtel Plaza Athénée · 12 noites',
    experiences: ['Tour Privado no Louvre', 'Cruzeiro no Sena ao Pôr do Sol'],
    checklist: [
      'Confirmar check-in do voo AF457',
      'Reservar transfer para o hotel',
      'Imprimir ingressos do Louvre',
      'Comprar adaptador de tomada tipo C',
      'Selecionar roupas para jantar no Jules Verne',
      'Verificar validade do passaporte',
      'Ativar seguro viagem premium',
      'Trocar câmbio para Euro',
    ],
  },
  {
    id: '2',
    destination: 'Tóquio',
    country: 'Japão',
    dates: '05 – 15 Set 2024',
    status: 'planning',
    image: IMAGES.destinationTokyo,
    price: 'R$ 28.000',
    type: 'Cultural Exploration',
    flight: 'JL047 — GRU → NRT · Classe Executiva',
    hotel: 'The Peninsula Tokyo · 10 noites',
    experiences: ['Cerimônia do Chá Privada', 'Tour pelo Monte Fuji'],
    checklist: [
      'Solicitar visto japonês',
      'Confirmar passagem de trem (JR Pass)',
      'Reservar restaurante Sukiyabashi Jiro',
    ],
  },
  {
    id: '3',
    destination: 'Maldivas',
    country: 'Oceano Índico',
    dates: '20 – 30 Dez 2024',
    status: 'draft',
    image: IMAGES.destinationMaldives,
    price: 'R$ 55.000',
    type: 'Beach & Wellness',
    flight: 'A não definir',
    hotel: 'A não definir',
    experiences: [],
    checklist: ['Definir resort', 'Pesquisar hidroavião'],
  },
];

const STATUS_LABEL: Record<Trip['status'], string> = {
  confirmed: 'Confirmado',
  planning: 'Planejando',
  draft: 'Rascunho',
};
const STATUS_COLOR: Record<Trip['status'], string> = {
  confirmed: 'bg-emerald-500 text-[#0f172a]',
  planning: 'bg-amber-400 text-[#0f172a]',
  draft: 'bg-white/20 text-white',
};

// ── ZOE MODIFICATION INTERFACE ────────────────────────────────
const ZOE_MESSAGES: ZoeMessage[] = [
  { id: 'm1', text: 'O que você deseja alterar na sua viagem?', sender: 'zoe' },
];

interface ZoeMessage { id: string; text: string; sender: 'zoe' | 'user'; }

function ZoeModificationPanel({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const [messages, setMessages] = useState<ZoeMessage[]>(ZOE_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: ZoeMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Entendido! Estou verificando as melhores opções para ajustar sua viagem. Aguarde um momento enquanto analiso as alternativas disponíveis.',
        sender: 'zoe',
      }]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <div>
            <h3 className="text-white font-bold text-base tracking-tight">Modificar Viagem</h3>
            <p className="text-white/40 text-[11px]">{trip.destination}, {trip.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-[8px] font-black uppercase tracking-widest">Zoe Online</span>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Chat */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto chat-scroll space-y-3 mb-3 pr-1">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.sender === 'zoe' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-emerald-500/30 shrink-0">
                    <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed font-light ${msg.sender === 'zoe'
                  ? 'bg-white/[0.04] border border-white/8 text-white/80 rounded-tl-sm'
                  : 'bg-emerald-500/15 border border-emerald-500/20 text-white rounded-tr-sm'
                  }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-emerald-500/30 shrink-0">
                  <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex gap-1 px-4 py-3 bg-white/[0.04] border border-white/8 rounded-2xl rounded-tl-sm">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 rounded-full bg-white/40"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2 shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Descreva o que deseja alterar..."
              className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/40 placeholder-white/20"
            />
            <button className="p-2.5 text-white/20 hover:text-white/50 transition-colors">
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={send}
              className="p-2.5 bg-emerald-500 rounded-xl hover:bg-emerald-400 transition-all"
            >
              <Send className="w-4 h-4 text-[#0f172a]" />
            </button>
          </div>
        </div>

        {/* Current choices sidebar */}
        <div className="hidden md:block w-44 shrink-0 space-y-2 overflow-y-auto chat-scroll">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Seleções Atuais</p>

          {[
            { icon: Plane, label: 'Voo', value: trip.flight },
            { icon: Hotel, label: 'Hotel', value: trip.hotel },
            { icon: Compass, label: 'Experiências', value: trip.experiences.length > 0 ? `${trip.experiences.length} selecionada${trip.experiences.length > 1 ? 's' : ''}` : 'Nenhuma' },
            { icon: Wallet, label: 'Orçamento', value: trip.price },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/8 hover:border-emerald-500/20 transition-all group cursor-pointer">
              <div className="flex items-center gap-1.5 mb-1.5">
                <item.icon className="w-3 h-3 text-emerald-400/60" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{item.label}</span>
              </div>
              <p className="text-white/60 text-[10px] leading-snug group-hover:text-white/80 transition-colors">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TRIP DETAIL PANEL (itinerary + checklist) ──────────────────
function TripDetailPanel({
  trip,
  onModify,
  onClose,
}: {
  trip: Trip;
  onModify: () => void;
  onClose: () => void;
}) {
  const [checklist, setChecklist] = useState(trip.checklist);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [newItem, setNewItem] = useState('');

  const toggleCheck = (i: number) => {
    const s = new Set(checked);
    if (s.has(i)) s.delete(i); else s.add(i);
    setChecked(s);
  };
  const addItem = () => {
    if (newItem.trim()) { setChecklist([...checklist, newItem.trim()]); setNewItem(''); }
  };
  const removeItem = (i: number) => setChecklist(checklist.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <div>
            <h3 className="text-white font-bold text-base tracking-tight">{trip.destination}, {trip.country}</h3>
            <p className="text-white/40 text-[11px]">{trip.dates}</p>
          </div>
        </div>
        <span className={`text-[8px] font-black px-3 py-1.5 rounded-md uppercase tracking-[0.2em] ${STATUS_COLOR[trip.status]}`}>
          {STATUS_LABEL[trip.status]}
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto chat-scroll space-y-4 pr-1">

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { icon: Plane, label: 'Voo', value: trip.flight },
            { icon: Hotel, label: 'Hotel', value: trip.hotel },
            { icon: Wallet, label: 'Orçamento', value: trip.price },
            { icon: Compass, label: 'Experiências', value: trip.experiences.length > 0 ? trip.experiences.join(', ') : 'A definir' },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/8">
              <div className="flex items-center gap-1.5 mb-1.5">
                <item.icon className="w-3 h-3 text-emerald-400/60" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{item.label}</span>
              </div>
              <p className="text-white/60 text-[10px] leading-snug">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <div className="rounded-xl bg-white/[0.02] border border-white/8 p-4">
          <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/40" /> Preparativos
            <span className="ml-auto text-emerald-400 text-[9px]">{checked.size}/{checklist.length}</span>
          </h4>

          <div className="space-y-2 mb-3">
            {checklist.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-emerald-500/15 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    onClick={() => toggleCheck(index)}
                    className={`w-4 h-4 rounded-md border flex items-center justify-center cursor-pointer transition-all shrink-0 ${checked.has(index) ? 'border-emerald-500 bg-emerald-500' : 'border-white/20 hover:border-emerald-500'
                      }`}
                  >
                    {checked.has(index) && <div className="w-2 h-2 rounded-sm bg-[#0f172a]" />}
                  </div>
                  <span className={`text-xs font-light transition-all ${checked.has(index) ? 'text-white/25 line-through' : 'text-white/60 group-hover:text-white'
                    }`}>
                    {item}
                  </span>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-rose-400 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder="Novo item..."
              className="flex-grow bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/40 placeholder-white/20"
            />
            <button onClick={addItem} className="p-2 rounded-lg bg-emerald-500 text-[#0f172a] hover:bg-emerald-400 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zoe tip */}
        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Dica da Zoe</span>
          </div>
          <p className="text-white/50 text-[11px] leading-relaxed font-light">
            Membros Black têm check-in prioritário e concierge no aeroporto. Confirme seu status com 72h de antecedência.
          </p>
        </div>
      </div>

      {/* Modify button */}
      {trip.status !== 'confirmed' && (
        <button
          onClick={onModify}
          className="mt-4 w-full py-3.5 rounded-xl bg-white text-[#0f172a] text-[10px] font-black uppercase tracking-[0.15em] hover:bg-emerald-400 transition-all shadow-xl flex items-center justify-center gap-2 shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" /> Modificar Viagem
        </button>
      )}
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────
type PanelView = 'none' | 'detail' | 'modify';

export default function MinhasViagensPage() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [panelView, setPanelView] = useState<PanelView>('none');

  const openDetail = (trip: Trip) => {
    setSelectedTrip(trip);
    setPanelView('detail');
  };

  const openModify = () => setPanelView('modify');
  const closePanel = () => { setPanelView('none'); setSelectedTrip(null); };
  const backToDetail = () => setPanelView('detail');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto w-full min-h-screen"
    >
      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight font-display text-crisp">Minhas Viagens</h2>
        <p className="text-white/50 text-sm font-light tracking-wide mt-1">Gerencie seu itinerário e reservas exclusivas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[70vh]">

        {/* ── COLUMN 1 — Trip list ── */}
        <div className={`${panelView !== 'none' ? 'lg:col-span-4' : 'lg:col-span-8'} transition-all duration-500`}>
          <div className="space-y-4">
            {MOCK_TRIPS.map((trip) => (
              <motion.div
                key={trip.id}
                layout
                whileHover={{ y: -2 }}
                onClick={() => openDetail(trip)}
                className={`glass-card rounded-3xl overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl ${selectedTrip?.id === trip.id ? 'ring-2 ring-emerald-500/60' : ''
                  } ${panelView !== 'none' ? 'flex-col' : ''}`}
              >
                <div className={`flex ${panelView !== 'none' ? 'flex-col' : 'flex-col md:flex-row'}`}>
                  {/* Image */}
                  <div className={`relative overflow-hidden shrink-0 ${panelView !== 'none' ? 'h-32 w-full' : 'w-full md:w-56 h-40 md:h-auto'}`}>
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f172a]/60 hidden md:block" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[8px] font-black px-2.5 py-1 rounded uppercase tracking-[0.2em] shadow ${STATUS_COLOR[trip.status]}`}>
                        {STATUS_LABEL[trip.status]}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-grow p-5 flex flex-col justify-between relative">
                    <div className="high-fidelity-texture" />
                    <div className="relative">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                          {trip.destination}, {trip.country}
                        </h3>
                        <p className="text-white font-bold text-sm tracking-tighter">{trip.price}</p>
                      </div>
                      <div className="flex items-center flex-wrap gap-3 text-white/30 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-emerald-500/30" /> {trip.dates}</div>
                        <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500/30" /> {trip.type}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 relative">
                      <button
                        onClick={e => { e.stopPropagation(); openDetail(trip); }}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${selectedTrip?.id === trip.id && panelView !== 'none'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          }`}
                      >
                        <LayoutList className="w-3 h-3" />
                        {panelView !== 'none' && selectedTrip?.id === trip.id ? 'Aberto' : 'Itinerário'}
                      </button>
                      {trip.status !== 'confirmed' && (
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedTrip(trip); openModify(); }}
                          className="px-4 py-2.5 rounded-xl bg-white text-[#0f172a] text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3 h-3" /> Modificar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── COLUMN 2 — Detail / Modify panel ── */}
        <AnimatePresence mode="wait">
          {panelView !== 'none' && selectedTrip && (
            <motion.div
              key={panelView}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-8 sticky top-24 self-start"
            >
              <div className="glass-card rounded-3xl p-6 h-[calc(100vh-180px)] flex flex-col relative overflow-hidden">
                <div className="high-fidelity-texture" />
                <div className="relative flex flex-col h-full">
                  {panelView === 'detail' && (
                    <TripDetailPanel
                      trip={selectedTrip}
                      onModify={openModify}
                      onClose={closePanel}
                    />
                  )}
                  {panelView === 'modify' && (
                    <ZoeModificationPanel
                      trip={selectedTrip}
                      onClose={backToDetail}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
