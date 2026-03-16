import { useState } from 'react';
import { motion } from 'motion/react';
import { Plane, Check, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TripContextPanel from '../../components/TripContextPanel';
import ZoeMiniChat from '../../components/ZoeMiniChat';
import { useAppContext } from '../../App';
import { PaywallGate } from '../../components/PaywallGate';
import TripEditDrawer from '../../components/TripEditDrawer';
import TravelpayoutsWidget from '../../components/TravelpayoutsWidget';

/**
 * ===================================================
 *  PÁGINA DE PASSAGENS (PassagensPage)
 *  URL: /passagens
 *
 *  Tela para selecionar voos. Mostra cards de voo
 *  com preços, horários, e seletor de classe de cabine.
 * ===================================================
 */

export default function PassagensPage() {
  const navigate = useNavigate();
  const { tripContextProps } = useAppContext();
  const [showTripDrawer, setShowTripDrawer] = useState(false);

  return (
    <PaywallGate pageName="Passagens" icon={Plane}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="pt-20 pb-16 min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Área principal — lista de voos */}
            <div className="lg:col-span-8 space-y-6">
              <div className="pt-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Selecione seu voo para <span className="text-emerald-400">{tripContextProps.destination.name}</span>
                </h2>
                <button
                  onClick={() => setShowTripDrawer(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white/70 transition-all shrink-0"
                >
                  <Settings className="w-3 h-3" /> MODIFICAR
                </button>
              </div>

              <div className="mt-8">
                <TravelpayoutsWidget />
              </div>
            </div>

            {/* Sidebar direita — painel de viagem */}
            <div className="lg:col-span-4">
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
        <TripEditDrawer open={showTripDrawer} onClose={() => setShowTripDrawer(false)} />
      </motion.div>
    </PaywallGate >
  );
}
