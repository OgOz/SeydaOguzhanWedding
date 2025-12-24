import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { HoldButton } from '../components/HoldButton';
import { InvitationModal } from '../components/InvitationModal';

// ... imports

export const Hero: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Elegant Text Reveal (Staggered Characters)
        tl.from(".hero-text-char", {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.04,
            ease: "power4.out",
            delay: 0.2
        })
            // 2. Reveal the new poetic text line by line
            .from(".poem-line", {
                y: 20,
                opacity: 0,
                filter: "blur(10px)",
                duration: 1,
                stagger: 0.15,
                ease: "power2.out"
            }, "-=0.8")
            // 3. Reveal decorative elements (lines, location)
            .from(".hero-decoration", {
                scaleX: 0,
                opacity: 0,
                duration: 1,
                ease: "expo.out"
            }, "-=0.5")
            // 4. Reveal Bottom Buttons
            .from(".hero-actions", {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.6");

        // Parallax effect on scroll
        gsap.to(textRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: 100,
            opacity: 0
        });

    }, { scope: containerRef });

    const renderTitle = (text: string) => {
        return text.split("").map((char, index) => (
            <span key={index} className="hero-text-char inline-block min-w-[0.2em]">{char === " " ? "\u00A0" : char}</span>
        ));
    }

    return (
        <div ref={containerRef} className="relative h-[100svh] w-full flex flex-col items-center justify-between bg-[#fdf6f8] overflow-hidden py-safe">

            {/* Background Texture & Gradients */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            <div className="absolute top-[-20%] left-[-10%] w-[50vh] h-[50vh] bg-rose-200/40 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vh] h-[60vh] bg-rose-300/30 rounded-full blur-[140px] pointer-events-none"></div>

            {/* Top Spacer for Balance */}
            <div className="flex-none h-[10vh]"></div>

            {/* Main Content */}
            <div ref={textRef} className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-2xl mx-auto flex-1 justify-center">

                {/* Header Decoration */}
                <div className="hero-decoration flex items-center gap-4 text-rose-800/60 uppercase tracking-[0.3em] text-[10px] md:text-xs font-medium mb-8">
                    <span className="w-8 h-[1px] bg-rose-300"></span>
                    NİKAH DAVETİYESİ
                    <span className="w-8 h-[1px] bg-rose-300"></span>
                </div>

                {/* Names */}
                <div className="space-y-2 mb-10">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-rose-950 leading-[0.85] tracking-tight">
                        {renderTitle("Şeyda")}
                    </h1>
                    <div className="hero-text-char text-3xl md:text-5xl text-rose-400 font-serif italic py-1">&</div>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-rose-950 leading-[0.85] tracking-tight">
                        {renderTitle("Oğuzhan")}
                    </h1>
                </div>

                {/* Poetic Text */}
                <div className="space-y-4 md:space-y-6 font-serif text-rose-900/80 italic text-lg md:text-2xl leading-relaxed cursor-default my-8">
                    <div className="poem-line">
                        "Bu hikâye yıllardır ‘biz’di.<br className="md:hidden" /> Bugün resmileşiyor."
                    </div>
                </div>

                {/* Date & Location Details - Redesigned */}
                <div className="hero-decoration flex flex-col items-center gap-3">
                    {/* Date & Time */}
                    <div className="flex items-center gap-3 text-rose-900 font-serif text-xl md:text-2xl">
                        <span>7 Şubat 2026</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        <span>16:30</span>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center gap-2 text-rose-800/70 uppercase tracking-widest text-xs md:text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        <span>Tarık Akan Nikâh Salonu, Bakırköy</span>
                    </div>
                </div>

            </div>

            {/* Bottom Actions */}
            <div className="hero-actions relative z-20 flex flex-col items-center gap-6 pb-8 md:pb-10 w-full">

                <div className="flex flex-col items-center gap-2 text-rose-900/40 text-[10px] tracking-widest uppercase mb-2">
                    <span>Gelin, birlikte kutlayalım</span>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-rose-200/50 rounded-full text-rose-700 hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                        <span className="text-xs font-bold tracking-widest uppercase ml-1">Davetiyeyi Görüntüle</span>
                    </button>

                    <HoldButton
                        onComplete={() => {
                            document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    />
                </div>
            </div>

            {/* Modal Portal */}
            <InvitationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div >
    );
};
