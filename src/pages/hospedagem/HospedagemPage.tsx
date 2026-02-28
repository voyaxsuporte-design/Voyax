import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MapPin, Filter, X, SlidersHorizontal, ArrowLeft, Hotel as HotelIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TripContextPanel from '../../components/TripContextPanel';
import ZoeMiniChat from '../../components/ZoeMiniChat';
import { useAppContext } from '../../App';
import { IMAGES } from '../../constants';
import { Hotel } from '../../types';
import { PaywallGate } from '../../components/PaywallGate';

/**
 * ===================================================
 *  PÁGINA DE HOSPEDAGEM (HospedagemPage)
 *  URL: /hospedagem
 *
 *  Tela para selecionar hotéis. Mostra cards com
 *  imagens, preços, badge ZOE CHOICE, e painel de
 *  filtros premium deslizante.
 * ===================================================
 */

const MOCK_HOTELS: Hotel[] = [
  { id: '1', name: 'Hôtel Plaza Athénée', image: IMAGES.hotelPlaza, rating: 5, price: 8500, location: 'Avenue Montaigne, Paris', description: 'O epítome do luxo parisiense com vista direta para a Torre Eiffel.', amenities: ['Spa', 'Michelin Star', 'Butler'], recommended: true, guestRating: 4.9 },
  { id: '2', name: 'Le Meurice', image: IMAGES.hotelMeurice, rating: 5, price: 7200, location: 'Rue de Rivoli, Paris', description: 'Um palácio histórico combinando esplendor do século XVIII com design moderno.', amenities: ['Fine Dining', 'Alain Ducasse', 'Spa'], guestRating: 4.8 },
  { id: '3', name: 'Saint James Paris', image: IMAGES.hotelSaintJames, rating: 4, price: 5900, location: '16th Arrondissement, Paris', description: 'Hotel-chateau com jardins privados no coração de Paris.', amenities: ['Garden', 'Library Bar', 'Spa'], guestRating: 4.7 },
];

