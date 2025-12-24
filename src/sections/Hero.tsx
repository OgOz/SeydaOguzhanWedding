import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { HoldButton } from '../components/HoldButton';


// ... imports

export const Hero: React.FC = () => {
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

    }, { scope: containerRef });

    const renderTitle = (text: string) => {
        // Using serif font, manual kerning tweak for cleaner look
        return text.split("").map((char, index) => (
            <span key={index} className="hero-char inline-block min-w-[0.2em] will-change-transform">{char === " " ? "\u00A0" : char}</span>
        ));
    }

    return (
        <div ref={containerRef} className="relative h-[100svh] w-full flex flex-col items-center justify-between bg-[#fdf6f8] overflow-hidden py-safe">

            {/* Background Texture & Grain */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply will-change-transform" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Ambient Light Orbs - Static for Performance */}
            <div className="absolute top-[-10%] left-[-10%] w-[60vh] h-[60vh] bg-rose-200/40 rounded-full blur-[100px] pointer-events-none transform-translate-z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[70vh] h-[70vh] bg-rose-300/30 rounded-full blur-[120px] pointer-events-none transform-translate-z-0"></div>

            {/* Top Balancer */}
            <div className="flex-none h-[12vh]"></div>

            {/* Main Content Area */}
            <div ref={textRef} className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-2xl mx-auto flex-1 justify-center">

                {/* Header with Expanding Lines */}
                <div className="flex items-center gap-4 text-rose-800/60 uppercase tracking-[0.3em] text-[10px] md:text-xs font-medium mb-12">
                    <span className="hero-line w-8 md:w-12 h-[1px] bg-rose-300 origin-right"></span>
                    <span className="hero-reveal header-text">NİKAH DAVETİYESİ</span>
                    <span className="hero-line w-8 md:w-12 h-[1px] bg-rose-300 origin-left"></span>
                </div>

                {/* Names Cluster - Perfectly Balanced */}
                <div className="flex flex-col items-center justify-center gap-4 mb-10 w-full">

                    {/* Name 1 */}
                    <h1 className="text-[3.5rem] md:text-8xl lg:text-9xl font-serif text-rose-950 leading-[1.1] tracking-tight">
                        {renderTitle("Şeyda")}
                    </h1>

                    {/* Ampersand - Geometric Center */}
                    <div className="ampersand-wrapper relative h-12 flex items-center justify-center py-2 z-10">
                        <span className="text-5xl md:text-7xl text-rose-300 font-script">&</span>
                    </div>

                    {/* Name 2 */}
                    <h1 className="text-[3.5rem] md:text-8xl lg:text-9xl font-serif text-rose-950 leading-[1.1] tracking-tight">
                        {renderTitle("Oğuzhan")}
                    </h1>
                </div>

                {/* Poetic Message */}
                <div className="hero-reveal space-y-4 font-serif text-rose-900/80 italic text-lg md:text-2xl leading-relaxed cursor-default mb-10">
                    <p>"Bu hikâye yıllardır ‘biz’di.<br className="md:hidden" /> Bugün resmileşiyor."</p>
                </div>

                {/* Date & Location Pill - Modernized */}
                <div className="hero-reveal flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 text-rose-950 font-serif text-xl md:text-2xl tracking-wide">
                        <span>7 Şubat 2026</span>
                        <span className="text-rose-300">•</span>
                        <span>16:30</span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-rose-100/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        <span className="text-[10px] md:text-xs uppercase tracking-widest text-rose-900/70 font-semibold">Tarık Akan Nikâh Salonu, Bakırköy</span>
                    </div>
                </div>

            </div>

            {/* Bottom Call to Action */}
            <div className="hero-reveal relative z-20 flex flex-col items-center gap-6 pb-12 w-full">
                <div className="flex flex-col items-center gap-2 text-rose-900/40 text-[10px] tracking-[0.2em] uppercase mb-2">
                    <span>Gelin, birlikte kutlayalım</span>
                </div>

                <HoldButton
                    onComplete={() => {
                        document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                />
            </div>

        </div >
    );
};
