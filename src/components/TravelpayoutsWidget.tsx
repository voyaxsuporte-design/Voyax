import { useEffect, useState } from 'react';
import { Plane, AlertCircle } from 'lucide-react';

export default function TravelpayoutsWidget() {
    const [isLocalhost, setIsLocalhost] = useState(false);

    useEffect(() => {
        setIsLocalhost(
            window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1'
        );
    }, []);
    return (
        <div className="w-full flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-md relative transform transition-all duration-700 w-full animate-in fade-in slide-in-from-bottom-8">

                {/* Subtle top reflection gradient */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-50"></div>

                {isLocalhost ? (
                    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-black/20 text-center relative z-10">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                            <Plane className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Modo de Desenvolvimento</h3>
                        <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed mb-6">
                            O motor de buscas (White Label) por razões de segurança e CORS do provedor recusa a exibição em ambiente local.
                        </p>
                        
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 max-w-md mx-auto text-left">
                            <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-orange-200">Apenas Ambiente Local</p>
                                <p className="text-xs text-orange-200/70 leading-relaxed">
                                    Em produção (ex: Vercel) o widget do Travelpayouts irá renderizar perfeitamente. A integração estrutural está finalizada.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <iframe
                        src="/travelpayouts.html"
                        title="Integração Travelpayouts"
                        className="w-full border-0 bg-transparent relative z-10"
                        style={{ minHeight: '850px' }}
                        allow="payment"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-top-navigation"
                    />
                )}

                {/* Extracted footer out of iframe flow if needed or keep it elegant at bottom */}
                <div className="absolute bottom-0 inset-x-0 pb-5 pt-1 bg-gradient-to-t from-[#0a1628] to-transparent pointer-events-none z-20 flex items-end justify-center">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase relative z-30 drop-shadow-md">
                        Tecnologia Integrada por <span className="text-emerald-400 font-black">Travelpayouts</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
