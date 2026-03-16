import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Hotel as HotelIcon, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TripContextPanel from '../../components/TripContextPanel';
import ZoeMiniChat from '../../components/ZoeMiniChat';
import { useAppContext } from '../../App';
import { PaywallGate } from '../../components/PaywallGate';
import TripEditDrawer from '../../components/TripEditDrawer';
import TravelpayoutsWidget from '../../components/TravelpayoutsWidget';

/**
 * ===================================================
 *  PÁGINA DE HOSPEDAGEM (HospedagemPage)
 *  URL: /hospedagem
 *
 *  Tela para pesquisar hotéis.
 * ===================================================
 */

export default function HospedagemPage() {
  const navigate = useNavigate();
  const { tripContextProps } = useAppContext();
  const [showTripDrawer, setShowTripDrawer] = useState(false);

  return (
    <PaywallGate pageName="Hospedagem" icon={HotelIcon}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="pt-20 pb-16 min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="pt-4 flex flex-col md:flex-row items-start md:justify-between gap-4">
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
                  <button
                    onClick={() => setShowTripDrawer(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white/70 transition-all shrink-0"
                  >
                    <Settings className="w-3 h-3" /> MODIFICAR
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <TravelpayoutsWidget />
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-20">
                <TripContextPanel {...tripContextProps} onNext={() => navigate('/experiencias')} nextLabel="PROSSEGUIR PARA EXPERIÊNCIAS" currentStep={2} />
              </div>
            </div>
          </div>
        </div>

        <ZoeMiniChat context="hoteis" destination={tripContextProps.destination.name} />
        <TripEditDrawer open={showTripDrawer} onClose={() => setShowTripDrawer(false)} />
      </motion.div>
    </PaywallGate>
  );
}
