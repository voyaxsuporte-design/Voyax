import { useState } from 'react';
import { motion } from 'motion/react';
import { Plane, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TripContextPanel from '../../components/TripContextPanel';
import ZoeMiniChat from '../../components/ZoeMiniChat';
import { useAppContext } from '../../App';
import { Flight } from '../../types';
import { PaywallGate } from '../../components/PaywallGate';

/**
 * ===================================================
 *  PÁGINA DE PASSAGENS (PassagensPage)
 *  URL: /passagens
 *
 *  Tela para selecionar voos. Mostra cards de voo
 *  com preços, horários, e seletor de classe de cabine.
 * ===================================================
 */

const CABIN_CLASSES = [
  { id: 'economy', label: 'ECONÔMICA', price: 'Incluso', active: true },
  { id: 'premium', label: 'PREMIUM ECONOMY', price: '+ € 250' },
  { id: 'first', label: 'PRIMEIRA CLASSE', price: '+ € 1.200' },
];

const MOCK_FLIGHTS: Flight[] = [
  { id: '1', airline: 'Air France', number: 'AF457', departureTime: '08:45', arrivalTime: '23:10', duration: '11h 25m', stops: 'Direto', price: 1120, recommended: true, cabin: 'Economy' },
  { id: '2', airline: 'Lufthansa', number: 'LH507', departureTime: '14:20', arrivalTime: '06:15', duration: '13h 55m', stops: '1 Parada (FRA)', price: 895, cabin: 'Economy' },
  { id: '3', airline: 'TAP Portugal', number: 'TP082', departureTime: '22:05', arrivalTime: '14:30', duration: '14h 25m', stops: '1 Parada (LIS)', price: 940, cabin: 'Economy' },
];

export default function PassagensPage() {
  const navigate = useNavigate();
  const { tripContextProps, setSelectedFlight } = useAppContext();
  const [selectedCabin, setSelectedCabin] = useState('economy');
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);

  const handleSelect = (flight: Flight) => {
    setLocalSelectedId(flight.id);
    setSelectedFlight(flight);
    navigate('/hospedagem');
  };

  return (
    <PaywallGate pageName="Passagens" icon={Plane}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="pt-20 pb-16 min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-8">
            {/* Área principal — lista de voos */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="pt-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Selecione seu voo para <span className="text-emerald-400">{tripContextProps.destination.name}</span>
                </h2>
              </div>

              {/* Voo recomendado pela Zoe */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
                <div className="px-6 pt-4 pb-3 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/30" /><div className="w-1 h-1 rounded-full bg-white/30" /><div className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">RECOMENDADO PELA ZOE</span>
                </div>

                <div className="px-6 pb-6">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Plane className="w-5 h-5 text-emerald-400/60" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-white tracking-tight">{MOCK_FLIGHTS[0].departureTime}</span>
                        <span className="text-white/30">—</span>
                        <span className="text-xl font-bold text-white tracking-tight">{MOCK_FLIGHTS[0].arrivalTime}</span>
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-1">
                        {MOCK_FLIGHTS[0].airline} • {MOCK_FLIGHTS[0].number}
                      </p>
                    </div>
                    <div className="text-center px-6">
                      <div className="text-[10px] text-white/30 font-bold">{MOCK_FLIGHTS[0].duration}</div>
                      <div className="w-20 h-px bg-white/10 my-1.5 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/20" />
                      </div>
                      <div className="text-[9px] text-white/30 font-bold uppercase">{MOCK_FLIGHTS[0].stops}</div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white tracking-tighter">€ {MOCK_FLIGHTS[0].price.toLocaleString()}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">IDA E VOLTA</p>
                    </div>
                    <button
                      onClick={() => handleSelect(MOCK_FLIGHTS[0])}
                      className="px-6 py-3 rounded-xl border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-[#0a1628] transition-all shrink-0"
                    >
                      SELECIONAR
                    </button>
                  </div>
                </div>

                {/* Seletor de cabine */}
                <div className="px-6 pb-6 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">PASSO 2 DE 2</p>
                      <p className="text-white font-bold text-sm">ESCOLHA SUA CATEGORIA</p>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Valores adicionais por passageiro</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {CABIN_CLASSES.map((cabin) => (
                      <button
                        key={cabin.id}
                        onClick={() => setSelectedCabin(cabin.id)}
                        className={`p-4 rounded-xl border transition-all text-left ${selectedCabin === cabin.id
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-xs font-bold">{cabin.label}</span>
                          {selectedCabin === cabin.id && (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-[#0a1628]" />
                            </div>
                          )}
                        </div>
                        <p className="text-white/40 text-[10px] font-bold">{cabin.price}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outros voos */}
              {MOCK_FLIGHTS.slice(1).map((flight) => (
                <div key={flight.id} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-6 py-5">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Plane className="w-5 h-5 text-white/30" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-white tracking-tight">{flight.departureTime}</span>
                        <span className="text-white/30">—</span>
                        <span className="text-xl font-bold text-white tracking-tight">{flight.arrivalTime}</span>
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-1">
                        {flight.airline} • {flight.number}
                      </p>
                    </div>
                    <div className="text-center px-6">
                      <div className="text-[10px] text-white/30 font-bold">{flight.duration}</div>
                      <div className="w-20 h-px bg-white/10 my-1.5 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/20" />
                      </div>
                      <div className="text-[9px] text-white/30 font-bold uppercase">{flight.stops}</div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white tracking-tighter">€ {flight.price.toLocaleString()}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">IDA E VOLTA</p>
                    </div>
                    <button
                      onClick={() => handleSelect(flight)}
                      className="px-6 py-3 rounded-xl border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all shrink-0"
                    >
                      SELECIONAR
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar direita — painel de viagem */}
            <div className="col-span-12 lg:col-span-4">
              <div className="sticky top-20">
                <TripContextPanel
                  {...tripContextProps}
                  onNext={() => navigate('/hospedagem')}
                  nextLabel="PROSSEGUIR PARA HOTÉIS"
                  currentStep={1}
                />
              </div>
            </div>
          </div>
        </div>
        <ZoeMiniChat context="passagens" destination={tripContextProps.destination.name} />
      </motion.div>
    </PaywallGate>
  );
}
