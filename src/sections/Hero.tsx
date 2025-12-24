import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { HoldButton } from '../components/HoldButton';
import { InvitationModal } from '../components/InvitationModal';

export const Hero: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Initial load animation
        tl.from(".hero-text-char", {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power4.out",
            delay: 0.2
        })
            .from(".hero-subtitle", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.5")
            .from(".scroll-indicator", {
                y: -10,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.3");

        // Parallax effect on scroll
        gsap.to(textRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: 150,
            opacity: 0
        });

    }, { scope: containerRef });

    const renderTitle = (text: string) => {
        return text.split("").map((char, index) => (
            <span key={index} className="hero-text-char inline-block min-w-[0.2em]">{char === " " ? "\u00A0" : char}</span>
        ));
    }

    return (
        <div ref={containerRef} className="relative min-h-[100svh] flex flex-col items-center justify-between bg-[#fdf6f8] overflow-hidden pt-20 pb-12">

            {/* Subtle Grain/Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Decorative Blur Circles */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vh] h-[50vh] bg-gold-200 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vh] h-[60vh] bg-gold-300 rounded-full blur-[120px] opacity-20"></div>

            <div ref={textRef} className="relative z-10 flex flex-col items-center text-center px-4 space-y-12 flex-1 justify-center">

                <div className="hero-subtitle flex items-center gap-4 text-gold-600 uppercase tracking-[0.4em] text-xs md:text-sm font-medium">
                    <span className="w-12 h-[1px] bg-gold-400"></span>
                    Birlikte, nihayet...
                    <span className="w-12 h-[1px] bg-gold-400"></span>
                </div>

                <div className="space-y-2 md:space-y-4">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-dark-900 leading-[0.9] tracking-tight">
                        {renderTitle("Şeyda")}
                    </h1>
                    <div className="hero-text-char text-4xl md:text-6xl text-gold-500 font-serif italic py-2">&</div>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-dark-900 leading-[0.9] tracking-tight">
                        {renderTitle("Oğuzhan")}
                    </h1>
                </div>

                <div className="hero-subtitle flex flex-col items-center gap-4 text-dark-800 font-light mt-8 max-w-md mx-auto">
                    <p className="text-lg md:text-xl font-serif italic leading-relaxed text-stone-600">
                        "Bu hikâye yıllardır 'biz'di.<br />Bugün adını koyuyoruz."
                    </p>
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-4"></div>
                    <p className="text-sm md:text-base text-stone-500 uppercase tracking-widest mt-2">
                        Bakırköy, İstanbul
                    </p>
                </div>

            </div>



            <div className="scroll-indicator relative z-20 mt-8 flex flex-col items-center gap-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-rose-200 rounded-full text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm hover:shadow-md group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                    <span className="text-xs md:text-sm font-medium tracking-wide uppercase">Davetiyeyi Görüntüle</span>
                </button>

                <HoldButton
                    onComplete={() => {
                        document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                />
            </div>

            {/* Modal Portal should ideally be at root, but for now strict z-index */}
            <InvitationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div >
    );
};
