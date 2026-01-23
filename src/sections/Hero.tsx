import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { HoldButton } from '../components/HoldButton';

interface HeroProps {
    onUnlock?: () => void;
    isAfterParty?: boolean;
    content: any; // Using any for brevity but ideally it's the structure from content.ts
}

export const Hero: React.FC<HeroProps> = ({ onUnlock, isAfterParty, content }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 1. Initial Set
        gsap.set(".hero-char", { y: 40, opacity: 0 });
        gsap.set(".hero-line", { scaleX: 0, opacity: 0 }); // Lines start collapsed
        gsap.set(".hero-reveal", { y: 20, opacity: 0 });
        gsap.set(".ampersand-wrapper", { scale: 0, rotation: -15, opacity: 0 });

        // 2. Main Title Sequence
        tl
            // Lines expand outwards first
            .to(".hero-line", {
                scaleX: 1,
                opacity: 1,
                duration: 1.2,
                ease: "expo.out"
            })
            .to(".hero-reveal.header-text", {
                y: 0,
                opacity: 1,
                duration: 0.8
            }, "<+=0.2") // Overlap slightly

            // Names Reveal
            .to(".hero-char", {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.03,
                ease: "back.out(1.4)"
            }, "-=0.5")

            // Ampersand Flourish
            .to(".ampersand-wrapper", {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 1.2,
                ease: "elastic.out(1, 0.5)"
            }, "-=0.8")

            // Rest of the content
            .to(".hero-reveal:not(.header-text)", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                clearProps: "all"
            }, "-=0.6");

        // Parallax
        gsap.to(textRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: 60,
            opacity: 0,
            force3D: true
        });

        // Hold Hint Pulse - Enhanced for visibility
        gsap.to(".hold-hint", {
            opacity: 1,
            scale: 1.1,
            textShadow: isAfterParty
                ? "0 0 20px rgba(168, 85, 247, 0.5)"
                : "0 0 20px rgba(244, 63, 94, 0.5)",
            yoyo: true,
            repeat: -1,
            duration: 0.8,
            ease: "sine.inOut"
        });

    }, { scope: containerRef });

    const renderTitle = (text: string) => {
        // Using serif font, manual kerning tweak for cleaner look
        return text.split("").map((char, index) => (
            <span key={index} className="hero-char inline-block min-w-[0.2em] will-change-transform">{char === " " ? "\u00A0" : char}</span>
        ));
    }

    return (
        <div ref={containerRef} className={`relative min-h-[100svh] h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ${isAfterParty ? 'bg-[#0a0508]' : 'bg-[#fdf6f8]'}`}>

            {/* Background Texture & Grain */}
            <div className={`absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply will-change-transform ${isAfterParty ? 'invert' : ''}`} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Ambient Light Orbs */}
            <div className={`absolute top-[-10%] left-[-10%] w-[60vh] h-[60vh] rounded-full blur-[100px] pointer-events-none transform-translate-z-0 ${isAfterParty ? 'bg-purple-900/40' : 'bg-rose-200/40'}`}></div>
            <div className={`absolute bottom-[-10%] right-[-10%] w-[70vh] h-[70vh] rounded-full blur-[120px] pointer-events-none transform-translate-z-0 ${isAfterParty ? 'bg-indigo-900/30' : 'bg-rose-300/30'}`}></div>

            {/* Main Content Area - Scaled to fit */}
            <div ref={textRef} className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-2xl mx-auto flex-1 justify-center scale-90 md:scale-100 origin-center">

                {/* Header with Expanding Lines */}
                <div className={`flex items-center gap-4 uppercase tracking-[0.3em] text-[10px] md:text-xs font-medium mb-6 md:mb-8 ${isAfterParty ? 'text-purple-300/60' : 'text-rose-800/60'}`}>
                    <span className={`hero-line w-8 md:w-12 h-[1px] origin-right ${isAfterParty ? 'bg-purple-500/50' : 'bg-rose-300'}`}></span>
                    <span className="hero-reveal header-text">{content.hero.eyebrow}</span>
                    <span className={`hero-line w-8 md:w-12 h-[1px] origin-left ${isAfterParty ? 'bg-purple-500/50' : 'bg-rose-300'}`}></span>
                </div>

                {/* Names Cluster */}
                <div className="flex flex-col items-center justify-center gap-1 md:gap-2 mb-6 md:mb-8 w-full">
                    {/* Name 1 */}
                    <h1 className={`text-[3rem] md:text-8xl lg:text-9xl font-serif leading-[1.1] tracking-tight ${isAfterParty ? 'text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'text-rose-950'}`}>
                        {renderTitle(content.names.bride)}
                    </h1>

                    {/* Ampersand */}
                    <div className="ampersand-wrapper relative h-10 md:h-12 flex items-center justify-center py-1 z-10 mt-2 md:mt-4">
                        <span className={`text-4xl md:text-6xl font-serif italic ${isAfterParty ? 'text-purple-400' : 'text-rose-300'}`} style={{ fontFamily: 'Times New Roman, serif' }}>&</span>
                    </div>

                    {/* Name 2 */}
                    <h1 className={`text-[3rem] md:text-8xl lg:text-9xl font-serif leading-[1.1] tracking-tight ${isAfterParty ? 'text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'text-rose-950'}`}>
                        {renderTitle(content.names.groom)}
                    </h1>
                </div>

                {/* Poetic Message */}
                <div className={`hero-reveal space-y-4 font-serif italic text-lg md:text-2xl leading-relaxed cursor-default mb-8 md:mb-10 ${isAfterParty ? 'text-purple-100/80' : 'text-rose-900/80'}`}>
                    <p dangerouslySetInnerHTML={{ __html: content.hero.signature.replace('\n', '<br className="md:hidden" />') }} />
                </div>

                {/* Hold Button */}
                <div className="hero-reveal mb-2 md:mb-4 scale-90 md:scale-100 relative z-20">
                    <HoldButton
                        isAfterParty={isAfterParty}
                        onComplete={() => {
                            if (onUnlock) onUnlock();
                            // Hide hint on complete
                            gsap.to(".hold-hint", { opacity: 0, duration: 0.5 });
                            document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    />
                </div>

                {/* Hold Hint */}
                <div className={`hero-reveal hold-hint text-sm md:text-base font-bold tracking-[0.25em] uppercase opacity-0 mb-8 md:mb-12 drop-shadow-sm ${isAfterParty ? 'text-purple-400' : 'text-rose-500'}`}>
                    {isAfterParty ? 'Partiye Giriş Yapın' : 'Kalbe Basılı Tutun'}
                </div>

                {/* Date & Location Pill */}
                <div className="hero-reveal flex flex-col items-center gap-3 md:gap-4">
                    <div className={`flex items-center gap-3 font-serif text-xl md:text-2xl tracking-wide ${isAfterParty ? 'text-white' : 'text-rose-950'}`}>
                        <span>{content.date.full}</span>
                        <span className={isAfterParty ? 'text-purple-500' : 'text-rose-300'}>•</span>
                        <span>{content.date.time}</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 md:gap-3">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${isAfterParty ? 'bg-purple-950/40 backdrop-blur-md border-purple-500/30' : 'bg-white/40 backdrop-blur-sm border-rose-100/50'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isAfterParty ? 'text-purple-400' : 'text-rose-500'}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            <span className={`text-[10px] md:text-xs uppercase tracking-widest font-semibold ${isAfterParty ? 'text-purple-100' : 'text-rose-900/70'}`}>{content.location.name}, {content.location.district}</span>
                        </div>
                        <span className={`text-[10px] tracking-[0.2em] uppercase ${isAfterParty ? 'text-purple-400/60' : 'text-rose-900/40'}`}>{isAfterParty ? "EĞLENCEYE HAZIR OLUN" : "Gelin, birlikte kutlayalım"}</span>
                    </div>
                </div>

            </div>

        </div>
    );
};
