import { motion } from 'motion/react';
import { ShieldCheck, CreditCard, ChevronRight, ArrowLeft, Calendar, MapPin, Plane, Hotel, Star, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Flight, Hotel as HotelType, Experience } from '../../types';
import { IMAGES } from '../../constants';
import { useAppContext } from '../../App';
import ZoeMiniChat from '../../components/ZoeMiniChat';

/**
 * ===================================================
 *  PÁGINA DE CHECKOUT (CheckoutPage)
 *  URL: /checkout
 *
 *  Tela de finalização da reserva. Mostra resumo
 *  do voo, hotel e experiência selecionados.
 * ===================================================
 */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { selectedFlight: flight, selectedHotel: hotel, selectedExperience: experience } = useAppContext();
  const total = (flight?.price || 0) + (hotel?.price || 0) + (experience?.price || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-20 px-6 max-w-6xl mx-auto w-full"
    >
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate('/experiencias')} className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </button>
        <div>
          <h2 className="text-4xl font-bold tracking-tight font-display text-crisp">Finalizar Reserva</h2>
          <p className="text-white/50 text-sm font-light tracking-wide">Revise e acesse os links diretos para a sua jornada</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Summary Cards */}
          <div className="glass-card rounded-[32px] p-8 relative overflow-hidden">
            <div className="high-fidelity-texture" />
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Itinerário Selecionado
            </h3>

            <div className="space-y-8">
              {/* Flight */}
              {flight && (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-[24px] bg-white/5 border border-white/5 group hover:border-emerald-500/20 transition-all">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    <Plane className="w-8 h-8 text-emerald-400/50" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-white text-lg">{flight.airline}</h4>
                        <p className="text-emerald-400/60 text-[10px] font-bold uppercase tracking-widest">Business Class • {flight.number}</p>
                      </div>
                      <span className="text-white font-bold text-lg">R$ {flight.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-white font-bold text-sm">{flight.departureTime}</p>
                        <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">GRU</p>
                      </div>
                      <div className="flex-grow h-[1px] bg-white/10 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold text-sm">{flight.arrivalTime}</p>
                        <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">CDG</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hotel */}
              {hotel && (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-[24px] bg-white/5 border border-white/5 group hover:border-emerald-500/20 transition-all">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-white text-lg">{hotel.name}</h4>
                        <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                          <MapPin className="w-3 h-3" />
                          {hotel.location}
                        </div>
                      </div>
                      <span className="text-white font-bold text-lg">R$ {hotel.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      {[...Array(hotel.rating)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Experience */}
              {experience && (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-[24px] bg-white/5 border border-white/5 group hover:border-emerald-500/20 transition-all">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                    <img src={experience.image} alt={experience.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-white text-lg">{experience.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            {experience.duration}
                          </div>
                          <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {experience.rating}
                          </div>
                        </div>
                      </div>
                      <span className="text-white font-bold text-lg">R$ {experience.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* External Booking notice */}
          <div className="glass-card rounded-[32px] p-8 relative overflow-hidden">
            <div className="high-fidelity-texture" />
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Reserva de Parceiros
            </h3>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col gap-4">
              <p className="text-white/70 text-sm leading-relaxed">
                As reservas de aéreos e hotéis são feitas diretamente e de forma segura nos sites de nossos parceiros selecionados através de links de afiliação.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mt-2">
                <CheckCircle2 className="w-4 h-4" />
                Redirecionamento Seguro e Confiável
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-8">
          <div className="glass-card rounded-[32px] p-8 relative overflow-hidden sticky top-32">
            <div className="high-fidelity-texture" />
            <h3 className="text-xl font-bold text-white mb-8">Resumo do Investimento</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Subtotal</span>
                <span className="text-white">R$ {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Taxas de Concierge</span>
                <span className="text-emerald-400 font-bold tracking-widest uppercase text-[10px]">Incluso (Voyax Black)</span>
              </div>
              <div className="h-[1px] w-full bg-white/10 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-white font-bold">Total</span>
                <span className="text-3xl font-bold text-white tracking-tighter">R$ {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/minhas-viagens')}
              className="w-full bg-white text-[#0f172a] py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl flex items-center justify-center gap-3 group"
            >
              Continuar e Ver Minhas Viagens
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <p className="text-[10px] text-white/40 leading-relaxed">
                Sua reserva está protegida pelo Seguro Voyax Global. Cancelamento gratuito até 48h antes.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ZoeMiniChat context="checkout" />
    </motion.div>
  );
}
