import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    LogIn, Plus, Crown, HelpCircle, MessageSquare,
    FileText, User, X, Mail, Shield,
    ChevronRight, Sparkles, Bell, Globe, Lock,
    Trash2, Key, Plane, Hotel, Compass, Check,
    ChevronDown, Zap, Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants';

interface ProfileMenuProps {
    onClose: () => void;
    onOpenModal: (type: string) => void;
}

function SectionLabel({ label }: { label: string }) {
    return (
        <p className="px-5 pt-4 pb-1 text-[8px] font-black uppercase tracking-[0.22em] text-white/22 select-none">
            {label}
        </p>
    );
}

function MenuItem({
    icon: Icon, label, sublabel, onClick,
    highlight = false, accent = false, chevron = false,
}: {
    icon: React.ElementType; label: string; sublabel?: string;
    onClick: () => void; highlight?: boolean; accent?: boolean; chevron?: boolean;
}) {
    if (highlight) {
        return (
            <div className="px-3 pb-1">
                <button
                    onClick={onClick}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 hover:bg-emerald-500/25 hover:border-emerald-500/40 transition-all group text-left"
                >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-emerald-400 text-[11px] font-black uppercase tracking-wider">{label}</p>
                        {sublabel && <p className="text-emerald-400/50 text-[9px] font-medium mt-0.5">{sublabel}</p>}
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" />
                </button>
            </div>
        );
    }
    return (
        <button
            onClick={onClick}
            className="w-full px-5 py-2.5 flex items-center gap-3.5 hover:bg-white/[0.04] transition-colors group text-left rounded-xl mx-1 w-[calc(100%-8px)]"
        >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:bg-white/10 ${accent ? 'bg-amber-400/10' : 'bg-white/[0.04]'}`}>
                <Icon className={`w-3.5 h-3.5 ${accent ? 'text-amber-400' : 'text-white/40 group-hover:text-white/80'} transition-colors`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-none ${accent ? 'text-amber-400' : 'text-white/65 group-hover:text-white'} transition-colors`}>{label}</p>
            </div>
            {chevron && <ChevronRight className="w-3 h-3 text-white/15 group-hover:text-white/40 transition-colors shrink-0" />}
        </button>
    );
}

function Divider() {
    return <div className="mx-5 my-1 border-t border-white/[0.06]" />;
}

export default function ProfileMenu({ onClose, onOpenModal }: ProfileMenuProps) {
    const navigate = useNavigate();
    const go = (path: string) => { navigate(path); onClose(); };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-3 w-72 bg-[#0c1525]/97 backdrop-blur-xl border border-white/10 rounded-[26px] shadow-[0_32px_72px_rgba(0,0,0,0.65)] z-[200] flex flex-col"
            style={{ maxHeight: 'calc(100vh - 90px)' }}
        >
            {/* ── User header (pinned) ── */}
            <div className="p-4 border-b border-white/[0.07] shrink-0">
                <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-[14px] overflow-hidden border border-white/10">
                            <img src={IMAGES.userAvatar} alt="Perfil" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0c1525]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm leading-none mb-1.5">Gabriel Oliveira</p>
                        <div className="flex items-center gap-1.5">
                            <Crown className="w-2.5 h-2.5 text-amber-400" />
                            <span className="text-amber-400 text-[9px] font-black uppercase tracking-widest">Membro Black</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onOpenModal('profile')}
                    className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/8 text-white/45 text-[9px] font-black uppercase tracking-[0.18em] hover:bg-white/[0.08] hover:text-white/70 hover:border-white/15 transition-all"
                >
                    Editar Perfil
                </button>
            </div>

            {/* ── Scrollable items ── */}
            <div className="flex-1 min-h-0 py-2" style={{ overflowY: 'auto' }}>

                {/* Sua Experiência */}
                <SectionLabel label="Sua Experiência" />
                <div className="px-2 space-y-0.5">
                    <MenuItem icon={Plus} label="Iniciar Nova Viagem" sublabel="Converse com a Zoe agora" onClick={() => go('/chat')} highlight />
                </div>
                <div className="px-2 mt-1 space-y-0.5">
                    <MenuItem icon={Compass} label="Minhas Viagens" onClick={() => go('/minhas-viagens')} chevron />
                </div>

                <Divider />

                {/* Conta */}
                <SectionLabel label="Conta" />
                <div className="px-2 space-y-0.5">
                    <MenuItem icon={Crown} label="Plano & Assinatura" onClick={() => onOpenModal('billing')} accent chevron />
                </div>

                <Divider />

                {/* Voyax */}
                <SectionLabel label="Voyax" />
                <div className="px-2 space-y-0.5">
                    <MenuItem icon={HelpCircle} label="Sobre a Voyax" onClick={() => onOpenModal('about')} />
                    <MenuItem icon={MessageSquare} label="Contato" onClick={() => onOpenModal('contact')} />
                    <MenuItem icon={FileText} label="Termos de Serviço" onClick={() => onOpenModal('terms')} />
                </div>

                {/* Sign out */}
                <div className="px-4 py-3 mt-1 border-t border-white/[0.06]">
                    <button
                        onClick={onClose}
                        className="w-full flex items-center gap-2 text-white/25 text-[10px] font-bold uppercase tracking-wide hover:text-white/50 transition-colors"
                    >
                        <LogIn className="w-3.5 h-3.5" /> Sair da conta
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────
// PROFILE MODALS
// ─────────────────────────────────────────────────────────────────