// --- Toggle Switch Component ---
function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${active ? 'bg-emerald-500' : 'bg-white/10'
        }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform duration-300 ${active ? 'translate-x-5' : 'translate-x-0'
          }`}
      />
    </button>
  );
}

// --- Filter State Type ---
interface FilterState {
  maxPrice: number;
  stars: number;          // 0 = não filtrado, 1-5 = selecionado
  guestRating: string;    // '', '9+', '8+'
  styles: string[];
  wifiGratuito: boolean;
  cafeManha: boolean;
  cancelamentoGratuito: boolean;
  reservaImediata: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  maxPrice: 2000,
  stars: 0,
  guestRating: '',
  styles: [],
  wifiGratuito: false,
  cafeManha: false,
  cancelamentoGratuito: false,
  reservaImediata: false,
};

// --- Filter Drawer ---
function FilterDrawer({
  open,
  filters,
  onChange,
  onApply,
  onClear,
  onClose,
}: {
  open: boolean;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const styles = ['Boutique', 'Histórico', 'Moderno', 'Resort', 'Design'];
  const toggleStyle = (s: string) =>
    onChange({ ...filters, styles: filters.styles.includes(s) ? filters.styles.filter(x => x !== s) : [...filters.styles, s] });

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
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-[70] flex flex-col bg-[#0d1b2a] border-l border-white/8 shadow-[−40px_0_80px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 shrink-0">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white font-bold text-base tracking-tight">Filtrar Hotéis</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto chat-scroll px-6 py-5 space-y-7">

              {/* PREÇO */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Preço</span>
                  <span className="text-emerald-400 text-xs font-bold">Até € {filters.maxPrice.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <div className="flex justify-between text-[9px] text-white/30 font-bold mb-1.5">
                    <span>€ 100</span><span>€ 2.000+</span>
                  </div>
                  <input
                    type="range" min={100} max={2000} step={50}
                    value={filters.maxPrice}
                    onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full accent-emerald-500 h-1.5 rounded-full cursor-pointer"
                  />
                </div>
              </div>

              <div className="border-t border-white/5" />

              {/* CLASSIFICAÇÃO — star selector */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3">Classificação</span>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        onClick={() => onChange({ ...filters, stars: filters.stars === s ? 0 : s })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${s <= filters.stars
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-white/20 fill-transparent'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-[9px] font-bold uppercase tracking-widest text-white/25 mt-1">
                    {filters.stars === 0 ? 'Selecione o nível de luxo' : `${filters.stars} ${filters.stars === 1 ? 'Estrela' : 'Estrelas'}`}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/5" />

              {/* AVALIAÇÃO DOS HÓSPEDES */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3">Avaliação</span>
                <div className="flex gap-2">
                  {[{ label: '9+ Excelente', val: '9+' }, { label: '8+ Muito Bom', val: '8+' }].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => onChange({ ...filters, guestRating: filters.guestRating === opt.val ? '' : opt.val })}
                      className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${filters.guestRating === opt.val
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : 'bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/[0.07]'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5" />

              {/* ESTILO */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3">Estilo</span>
                <div className="flex flex-wrap gap-2">
                  {styles.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleStyle(s)}
                      className={`px-4 py-2 rounded-full border text-[10px] font-bold transition-all ${filters.styles.includes(s)
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : 'bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/[0.07]'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5" />

              {/* COMODIDADES */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3">Comodidades</span>
                <div className="space-y-3.5">
                  {[
                    { label: 'Wi-Fi Gratuito', key: 'wifiGratuito' as const },
                    { label: 'Café da Manhã Incluso', key: 'cafeManha' as const },
                    { label: 'Piscina', key: null },
                    { label: 'Spa & Wellness', key: null },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-white/70 text-sm font-light">{item.label}</span>
                      <Toggle
                        active={item.key ? filters[item.key] : false}
                        onChange={() => item.key && onChange({ ...filters, [item.key]: !filters[item.key] })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5" />

              {/* POLÍTICAS */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3">Políticas</span>
                <div className="space-y-3.5">
                  {[
                    { label: 'Cancelamento Gratuito', key: 'cancelamentoGratuito' as const },
                    { label: 'Reserva Imediata', key: 'reservaImediata' as const },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-white/70 text-sm font-light">{item.label}</span>
                      <Toggle
                        active={filters[item.key]}
                        onChange={() => onChange({ ...filters, [item.key]: !filters[item.key] })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-5 border-t border-white/8 space-y-2 shrink-0">
              <button
                onClick={onApply}
                className="w-full py-4 rounded-xl bg-white text-[#0a1628] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={onClear}
                className="w-full py-2 text-white/30 text-[10px] font-bold uppercase tracking-widest hover:text-white/60 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Main Page ---
export default function HospedagemPage() {
  const navigate = useNavigate();
  const { tripContextProps, setSelectedHotel } = useAppContext();
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const handleApply = () => {
    setAppliedFilters(pendingFilters);
    setShowFilterDrawer(false);
  };

  const handleClear = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const activeFilterCount = [
    appliedFilters.stars > 0,
    appliedFilters.guestRating !== '',
    appliedFilters.styles.length > 0,
    appliedFilters.wifiGratuito,
    appliedFilters.cafeManha,
    appliedFilters.cancelamentoGratuito,
    appliedFilters.reservaImediata,
    appliedFilters.maxPrice < 2000,
  ].filter(Boolean).length;

  const handleSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    navigate('/experiencias');
  };

  return (
    <PaywallGate pageName="Hospedagem" icon={HotelIcon}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="pt-20 pb-16 min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="pt-4 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/passagens')}
                    className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 text-white/60" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Hospedagem Premium</h2>
                    <p className="text-white/40 text-sm font-light">Uma cuidadosa curadoria Zoe para {tripContextProps.destination.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setPendingFilters(appliedFilters); setShowFilterDrawer(true); }}
                  className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
                >
                  <Filter className="w-3.5 h-3.5" /> FILTROS
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-[#0a1628] text-[8px] font-black flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>


              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {appliedFilters.stars > 0 && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {appliedFilters.stars}★
                    </span>
                  )}
                  {appliedFilters.guestRating && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      Avaliação {appliedFilters.guestRating}
                    </span>
                  )}
                  {appliedFilters.styles.map(s => (
                    <span key={s} className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {s}
                    </span>
                  ))}
                  {appliedFilters.maxPrice < 2000 && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      Até € {appliedFilters.maxPrice}
                    </span>
                  )}
                  <button
                    onClick={handleClear}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold hover:text-white/70 transition-colors"
                  >
                    Limpar tudo
                  </button>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_HOTELS.map((hotel) => (
                  <motion.div
                    key={hotel.id}
                    whileHover={{ y: -4 }}
                    onClick={() => handleSelect(hotel)}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden cursor-pointer group transition-all hover:border-emerald-500/20"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-80" />
                      {hotel.recommended && (
                        <div className="absolute top-4 left-4 bg-emerald-500 text-[#0a1628] text-[8px] font-black px-3 py-1.5 rounded-md uppercase tracking-[0.2em]">ZOE CHOICE</div>
                      )}
                      {/* Guest rating badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-[10px] font-bold">{hotel.guestRating}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-2xl font-bold text-white tracking-tighter">R$ {hotel.price.toLocaleString()}</span>
                        <span className="text-white/40 text-xs ml-1">/NOITE</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors tracking-tight">{hotel.name}</h3>
                      <div className="flex items-center gap-1.5 text-white/30 text-[9px] font-bold uppercase tracking-widest mb-3">
                        <MapPin className="w-3 h-3" /> {hotel.location}
                      </div>
                      <p className="text-white/40 text-xs font-light leading-relaxed">{hotel.description}</p>
                      {/* Amenity chips */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {hotel.amenities.map(a => (
                          <span key={a} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-white/30 text-[8px] font-bold uppercase tracking-widest">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="sticky top-20">
                <TripContextPanel {...tripContextProps} onNext={() => navigate('/experiencias')} nextLabel="PROSSEGUIR PARA EXPERIÊNCIAS" currentStep={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Drawer */}
        <FilterDrawer
          open={showFilterDrawer}
          filters={pendingFilters}
          onChange={setPendingFilters}
          onApply={handleApply}
          onClear={handleClear}
          onClose={() => setShowFilterDrawer(false)}
        />

        <ZoeMiniChat context="hoteis" destination={tripContextProps.destination.name} />
      </motion.div>
    </PaywallGate>
  );
}
