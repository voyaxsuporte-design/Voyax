import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet, Plane, Hotel, Compass, Package,
  Sparkles, TrendingDown, TrendingUp, AlertCircle,
  Send, Mic, MapPin, Calendar,
} from 'lucide-react';
import { IMAGES } from '../../constants';

/**
 * ===================================================
 *  PÁGINA FINANCEIRO — Orçamento da Viagem
 *  Todas as values são estado local e editáveis.
 *  Donut + barras recalculam em tempo real.
 * ===================================================
 */

type CategoryKey = 'voos' | 'hoteis' | 'experiencias' | 'extras';

interface Category {
  key: CategoryKey;
  label: string;
  icon: React.ElementType;
  color: string;
  bgLight: string;
  border: string;
  text: string;
  estimated: number;
  planned: number;
}

const INITIAL_CATEGORIES: Category[] = [
  { key: 'voos', label: 'Voos', icon: Plane, color: '#10b981', bgLight: 'bg-emerald-500/15', border: 'border-emerald-500/25', text: 'text-emerald-400', estimated: 13200, planned: 14000 },
  { key: 'hoteis', label: 'Hotéis', icon: Hotel, color: '#6366f1', bgLight: 'bg-indigo-500/15', border: 'border-indigo-500/25', text: 'text-indigo-400', estimated: 17000, planned: 18000 },
  { key: 'experiencias', label: 'Experiências', icon: Compass, color: '#f59e0b', bgLight: 'bg-amber-500/15', border: 'border-amber-500/25', text: 'text-amber-400', estimated: 9600, planned: 10000 },
  { key: 'extras', label: 'Extras', icon: Package, color: '#8b5cf6', bgLight: 'bg-violet-500/15', border: 'border-violet-500/25', text: 'text-violet-400', estimated: 3420, planned: 4000 },
];

const SAVED_TRIPS = [
  { id: '1', destination: 'Paris, França', dates: '12 – 24 Mai 2024', status: 'confirmed' as const, total: 42500 },
  { id: '2', destination: 'Tóquio, Japão', dates: '05 – 15 Set 2024', status: 'planning' as const, total: 28000 },
  { id: '3', destination: 'Maldivas, Oceano Índico', dates: '20 – 30 Dez 2024', status: 'draft' as const, total: 55000 },
];

const STATUS_LABEL = { confirmed: 'Confirmado', planning: 'Planejando', draft: 'Rascunho' };
const STATUS_COLOR = {
  confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  planning: 'bg-amber-400/15 text-amber-400 border-amber-400/25',
  draft: 'bg-white/8 text-white/40 border-white/15',
};

// Zoe mock responses
const ZOE_RESPONSES: Record<string, string> = {
  default: 'Posso analisar seu orçamento, sugerir economias ou recalcular estimativas. O que você prefere?',
  voo: 'Os voos representam 26% do seu orçamento. Para economizar, considere escalar em Lisboa — pode reduzir até R$ 2.000.',
  hotel: 'O Hôtel Plaza Athénée está dentro da média Paris Luxury. Tenho opções 5★ por R$ 200/noite a menos se quiser comparar.',
  economia: 'Com o saldo atual de R$ 6.780 você pode adicionar uma excursão privada a Versalhes (R$ 1.200) ou um jantar no Jules Verne (R$ 900).',
  total: 'Sua viagem está estimada em R$ 43.220, que representa 86% do seu orçamento de R$ 50.000. Ótima margem de segurança!',
};

function getZoeReply(msg: string): string {
  const l = msg.toLowerCase();
  if (l.includes('voo') || l.includes('passagem') || l.includes('vôo')) return ZOE_RESPONSES.voo;
  if (l.includes('hotel') || l.includes('hosped')) return ZOE_RESPONSES.hotel;
  if (l.includes('econo') || l.includes('saldo') || l.includes('sobra')) return ZOE_RESPONSES.economia;
  if (l.includes('total') || l.includes('orçamento') || l.includes('estimativa')) return ZOE_RESPONSES.total;
  return ZOE_RESPONSES.default;
}