// ── Toggle ────────────────────────────────────────────────────────
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-10 h-5.5 rounded-full border transition-all shrink-0 ${enabled ? 'bg-emerald-500 border-emerald-400' : 'bg-white/10 border-white/15'}`}
            style={{ height: 22, width: 40 }}
        >
            <motion.div
                animate={{ x: enabled ? 18 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm"
                style={{ width: 18, height: 18 }}
            />
        </button>
    );
}

// ── Editar Perfil — Full Hub ───────────────────────────────────────
type ProfileTab = 'dados' | 'viagem' | 'idioma' | 'notificacoes' | 'privacidade' | 'conta';

function ProfileHub({ onClose }: { onClose: () => void }) {
    const [tab, setTab] = useState<ProfileTab>('dados');

    // Notification states
    const [notifPromocoes, setNotifPromocoes] = useState(true);
    const [notifViagens, setNotifViagens] = useState(true);
    const [notifZoe, setNotifZoe] = useState(true);
    const [notifEmail, setNotifEmail] = useState(false);

    // Privacy states
    const [privDados, setPrivDados] = useState(false);
    const [privAnalytics, setPrivAnalytics] = useState(true);

    // Travel prefs
    const [travelClass, setTravelClass] = useState('business');
    const [interests, setInterests] = useState<string[]>(['Cultura', 'Gastronomia']);
    const [lang, setLang] = useState('pt');

    const tabs: { key: ProfileTab; label: string; icon: React.ElementType }[] = [
        { key: 'dados', label: 'Dados Pessoais', icon: User },
        { key: 'viagem', label: 'Preferências', icon: Plane },
        { key: 'idioma', label: 'Idioma', icon: Globe },
        { key: 'notificacoes', label: 'Notificações', icon: Bell },
        { key: 'privacidade', label: 'Privacidade', icon: Lock },
        { key: 'conta', label: 'Conta', icon: Shield },
    ];

    const interestOptions = ['Cultura', 'Gastronomia', 'Aventura', 'Relaxamento', 'Compras', 'Natureza', 'Histórico', 'Festas'];

    const toggleInterest = (i: string) =>
        setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

    return (
        <div className="flex gap-0 h-full" style={{ minHeight: 520 }}>
            {/* Sidebar tabs */}
            <div className="w-48 shrink-0 border-r border-white/[0.06] py-2 pr-2">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all mb-0.5 ${tab === t.key ? 'bg-white/[0.07] text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'}`}
                    >
                        <t.icon className={`w-4 h-4 shrink-0 ${tab === t.key ? 'text-emerald-400' : 'text-white/30'}`} />
                        <span className="text-xs font-medium">{t.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 pl-6 overflow-y-auto" style={{ maxHeight: 520 }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.18 }}
                    >

                        {/* ── DADOS PESSOAIS ── */}
                        {tab === 'dados' && (
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/40">
                                        <img src={IMAGES.userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <button className="text-emerald-400 text-[10px] font-black uppercase tracking-widest block">Alterar Foto</button>
                                        <p className="text-white/30 text-[9px] mt-1">JPG ou PNG, máx. 5MB</p>
                                    </div>
                                </div>
                                <Field label="Nome Completo" defaultValue="Gabriel S. Oliveira" />
                                <Field label="E-mail" type="email" defaultValue="gabriel.oliveira@voyax.com" />
                                <Field label="Telefone" type="tel" defaultValue="+55 11 99876-5432" />
                                <Field label="Data de Nascimento" type="date" defaultValue="1990-03-15" />
                                <Field label="Cidade / País" defaultValue="São Paulo, Brasil" />
                            </div>
                        )}

                        {/* ── PREFERÊNCIAS DE VIAGEM ── */}
                        {tab === 'viagem' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 block">Classe preferida</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['economy', 'premium_economy', 'business', 'first'].map(cls => (
                                            <button
                                                key={cls}
                                                onClick={() => setTravelClass(cls)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all capitalize ${travelClass === cls ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'}`}
                                            >
                                                {cls === 'premium_economy' ? 'Premium Economy' : cls.charAt(0).toUpperCase() + cls.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 block">Interesses</label>
                                    <div className="flex flex-wrap gap-2">
                                        {interestOptions.map(i => (
                                            <button
                                                key={i}
                                                onClick={() => toggleInterest(i)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${interests.includes(i) ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'}`}
                                            >
                                                {i}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 block">Tipo de hospedagem</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['Boutique Hotel', 'Resort', 'Airbnb', 'Hostel'].map(h => (
                                            <button key={h} className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-white/5 border-white/10 text-white/40 hover:text-white/70 transition-all">{h}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 block">Destino dos sonhos</label>
                                    <Field label="" defaultValue="Japão, Maldivas, Islândia" />
                                </div>
                            </div>
                        )}

                        {/* ── IDIOMA ── */}
                        {tab === 'idioma' && (
                            <div className="space-y-3">
                                <p className="text-white/40 text-xs font-light mb-4">Selecione o idioma da interface</p>
                                {[
                                    { code: 'pt', flag: '🇧🇷', name: 'Português (Brasil)' },
                                    { code: 'en', flag: '🇺🇸', name: 'English (US)' },
                                    { code: 'es', flag: '🇪🇸', name: 'Español' },
                                    { code: 'fr', flag: '🇫🇷', name: 'Français' },
                                    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
                                ].map(l => (
                                    <button
                                        key={l.code}
                                        onClick={() => setLang(l.code)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${lang === l.code ? 'bg-emerald-500/10 border-emerald-500/30 text-white' : 'bg-white/[0.03] border-white/8 text-white/55 hover:bg-white/[0.06]'}`}
                                    >
                                        <span className="text-xl">{l.flag}</span>
                                        <span className="text-sm font-medium flex-1 text-left">{l.name}</span>
                                        {lang === l.code && <Check className="w-4 h-4 text-emerald-400" />}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ── NOTIFICAÇÕES ── */}
                        {tab === 'notificacoes' && (
                            <div className="space-y-1">
                                <p className="text-white/40 text-xs font-light mb-4">Gerencie como a Voyax se comunica com você</p>
                                <NotifRow label="Promoções e ofertas" sub="Descontos exclusivos de voos e hotéis" enabled={notifPromocoes} onChange={setNotifPromocoes} />
                                <NotifRow label="Atualizações de viagem" sub="Check-in, embarque e mudanças de itinerário" enabled={notifViagens} onChange={setNotifViagens} />
                                <NotifRow label="Insights da Zoe" sub="Sugestões personalizadas de destinos" enabled={notifZoe} onChange={setNotifZoe} />
                                <NotifRow label="Newsletter por e-mail" sub="Novidades e tendências de viagem" enabled={notifEmail} onChange={setNotifEmail} />
                            </div>
                        )}

                        {/* ── PRIVACIDADE ── */}
                        {tab === 'privacidade' && (
                            <div className="space-y-1">
                                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 mb-4 flex gap-3">
                                    <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <p className="text-emerald-400/80 text-xs leading-relaxed">Seus dados são protegidos com criptografia de nível bancário e estamos em conformidade com a LGPD.</p>
                                </div>
                                <NotifRow label="Compartilhar dados anonimizados" sub="Ajuda a melhorar as recomendações da Zoe" enabled={privAnalytics} onChange={setPrivAnalytics} />
                                <NotifRow label="Perfil visível para conciergerie" sub="Permite personalização avançada no atendimento" enabled={privDados} onChange={setPrivDados} />
                                <div className="pt-4">
                                    <button className="text-white/30 text-xs underline hover:text-white/60 transition-colors">Baixar meus dados</button>
                                </div>
                            </div>
                        )}

                        {/* ── CONTA ── */}
                        {tab === 'conta' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8 space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Segurança</p>
                                    <button className="w-full flex items-center gap-3 py-2 text-white/60 hover:text-white text-sm transition-colors group">
                                        <Key className="w-4 h-4 text-white/30 group-hover:text-emerald-400 transition-colors" />
                                        Alterar Senha
                                        <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/20" />
                                    </button>
                                    <div className="border-t border-white/[0.06]" />
                                    <button className="w-full flex items-center gap-3 py-2 text-white/60 hover:text-white text-sm transition-colors group">
                                        <Shield className="w-4 h-4 text-white/30 group-hover:text-emerald-400 transition-colors" />
                                        Autenticação em 2 Fatores
                                        <span className="ml-auto text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-400/15 text-amber-400">Em breve</span>
                                    </button>
                                </div>
                                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-400/60">Zona de risco</p>
                                    <button className="w-full flex items-center gap-3 py-2 text-rose-400/60 hover:text-rose-400 text-sm transition-colors group">
                                        <Trash2 className="w-4 h-4" />
                                        Excluir Conta
                                        <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                                    </button>
                                </div>
                                <div className="pt-2">
                                    <p className="text-white/20 text-[9px]">Membro desde Janeiro 2024 · v2.8.4</p>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// Helpers
function Field({ label, type = 'text', defaultValue }: { label: string; type?: string; defaultValue?: string }) {
    return (
        <div className="space-y-1.5">
            {label && <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</label>}
            <input
                type={type}
                defaultValue={defaultValue}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors"
            />
        </div>
    );
}

function NotifRow({ label, sub, enabled, onChange }: {
    label: string; sub: string; enabled: boolean; onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between py-3.5 border-b border-white/[0.05] last:border-0 gap-4">
            <div>
                <p className="text-white/75 text-sm font-medium leading-none mb-1">{label}</p>
                <p className="text-white/35 text-xs">{sub}</p>
            </div>
            <Toggle enabled={enabled} onChange={onChange} />
        </div>
    );
}

// ── Plano & Assinatura ─────────────────────────────────────────────
type PlanStatus = 'free' | 'premium' | 'expired';

function BillingHub() {
    // Simulated state — change to test different views
    const [status] = useState<PlanStatus>('premium');

    const benefits = [
        { icon: Zap, label: 'Zoe sem limites', sub: 'Conversas ilimitadas com a IA' },
        { icon: Plane, label: 'Passagens Aéreas', sub: 'Acesso às opções de voos selecionados' },
        { icon: Hotel, label: 'Hotéis Premium', sub: 'Acesso à curadoria exclusiva' },
        { icon: Compass, label: 'Experiências', sub: 'Acesso a roteiros e passeios únicos' },
    ];

    const statusConfig = {
        free: {
            badge: 'Plano Gratuito',
            badgeColor: 'bg-white/10 text-white/50 border-white/15',
            msg: 'Você está no plano gratuito com acesso limitado.',
            cta: 'Fazer Upgrade para Black',
            ctaColor: 'bg-emerald-500 hover:bg-emerald-400 text-[#0f172a]',
        },
        premium: {
            badge: 'Voyax Black Ativo',
            badgeColor: 'bg-amber-400/15 text-amber-400 border-amber-400/25',
            msg: 'Renovação automática em 15 de Março de 2026.',
            cta: 'Gerenciar Assinatura',
            ctaColor: 'bg-white/10 hover:bg-white/15 text-white/70 border border-white/15',
        },
        expired: {
            badge: 'Assinatura Expirada',
            badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
            msg: 'Sua assinatura expirou em 01 de Fevereiro de 2026. Renove para recuperar acesso.',
            cta: 'Renovar Agora',
            ctaColor: 'bg-emerald-500 hover:bg-emerald-400 text-[#0f172a]',
        },
    };

    const cfg = statusConfig[status];

    const compare = [
        { feature: 'Planejamento Inicial', free: '✓ Sim', premium: '✓ Sim' },
        { feature: 'Chat com Zoe', free: 'Bloqueado', premium: '✓ Ilimitado' },
        { feature: 'Reserva de Voos', free: 'Bloqueado', premium: '✓ Acesso completo' },
        { feature: 'Seleção de Hotéis', free: 'Bloqueado', premium: '✓ Acesso completo' },
        { feature: 'Experiências', free: 'Bloqueado', premium: '✓ Acesso completo' },
    ];

    return (
        <div className="space-y-6">
            {/* Status card */}
            <div className={`p-5 rounded-2xl border ${status === 'premium' ? 'bg-gradient-to-br from-amber-400/10 to-transparent border-amber-400/20' : status === 'expired' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.badgeColor}`}>
                            {cfg.badge}
                        </span>
                        <p className="text-white/50 text-xs mt-2 font-light">{cfg.msg}</p>
                    </div>
                    <Crown className={`w-7 h-7 ${status === 'premium' ? 'text-amber-400' : status === 'expired' ? 'text-rose-400/40' : 'text-white/20'}`} />
                </div>
                {status === 'premium' && (
                    <div className="flex gap-4 mt-3 pt-3 border-t border-amber-400/10">
                        <div>
                            <p className="text-white/30 text-[9px] uppercase tracking-widest">Plano</p>
                            <p className="text-white font-bold text-sm">Vip Infinity</p>
                        </div>
                        <div>
                            <p className="text-white/30 text-[9px] uppercase tracking-widest">Desde</p>
                            <p className="text-white font-bold text-sm">Jan 2024</p>
                        </div>
                        <div>
                            <p className="text-white/30 text-[9px] uppercase tracking-widest">Próxima cobrança</p>
                            <p className="text-white font-bold text-sm">R$ 29/mês</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Benefits (only for non-premium, to encourage upgrade) */}
            {status !== 'premium' && (
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">O que você ganha no Black</p>
                    <div className="space-y-2">
                        {benefits.map((b, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.05] last:border-0">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <b.icon className="w-3.5 h-3.5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-white/80 text-xs font-medium">{b.label}</p>
                                    <p className="text-white/35 text-[10px]">{b.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Premium active: show all benefits in compact form */}
            {status === 'premium' && (
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Seus benefícios ativos</p>
                    <div className="grid grid-cols-2 gap-2">
                        {benefits.map((b, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                                <b.icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="text-white/60 text-[10px] font-medium">{b.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Comparison table */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Free vs Black</p>
                <div className="rounded-xl overflow-hidden border border-white/[0.07]">
                    <div className="grid grid-cols-3 bg-white/[0.03] px-4 py-2.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/25">Recurso</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/25 text-center">Free</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-amber-400/70 text-center">Black</span>
                    </div>
                    {compare.map((row, i) => (
                        <div key={i} className={`grid grid-cols-3 px-4 py-2.5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'} border-t border-white/[0.04]`}>
                            <span className="text-white/55 text-xs">{row.feature}</span>
                            <span className="text-white/30 text-xs text-center">{row.free}</span>
                            <span className="text-emerald-400/80 text-xs text-center font-medium">{row.premium}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="space-y-3">
                <button className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${cfg.ctaColor}`}>
                    {status !== 'premium' && <Crown className="w-3.5 h-3.5" />}
                    {cfg.cta} {status !== 'premium' && '— R$ 29/mês'}
                </button>
                {status !== 'premium' && (
                    <>
                        <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                            Teste grátis por 3 dias
                        </button>
                        <p className="text-center text-white/20 text-[9px] mt-2">Cancele quando quiser.</p>
                    </>
                )}
            </div>
        </div>
    );
}

// ── Sobre a Voyax ──────────────────────────────────────────────────
function AboutVoyax() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 rounded-[18px] overflow-hidden border border-emerald-500/20 shrink-0">
                    <img src={IMAGES.zoeAvatar} alt="Zoe" className="w-full h-full object-cover" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">Voyax AI Platform</span>
                    </div>
                    <p className="text-white/40 text-[10px]">v2.8.4 · Sistema Seguro</p>
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-4">
                <p className="text-white/70 text-sm leading-relaxed font-light">
                    Voyax é uma plataforma de viagens com inteligência artificial que ajuda você a planejar, organizar e viver experiências de forma inteligente e econômica.
                </p>
                <p className="text-white/70 text-sm leading-relaxed font-light">
                    A <span className="text-emerald-400 font-medium">Zoe</span>, nossa assistente digital, entende seu perfil, seu orçamento e suas preferências para montar viagens personalizadas com passagens, hospedagens e experiências sob medida.
                </p>
                <p className="text-white/70 text-sm leading-relaxed font-light">
                    Nosso objetivo é tornar o planejamento de viagens simples, acessível e cada vez mais inteligente, evoluindo constantemente com novas funcionalidades e possibilidades.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[
                    { n: '180+', label: 'Países cobertos' },
                    { n: '50k+', label: 'Viagens planejadas' },
                    { n: '98%', label: 'Satisfação' },
                ].map((s, i) => (
                    <div key={i} className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                        <p className="text-white font-bold text-xl tracking-tight">{s.n}</p>
                        <p className="text-white/30 text-[9px] mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                <a href="mailto:voyaxsuporte@gmail.com" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs hover:text-white/80 transition-colors">
                    <Mail className="w-3.5 h-3.5" /> Suporte
                </a>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" /> Chat com Zoe
                </button>
            </div>
        </div>
    );
}

// ── Exported modal controller ──────────────────────────────────────
export function ProfileModals({ type, onClose }: { type: string; onClose: () => void }) {
    const isProfileHub = type === 'profile';
    const isBilling = type === 'billing';
    const isAbout = type === 'about';

    const modalConfig: Record<string, { title: string; icon: React.ElementType; wide?: boolean }> = {
        profile: { title: 'Meu Perfil', icon: User, wide: true },
        billing: { title: 'Plano & Assinatura', icon: Crown },
        contact: { title: 'Suporte Voyax', icon: MessageSquare },
        terms: { title: 'Termos e Privacidade', icon: FileText },
        about: { title: 'Sobre a Voyax', icon: Sparkles },
        settings: { title: 'Configurações', icon: Shield },
    };

    const cfg = modalConfig[type] || { title: 'Perfil', icon: User };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative w-full bg-[#0a0f1d] border border-white/10 rounded-2xl sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col ${cfg.wide ? 'max-w-3xl' : 'max-w-xl'}`}
                style={{ maxHeight: '90vh' }}
            >
                {/* Modal header */}
                <div className="flex justify-between items-center px-4 sm:px-8 pt-5 sm:pt-8 pb-4 sm:pb-5 border-b border-white/[0.06] shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <cfg.icon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{cfg.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
                        <X className="w-4 h-4 text-white/40" />
                    </button>
                </div>

                {/* Modal body */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
                    {isProfileHub && <ProfileHub onClose={onClose} />}
                    {isBilling && <BillingHub />}
                    {isAbout && <AboutVoyax />}

                    {type === 'contact' && (
                        <div className="space-y-8 text-center py-6">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                <Mail className="w-10 h-10 text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">Estamos aqui para ajudar</h4>
                                <p className="text-white/40 text-sm font-light">Nossa equipe de concierge está disponível 24/7 para membros Black.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">E-mail de Suporte</p>
                                <a href="mailto:Voyaxsuporte@gmail.com" className="text-sm sm:text-xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors break-all">
                                    Voyaxsuporte@gmail.com
                                </a>
                            </div>
                        </div>
                    )}

                    {type === 'terms' && (
                        <div className="space-y-6">
                            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
                                <Shield className="w-7 h-7 text-emerald-400 shrink-0" />
                                <p className="text-emerald-400 text-xs font-bold leading-relaxed">
                                    Sua segurança é nossa prioridade. Utilizamos criptografia de nível militar para proteger seus dados e transações.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-white font-bold text-sm">Proteção de Dados</h4>
                                <p className="text-white/40 text-xs leading-relaxed">
                                    Cumprimos rigorosamente a LGPD e o GDPR. Seus dados financeiros e de viagem são armazenados sob as mais estritas normas de segurança globais. Jamais compartilhamos seus dados com terceiros sem seu consentimento explícito.
                                </p>
                                <h4 className="text-white font-bold text-sm">Uso da Inteligência Artificial</h4>
                                <p className="text-white/40 text-xs leading-relaxed">
                                    Zoe utiliza modelos de linguagem avançados para processar suas solicitações. Todas as interações são anonimizadas para treinamento e melhoria da experiência do usuário.
                                </p>
                                <h4 className="text-white font-bold text-sm">Termos de Uso</h4>
                                <p className="text-white/40 text-xs leading-relaxed">
                                    Ao utilizar a plataforma Voyax, você concorda com nossos termos de uso e política de privacidade. O serviço é destinado a maiores de 18 anos residentes no Brasil.
                                </p>
                            </div>
                        </div>
                    )}

                    {type === 'settings' && (
                        <p className="text-white/40 text-sm">Configurações avançadas do sistema disponíveis no módulo Editar Perfil.</p>
                    )}
                </div>

                {/* Modal footer */}
                <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-white/[0.06] shrink-0 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                        Fechar
                    </button>
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-white text-[#0f172a] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-colors">
                        Salvar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
