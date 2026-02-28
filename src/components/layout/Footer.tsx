export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-[90] h-10 flex items-center justify-between px-8 bg-[#0a1628]/80 backdrop-blur-md border-t border-white/5">
            <div className="flex items-center gap-4">
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">ZOE AI CORE V2.8.4</span>
                <span className="text-white/10">·</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">VOYAX PREMIUM CONCIERGE</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">SISTEMA SEGURO</span>
            </div>
        </footer>
    );
}
