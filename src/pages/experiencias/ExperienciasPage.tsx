import { motion } from 'motion/react';
import { Star, ChevronRight, ArrowLeft, Clock, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Experience } from '../../types';
import { IMAGES } from '../../constants';
import TripContextPanel from '../../components/TripContextPanel';
import ZoeMiniChat from '../../components/ZoeMiniChat';
import { useAppContext } from '../../App';
import { useState } from 'react';
import { PaywallGate } from '../../components/PaywallGate';
import TripEditDrawer from '../../components/TripEditDrawer';

/**
 * ===================================================
 *  PÁGINA DE EXPERIÊNCIAS (ExperienciasPage)
 *  URL: /experiencias
 *
 *  Tela para selecionar experiências e passeios.
 *  Layout igual aos outros módulos: scroll natural,
 *  TripContextPanel sticky na direita.
 * ===================================================
 */

const EXPERIENCES: Experience[] = [
  {
    id: '1',
    name: 'Tour Privado no Louvre',
    duration: '4 horas',
    price: 2400,
    image: IMAGES.louvre,
    rating: 5,
    recommended: true,
  },
  {
    id: '2',
    name: 'Cruzeiro no Sena ao Pôr do Sol',
    duration: '2 horas',
    price: 1800,
    image: IMAGES.seineCruise,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Jantar Gourmet na Torre Eiffel',
    duration: '3 horas',
    price: 3200,
    image: IMAGES.eiffelDinner,
    rating: 5,
    recommended: true,
  },
  {
    id: '4',
    name: 'Palácio de Versalhes VIP',
    duration: '6 horas',
    price: 4500,
    image: IMAGES.versailles,
    rating: 4.8,
  },
];

export default function ExperienciasPage() {
  const navigate = useNavigate();
  const { tripContextProps, setSelectedExperience: setGlobalExperience } = useAppContext();
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(EXPERIENCES[0]);
  const [showTripDrawer, setShowTripDrawer] = useState(false);

  return (
    <PaywallGate pageName="Experiências" icon={Star}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="pt-20 pb-16 min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

            {/* Left column — scrolls with page */}
            <div className="lg:col-span-8 space-y-6 lg:border-r border-white/5 lg:pr-6">
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => navigate('/hospedagem')}
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-white/60" />
                </button>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight font-display text-crisp">Experiências Curadas</h2>
                  <p className="text-white/50 text-sm font-light tracking-wide">Momentos inesquecíveis desenhados para o seu perfil</p>
                </div>
                <button
                  onClick={() => setShowTripDrawer(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white/70 transition-all shrink-0 ml-auto"
                >
                  <Settings className="w-3 h-3" /> MODIFICAR
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {EXPERIENCES.map((exp) => (
                  <motion.div
                    key={exp.id}
                    whileHover={{ y: -8 }}
                    className={`glass-card rounded-[32px] overflow-hidden group cursor-pointer flex flex-col transition-all duration-500 hover:shadow-2xl ${selectedExperience?.id === exp.id ? 'ring-2 ring-emerald-500' : ''
                      }`}
                    onClick={() => setSelectedExperience(exp)}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={exp.image}
                        alt={exp.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-70" />

                      {exp.recommended && (
                        <div className="absolute top-4 left-4 bg-white text-[#0f172a] text-[8px] font-black px-3 py-1.5 rounded-sm uppercase tracking-[0.3em] shadow-2xl">
                          Premium
                        </div>
                      )}

                      <div className="absolute bottom-4 left-5 right-5 flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-white text-[11px] font-black tracking-tighter">{exp.rating}</span>
                        </div>
                        <div className="text-white font-bold text-base tracking-tighter">
                          R$ {exp.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow relative">
                      <div className="high-fidelity-texture" />
                      <h3 className="text-[15px] font-bold text-white mb-4 leading-snug group-hover:text-emerald-400 transition-colors tracking-tight">
                        {exp.name}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-auto">
                        <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-[0.25em]">
                          <Clock className="w-3.5 h-3.5 text-emerald-500/30" />
                          {exp.duration}
                        </div>
                        <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-[0.25em]">
                          <Users className="w-3.5 h-3.5 text-emerald-500/30" />
                          Privado
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Custom experience CTA */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="high-fidelity-texture" />
                <div className="max-w-md">
                  <h3 className="text-xl font-bold text-white mb-2 font-display">Deseja algo sob medida?</h3>
                  <p className="text-white/50 text-xs font-light leading-relaxed">
                    Zoe pode organizar eventos exclusivos, desde jantares privados com chefs Michelin até acesso a coleções de arte fechadas ao público.
                  </p>
                </div>
                <button className="bg-white text-[#0f172a] px-6 py-3 shrink-0 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-xl flex items-center gap-2">
                  Solicitar Personalização
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right column — sticky TripContextPanel */}
            <div className="lg:col-span-4">
              <div className="sticky top-20">
                <TripContextPanel
                  {...tripContextProps}
                  onNext={() => {
                    if (selectedExperience) {
                      setGlobalExperience(selectedExperience);
                      navigate('/checkout');
                    }
                  }}
                  nextLabel="Prosseguir para Checkout"
                  currentStep={3}
                />
              </div>
            </div>

          </div>
        </div>
        <ZoeMiniChat context="experiencias" destination={tripContextProps.destination.name} />
        <TripEditDrawer open={showTripDrawer} onClose={() => setShowTripDrawer(false)} />
      </motion.div>
    </PaywallGate>
  );
}
