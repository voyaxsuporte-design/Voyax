import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
    Sparkles, Mic, Send, Wallet, Plane, History,
    Globe, Brain, Star, Clock, Zap, Shield,
    MessageSquare, MapPin, CheckCircle, ArrowRight, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../../constants';
import { useAppContext } from '../../App';

/**
 * ===================================================
 *  PÁGINA INICIAL (Home) — VOYAX PREMIUM
 *  URL: /
 *
 *  Seções:
 *  0 — Hero: Zoe + barra de busca
 *  1 — O que é a Zoe
 *  2 — Como funciona
 *  3 — Benefícios
 *  4 — CTA final
 * ===================================================
 */

/** Hook para animar seções ao entrar na tela */
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.section>
    );
}

export default function HomePage() {
    const navigate = useNavigate();
    const { searchQuery, setSearchQuery } = useAppContext();

    return (
        <div className="relative">

            {/* ═══════════════════════════════════════════
          HERO — Entrada premium com a Zoe
          ═══════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-32 relative"
            >
                {/* Indicador de scroll */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20 cursor-pointer"
                    onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Explorar</span>
                    <ChevronDown className="w-4 h-4" />
                </motion.div>



                {/* Avatar da Zoe */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
                    className="mb-10 relative"
                >
                    <motion.div
                        onClick={() => navigate('/chat')}
                        animate={{
                            boxShadow: [
                                '0 0 0px rgba(16,185,129,0)',
                                '0 0 60px rgba(16,185,129,0.2)',
                                '0 0 0px rgba(16,185,129,0)',
                            ]
                        }}
                        transition={{ duration: 3.5, repeat: Infinity }}
                        className="w-32 h-32 md:w-44 md:h-44 rounded-full border border-white/15 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.7)] relative group cursor-pointer"
                    >
                        <img
                            src={IMAGES.zoeAvatar}
                            alt="Zoe — Concierge Voyax"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </motion.div>
                    {/* Status online */}
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a1628]/80 border border-emerald-500/20 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 text-[8px] font-bold uppercase tracking-widest">Online</span>
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mb-14"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight" style={{ letterSpacing: '-0.045em' }}>
                        Olá, eu sou a{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            Zoe
                        </span>
                    </h1>
                    <p className="text-white/40 text-base md:text-lg font-light text-center max-w-lg leading-relaxed tracking-tight">
                        Sua concierge digital para viagens de alto padrão.<br className="hidden md:block" />
                        Planejamento inteligente. Experiências únicas.
                    </p>
                </motion.div>

                {/* Input de busca premium */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full max-w-xl px-4"
                >
                    <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex items-center shadow-[0_20px_80px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-300">
                        <div className="flex items-center pl-5 gap-3 flex-grow">
                            <Sparkles className="text-emerald-400/50 w-4 h-4 shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && navigate('/chat')}
                                className="bg-transparent border-none outline-none text-white placeholder-white/20 text-sm w-full font-light tracking-tight py-3.5"
                                placeholder="Para onde você quer ir?"
                            />
                        </div>
                        <div className="flex items-center gap-1.5 pr-1.5">
                            <button className="p-2.5 text-white/20 hover:text-white/60 transition-colors rounded-xl hover:bg-white/5">
                                <Mic className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigate('/chat')}
                                className="group/send relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_36px_rgba(16,185,129,0.55)] hover:from-emerald-400 hover:to-teal-400 hover:scale-[1.03] active:scale-100 transition-all duration-300 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover/send:opacity-100 transition-opacity duration-500" />
                                ENVIAR <Send className="w-3.5 h-3.5 group-hover/send:translate-x-0.5 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>

                    {/* Sugestões rápidas */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {[
                            { label: 'Ver meu orçamento', icon: Wallet },
                            { label: 'Próxima viagem: Paris', icon: Plane },
                            { label: 'Histórico recente', icon: History },
                        ].map((item) => (
                            <button
                                key={item.label}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/[0.07] bg-white/[0.02] text-white/30 text-[9px] font-bold uppercase tracking-widest hover:bg-white/[0.06] hover:text-white/60 transition-all"
                            >
                                <item.icon className="w-3 h-3" /> {item.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {['ROTEIRO GASTRONÔMICO', 'GESTÃO FINANCEIRA', 'DESTINOS DE INVERNO'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => { setSearchQuery(tag); navigate('/chat'); }}
                                className="px-4 py-2 rounded-full border border-white/[0.07] bg-white/[0.02] text-white/25 text-[9px] font-bold uppercase tracking-widest hover:bg-white/[0.06] hover:text-white/60 transition-all"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* ═══════════════════════════════════════════
          SEÇÃO 1 — O que é a Zoe
          ═══════════════════════════════════════════ */}
            <Section className="px-6 py-28 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-6">
                        <Brain className="w-3 h-3 text-emerald-400" />
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Inteligência Contextual</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
                        Conheça a{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            Zoe
                        </span>
                    </h2>
                    <p className="text-white/40 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        A Zoe é a assistente de concierge mais sofisticada do mercado de viagens.
                        Treinada para entender seu perfil, seus gostos e suas expectativas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        {
                            icon: Globe,
                            title: 'Presença Global',
                            text: 'Conhecimento profundo de 150+ destinos, com curadoria local e acesso a fornecedores exclusivos em toda a Europa, Ásia e Américas.',
                        },
                        {
                            icon: Brain,
                            title: 'Planejamento Inteligente',
                            text: 'A Zoe aprende com cada conversa. Quanto mais você usa, mais precisa e personalizada ela fica para o seu perfil de viagens.',
                        },
                        {
                            icon: Star,
                            title: 'Experiências Únicas',
                            text: 'Tours privados, jantares exclusivos, upgrades silenciosos — a Zoe acessa um catálogo que agências convencionais não alcançam.',
                        },
                    ].map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, duration: 0.6 }}
                            className="group bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                                <card.icon className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-white font-semibold text-base mb-2">{card.title}</h3>
                            <p className="text-white/35 text-sm leading-relaxed">{card.text}</p>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Divider */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="border-t border-white/[0.06]" />
            </div>

            {/* ═══════════════════════════════════════════
          SEÇÃO 2 — Como funciona
          ═══════════════════════════════════════════ */}
            <Section className="px-6 py-28 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-6">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Processo Simplificado</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
                        Como funciona
                    </h2>
                    <p className="text-white/40 text-base max-w-xl mx-auto leading-relaxed">
                        De uma simples conversa a uma viagem completa em minutos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Linha conectora (desktop) */}
                    <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                    {[
                        {
                            step: '01',
                            icon: MessageSquare,
                            title: 'Você conversa',
                            text: 'Conte para a Zoe o destino dos seus sonhos, datas, preferências e orçamento. Pode ser curto ou detalhado — ela entende os dois.',
                        },
                        {
                            step: '02',
                            icon: Brain,
                            title: 'Zoe monta sua viagem',
                            text: 'Em segundos, a Zoe seleciona os melhores voos, hotéis cinco estrelas e experiências exclusivas alinhadas ao seu perfil.',
                        },
                        {
                            step: '03',
                            icon: MapPin,
                            title: 'Você viaja com estilo',
                            text: 'Aprovado o roteiro, tudo fica organizado na sua conta Voyax. Acompanhe, ajuste e parta com tudo resolvido.',
                        },
                    ].map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.6 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-6 relative">
                                <step.icon className="w-6 h-6 text-white/50" />
                                <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                    <span className="text-emerald-400 text-[8px] font-black">{step.step}</span>
                                </div>
                            </div>
                            <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-xs">{step.text}</p>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Divider */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="border-t border-white/[0.06]" />
            </div>

            {/* ═══════════════════════════════════════════
          SEÇÃO 3 — Benefícios
          ═══════════════════════════════════════════ */}
            <Section className="px-6 py-28 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-6">
                            <Shield className="w-3 h-3 text-emerald-400" />
                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Por que Voyax</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
                            Benefícios que fazem a diferença
                        </h2>
                        <p className="text-white/40 text-base leading-relaxed">
                            A Voyax não é uma OTA. É um serviço de concierge digital construído para quem valoriza tempo, privacidade e padrão de excelência.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {[
                            {
                                icon: Clock,
                                title: 'Economia de tempo',
                                text: 'O que levaria horas de pesquisa, a Zoe resolve em minutos. Você foca no que importa.',
                            },
                            {
                                icon: Star,
                                title: 'Curadoria premium',
                                text: 'Apenas o melhor. A Zoe filtra e apresenta opções que combinam com seu padrão Voyax Black.',
                            },
                            {
                                icon: Brain,
                                title: 'Inteligência contextual',
                                text: 'A Zoe lembra seu histórico, suas preferências e seu estilo — cada viagem fica mais personalizada.',
                            },
                            {
                                icon: Shield,
                                title: 'Privacidade total',
                                text: 'Seus dados são seus. A Voyax não compartilha informações com terceiros ou parceiros de anúncios.',
                            },
                        ].map((benefit, i) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="flex items-start gap-4 p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all"
                            >
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                    <benefit.icon className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold text-sm mb-1">{benefit.title}</h4>
                                    <p className="text-white/35 text-sm leading-relaxed">{benefit.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Divider */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="border-t border-white/[0.06]" />
            </div>

            {/* ═══════════════════════════════════════════
          SEÇÃO 4 — CTA Final
          ═══════════════════════════════════════════ */}
            <Section className="px-6 py-28">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Cards de destinos flutuantes */}
                    <div className="flex justify-center gap-3 mb-12 flex-wrap">
                        {[
                            { city: 'Paris', temp: '14°C', img: IMAGES.parisHero },
                            { city: 'Maldivas', temp: '30°C', img: IMAGES.maldives },
                            { city: 'Tóquio', temp: '22°C', img: IMAGES.destinationTokyo },
                        ].map((dest, i) => (
                            <motion.div
                                key={dest.city}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative w-24 h-32 rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                            >
                                <img src={dest.img} alt={dest.city} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-2 left-0 right-0 text-center">
                                    <p className="text-white text-[10px] font-bold">{dest.city}</p>
                                    <p className="text-white/50 text-[9px]">{dest.temp}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-6">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Pronto para começar</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
                        Sua próxima viagem começa<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            com uma conversa
                        </span>
                    </h2>

                    <p className="text-white/40 text-base leading-relaxed mb-10 max-w-lg mx-auto">
                        A Zoe está pronta para montar a experiência perfeita para você.
                        Diga onde quer ir — o resto é com ela.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate('/chat')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-[0.15em] hover:from-emerald-400 hover:to-teal-400 transition-all shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.4)]"
                        >
                            Começar com a Zoe <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigate('/minhas-viagens')}
                            className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/10 text-white/70 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-[0.15em] hover:bg-white/[0.08] hover:text-white transition-all"
                        >
                            Ver minhas viagens
                        </button>
                    </div>

                    {/* Métricas de confiança */}
                    <div className="mt-14 pt-10 border-t border-white/[0.06] grid grid-cols-3 gap-6">
                        {[
                            { value: '2.4M+', label: 'Milhas gerenciadas' },
                            { value: '150+', label: 'Destinos curados' },
                            { value: '99.9%', label: 'Uptime da Zoe' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-white/30 text-xs uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

        </div>
    );
}
