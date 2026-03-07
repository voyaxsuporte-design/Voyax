import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { IMAGES, DESTINATIONS, Destination } from './constants';
import Navbar from './components/layout/Navbar';
import StepNavbar from './components/layout/StepNavbar';
import Footer from './components/layout/Footer';
import CalendarPriceModal from './components/modals/CalendarPriceModal';
import BudgetPlannerModal, { BudgetData } from './components/modals/BudgetPlannerModal';
import { ProfileModals } from './components/ProfileMenu';
import { Flight, Hotel, Experience } from './types';

/**
 * ===================================================
 *  CONTEXTO GLOBAL DA VIAGEM (TripContext)
 *
 *  Este contexto compartilha dados da viagem entre
 *  todas as páginas: destino, datas, orçamento,
 *  voo selecionado, hotel selecionado, etc.
 * ===================================================
 */
export interface TripContextSharedProps {
  onOpenCalendar: () => void;
  onOpenBudget: () => void;
  budgetData: BudgetData | null;
  destination: Destination;
  onChangeDestination: (dest: Destination) => void;
  tripDates: { departure: string; return: string };
  currentStep?: number;
  selectedFlightPrice?: number;
}

export type UserPlan = 'free' | 'trial' | 'premium';

interface AppContextType {
  tripContextProps: TripContextSharedProps;
  selectedFlight: Flight | null;
  setSelectedFlight: (f: Flight | null) => void;
  selectedHotel: Hotel | null;
  setSelectedHotel: (h: Hotel | null) => void;
  selectedExperience: Experience | null;
  setSelectedExperience: (e: Experience | null) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  /** Plano do usuário: free | trial | premium */
  userPlan: UserPlan;
  setUserPlan: (p: UserPlan) => void;
  travelers: number;
  setTravelers: (n: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

/**
 * Hook para acessar o contexto global em qualquer página.
 * Exemplo de uso: const { tripContextProps } = useAppContext();
 */
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside App');
  return ctx;
}

/**
 * ===================================================
 *  APP — LAYOUT PRINCIPAL
 *
 *  Este componente é o "wrapper" de todas as páginas.
 *  Ele renderiza:
 *   - Fundo de oceano (global)
 *   - Navbar ou StepNavbar (dependendo da rota)
 *   - <Outlet /> = a página atual (definida em routes.tsx)
 *   - Footer
 *   - Modais (calendário, orçamento, perfil)
 * ===================================================
 */
const BOOKING_PATHS = ['/passagens', '/hospedagem', '/experiencias', '/checkout'];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // State global
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [travelers, setTravelers] = useState(2);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBudgetPlanner, setShowBudgetPlanner] = useState(false);
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [destination, setDestination] = useState<Destination>(DESTINATIONS[0]);
  const [tripDates, setTripDates] = useState({ departure: '12 MAI 2024', return: '24 MAI 2024' });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeProfileModal, setActiveProfileModal] = useState<string | null>(null);

  // When destination changes, reset all selections that depend on it
  const handleChangeDestination = (dest: Destination) => {
    if (dest.name !== destination.name) {
      setSelectedFlight(null);
      setSelectedHotel(null);
      setSelectedExperience(null);
    }
    setDestination(dest);
  };

  const handleBudgetConfirm = (data: BudgetData) => { setBudgetData(data); setShowBudgetPlanner(false); };
  const handleDatesConfirm = (start: string, end: string) => { setTripDates({ departure: start, return: end }); setShowCalendar(false); };

  const isBookingFlow = BOOKING_PATHS.includes(location.pathname);
  const currentStepIndex = BOOKING_PATHS.indexOf(location.pathname) + 1;

  const tripContextProps: TripContextSharedProps = {
    onOpenCalendar: () => setShowCalendar(true),
    onOpenBudget: () => setShowBudgetPlanner(true),
    budgetData,
    destination,
    onChangeDestination: handleChangeDestination,
    tripDates,
    currentStep: currentStepIndex || 1,
    selectedFlightPrice: selectedFlight?.price || 0,
  };

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <AppContext.Provider value={{
      tripContextProps,
      selectedFlight, setSelectedFlight,
      selectedHotel, setSelectedHotel,
      selectedExperience, setSelectedExperience,
      searchQuery, setSearchQuery,
      travelers, setTravelers,
      userPlan, setUserPlan,
    }}>
      <div className="min-h-screen text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-200 chat-scroll relative">
        {/* Fundo de mar premium (aparece em TODAS as telas) */}
        <div className="fixed inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=90"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          {/* overlay escuro para leitura perfeita do texto */}
          <div className="absolute inset-0 bg-[#050d1a]/85" />
          {/* gradiente sutil de profundidade */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/40 via-transparent to-[#050d1a]/60" />
        </div>
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none z-[200]" />

        <div className="relative z-10 pb-10">
          {/* Navbar muda dependendo da rota */}
          {isBookingFlow ? (
            <StepNavbar
              showProfileMenu={showProfileMenu}
              setShowProfileMenu={setShowProfileMenu}
              onOpenModal={(type) => setActiveProfileModal(type)}
            />
          ) : (
            <Navbar
              showProfileMenu={showProfileMenu}
              setShowProfileMenu={setShowProfileMenu}
              onOpenModal={(type) => setActiveProfileModal(type)}
            />
          )}

          {/* Página atual (definida em routes.tsx) */}
          <Outlet />
        </div>

        <Footer />

        {/* Modais globais */}
        <AnimatePresence>
          {showCalendar && <CalendarPriceModal onClose={() => setShowCalendar(false)} onConfirm={handleDatesConfirm} />}
          {showBudgetPlanner && <BudgetPlannerModal onClose={() => setShowBudgetPlanner(false)} onConfirm={handleBudgetConfirm} initialData={budgetData ?? undefined} />}
          {activeProfileModal && <ProfileModals type={activeProfileModal} onClose={() => setActiveProfileModal(null)} />}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}