// ── Inline editable number field ───────────────────────────────
function EditableValue({
  value,
  onChange,
  className = '',
  prefix = 'R$ ',
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
  prefix?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = () => {
    const num = parseInt(draft.replace(/\D/g, ''), 10);
    if (num > 0) onChange(num);
    setEditing(false);
  };

  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
        className={`bg-transparent outline-none border-b border-emerald-500/50 text-emerald-300 w-full ${className}`}
      />
    );
  }

  return (
    <button
      onClick={() => { setDraft(value.toLocaleString('pt-BR')); setEditing(true); }}
      className={`text-left hover:text-emerald-300 transition-colors cursor-text group relative ${className}`}
      title="Clique para editar"
    >
      {prefix}{value.toLocaleString('pt-BR')}
      <span className="absolute -top-0.5 -right-4 opacity-0 group-hover:opacity-60 text-[8px] text-emerald-400 font-bold transition-opacity">✎</span>
    </button>
  );
}

// ── Donut (SVG) — receives live data ───────────────────────────
function DonutChart({ categories, budget }: { categories: Category[]; budget: number }) {
  const SIZE = 200, STROKE = 22;
  const r = (SIZE - STROKE) / 2;
  const circ = 2 * Math.PI * r;
  const cx = SIZE / 2;
  const totalEst = categories.reduce((s, c) => s + c.estimated, 0);
  const pct = budget > 0 ? Math.min(Math.round((totalEst / budget) * 100), 999) : 0;
  let offset = 0;
  const slices = categories.map(cat => {
    const dash = totalEst > 0 ? (cat.estimated / totalEst) * circ : 0;
    const s = { color: cat.color, dash, offset };
    offset += dash;
    return s;
  });
  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={STROKE} />
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cx} r={r} fill="none" stroke={s.color} strokeWidth={STROKE}
            strokeDasharray={`${s.dash} ${circ - s.dash}`} strokeDashoffset={-s.offset} strokeLinecap="butt"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white tracking-tighter">{pct}%</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-0.5">utilizado</span>
      </div>
    </div>
  );
}

// ── Editable stat pill ─────────────────────────────────────────
function EditablePill({
  label, value, sub, accent = false, onEdit,
}: {
  label: string;
  value: number;
  sub?: string;
  accent?: boolean;
  onEdit: (v: number) => void;
}) {
  return (
    <div className={`rounded-2xl p-5 border cursor-pointer group transition-all hover:border-emerald-500/30 ${accent ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-white/[0.03] border-white/8'}`}>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35 mb-2">{label}</p>
      <EditableValue
        value={value}
        onChange={onEdit}
        className={`text-xl font-bold tracking-tight block ${accent ? 'text-emerald-400' : 'text-white'}`}
      />
      {sub && <p className="text-[10px] text-white/30 font-light mt-1">{sub}</p>}
    </div>
  );
}

// ── Category editing row ────────────────────────────────────────
function CategoryRow({
  cat, budget, onChangeEstimated,
}: {
  cat: Category;
  budget: number;
  onChangeEstimated: (k: CategoryKey, v: number) => void;
}) {
  const pct = budget > 0 ? Math.min((cat.estimated / budget) * 100, 100) : 0;
  const diff = cat.planned - cat.estimated;
  const under = diff >= 0;
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-white/[0.05] last:border-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.bgLight} border ${cat.border}`}>
        <cat.icon className={`w-4 h-4 ${cat.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-white/75 text-sm font-medium">{cat.label}</span>
          <span className="text-white font-bold text-sm tracking-tight">
            <EditableValue
              value={cat.estimated}
              onChange={v => onChangeEstimated(cat.key, v)}
              className="text-sm font-bold text-white"
            />
          </span>
        </div>
        <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: cat.color }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-bold shrink-0 ${under ? 'text-emerald-400' : 'text-rose-400'}`}>
        {under ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
        R$ {Math.abs(diff).toLocaleString('pt-BR')}
      </div>
    </div>
  );
}

// ── Zoe chat ───────────────────────────────────────────────────
interface ChatMessage { id: number; role: 'zoe' | 'user'; text: string; }

function ZoeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'zoe', text: 'Olá! Sou a Zoe, sua assistente financeira de viagem. Posso analisar seu orçamento, sugerir economias ou responder dúvidas sobre as estimativas. Em que posso ajudar?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'zoe', text: getZoeReply(text) }]);
      setIsTyping(false);
    }, 900);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col" style={{ minHeight: 340 }}>
      <div className="high-fidelity-texture" />
      {/* Header */}
      <div className="relative flex items-center gap-3 mb-4 shrink-0">
        <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/20 shrink-0">
          <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">Zoe Concierge</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">Online</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400/60" />
          <span className="text-white/25 text-[9px] font-bold uppercase tracking-wider">Assistente Financeiro</span>
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto chat-scroll space-y-3 mb-4 pr-1" style={{ maxHeight: 220 }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'zoe' && (
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-white/10 shrink-0 mt-0.5">
                <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
            <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${msg.role === 'zoe'
              ? 'bg-white/[0.05] border border-white/[0.07] text-white/75 rounded-tl-sm'
              : 'bg-emerald-500/20 border border-emerald-500/25 text-emerald-300 rounded-tr-sm'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-lg overflow-hidden border border-white/10 shrink-0 mt-0.5">
              <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.05] border border-white/[0.07] flex gap-1.5 items-center">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"
                  animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="relative flex gap-2 shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          placeholder="Pergunte sobre o orçamento..."
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/25 outline-none focus:border-emerald-500/40 transition-colors"
        />
        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-white/60 transition-colors">
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={send}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors"
        >
          <Send className="w-4 h-4 text-[#0f172a]" />
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function FinanceiroPage() {
  const [budget, setBudget] = useState(50000);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const updateEstimated = (key: CategoryKey, val: number) => {
    setCategories(prev => prev.map(c => c.key === key ? { ...c, estimated: val } : c));
  };

  const totalEst = categories.reduce((s, c) => s + c.estimated, 0);
  const saldo = budget - totalEst;
  const pctUsed = budget > 0 ? Math.min(Math.round((totalEst / budget) * 100), 999) : 0;
  const isOver = saldo < 0;
  const totalTrips = SAVED_TRIPS.reduce((s, t) => s + t.total, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto w-full min-h-screen"
    >
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight font-display text-crisp">Orçamento da Viagem</h2>
        <p className="text-white/50 text-sm font-light tracking-wide mt-1">
          Paris, França · 12 – 24 Mai 2024 · Clique em qualquer valor para editar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1️⃣ ZOE CHAT — first block */}
          <ZoeChat />

          {/* 2️⃣ Overview card with editable pills */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="high-fidelity-texture" />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              {/* Donut */}
              <div className="shrink-0">
                <DonutChart categories={categories} budget={budget} />
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 justify-center">
                  {categories.map(cat => (
                    <div key={cat.key} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{cat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editable stat pills */}
              <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                <EditablePill
                  label="Orçamento Total"
                  value={budget}
                  sub="clique para editar"
                  onEdit={setBudget}
                />
                <div className="rounded-2xl p-5 bg-white/[0.03] border border-white/8">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35 mb-2">Estimativa Atual</p>
                  <p className="text-xl font-bold tracking-tight text-white">R$ {totalEst.toLocaleString('pt-BR')}</p>
                  <p className="text-[10px] text-white/30 font-light mt-1">{pctUsed}% do orçamento</p>
                </div>
                <div className={`rounded-2xl p-5 border ${isOver ? 'bg-rose-500/8 border-rose-500/20' : 'bg-emerald-500/8 border-emerald-500/20'}`}>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35 mb-2">Saldo Disponível</p>
                  <p className={`text-xl font-bold tracking-tight ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                    R$ {Math.abs(saldo).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-[10px] text-white/25 font-light mt-1">
                    {isOver ? 'acima do orçamento' : 'dentro do orçamento'}
                  </p>
                </div>
                <div className={`rounded-2xl p-5 border flex flex-col justify-between ${isOver ? 'bg-rose-500/8 border-rose-500/20' : 'bg-white/[0.03] border-white/8'}`}>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35 mb-2">Status</p>
                  <div className={`flex items-center gap-2 ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isOver
                      ? <><AlertCircle className="w-4 h-4" /><span className="text-sm font-bold">Acima</span></>
                      : <><TrendingDown className="w-4 h-4" /><span className="text-sm font-bold">No prazo</span></>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3️⃣ Category detail — with inline editable estimated */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="high-fidelity-texture" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-4 h-4 text-white/30" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">Detalhamento por Categoria</h3>
                <span className="ml-auto text-[8px] text-white/25 font-bold uppercase tracking-widest">clique nos valores para editar</span>
              </div>

              {/* Column headers */}
              <div className="flex items-center gap-4 pb-2 mb-1">
                <div className="w-9 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-white/25">
                    <span>Categoria / Progresso</span>
                    <span className="mr-16">Estimado</span>
                  </div>
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/25 w-14 text-right">Diferença</span>
              </div>

              {categories.map(cat => (
                <CategoryRow key={cat.key} cat={cat} budget={budget} onChangeEstimated={updateEstimated} />
              ))}

              <div className="flex items-center justify-between pt-4 mt-1 border-t border-white/[0.07]">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total estimado</span>
                <span className="text-lg font-bold text-white">R$ {totalEst.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/25">Planejado original</span>
                <span className="text-sm text-white/40">R$ {categories.reduce((s, c) => s + c.planned, 0).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* 4️⃣ Confirmadas */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="high-fidelity-texture" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/30" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">Gastos das Viagens Confirmadas</h3>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/25">{SAVED_TRIPS.length} viagens</span>
              </div>
              <div className="space-y-3">
                {SAVED_TRIPS.map((trip, i) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">{trip.destination}</p>
                      <div className="flex items-center gap-1.5 text-white/30 text-[9px] font-bold uppercase tracking-[0.15em] mt-0.5">
                        <Calendar className="w-3 h-3" /> {trip.dates}
                      </div>
                    </div>
                    <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-[0.15em] shrink-0 ${STATUS_COLOR[trip.status]}`}>
                      {STATUS_LABEL[trip.status]}
                    </span>
                    <div className="text-right shrink-0">
                      <p className="text-white font-bold text-sm">R$ {trip.total.toLocaleString('pt-BR')}</p>
                      <p className="text-white/25 text-[9px]">estimado</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.07] flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total todas as viagens</span>
                <span className="text-base font-bold text-white">R$ {totalTrips.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-5 space-y-5">

          {/* Budget bar */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="high-fidelity-texture" />
            <div className="relative">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35 mb-5 flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5" /> Composição do Orçamento
              </h3>
              <div className="w-full h-3 rounded-full overflow-hidden flex mb-4 bg-white/[0.04]">
                {categories.map(cat => (
                  <motion.div
                    key={cat.key}
                    style={{ backgroundColor: cat.color }}
                    animate={{ width: `${budget > 0 ? (cat.estimated / budget) * 100 : 0}%` }}
                    transition={{ duration: 0.4 }}
                  />
                ))}
                <div className="flex-1 bg-white/5" />
              </div>
              <div className="space-y-3">
                {categories.map(cat => (
                  <div key={cat.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-white/60 text-xs">{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-[10px]">{budget > 0 ? Math.round((cat.estimated / budget) * 100) : 0}%</span>
                      <span className="text-white/70 text-xs font-medium w-24 text-right">R$ {cat.estimated.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="text-white/30 text-xs">Saldo livre</span>
                  </div>
                  <span className={`text-xs font-medium w-24 text-right ${isOver ? 'text-rose-400/70' : 'text-emerald-400/70'}`}>
                    {isOver ? '−' : ''}R$ {Math.abs(saldo).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Zoe insight static */}
          <div className="rounded-3xl p-6 bg-emerald-500/[0.06] border border-emerald-500/15">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-emerald-500/20 shrink-0">
                <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">Insight da Zoe</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${saldo}-${pctUsed}`}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-white/65 text-sm leading-relaxed font-light"
                  >
                    {isOver
                      ? `Sua estimativa está R$ ${Math.abs(saldo).toLocaleString('pt-BR')} acima do orçamento. Clique nas categorias para ajustar os valores.`
                      : `Sua estimativa está R$ ${saldo.toLocaleString('pt-BR')} abaixo do orçamento (${pctUsed}% utilizado). Você pode usar esse saldo para upgrades ou experiências extras em Paris.`
                    }
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Planejado × Estimado */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="high-fidelity-texture" />
            <div className="relative">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35 mb-4 flex items-center gap-2">
                <TrendingDown className="w-3.5 h-3.5" /> Planejado × Estimado
              </h3>
              <div className="space-y-3">
                {categories.map(cat => {
                  const diff = cat.planned - cat.estimated;
                  const under = diff >= 0;
                  return (
                    <div key={cat.key} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <cat.icon className={`w-3.5 h-3.5 ${cat.text}`} />
                        <span className="text-white/55 text-xs">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-white/25">R$ {cat.planned.toLocaleString('pt-BR')}</span>
                        <span className={`font-bold ${under ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {under ? '−' : '+'} R$ {Math.abs(diff).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
