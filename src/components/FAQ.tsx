
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Content } from '../content';

gsap.registerPlugin(ScrollTrigger);

interface FAQProps {
    isAfterParty?: boolean;
    content: Content;
}

export const FAQ: React.FC<FAQProps> = ({ isAfterParty, content }) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const cards = cardsRef.current.filter(Boolean);

        // Initial Staggered Entrance
        gsap.fromTo(cards,
            {
                y: 100,
                opacity: 0,
                rotateX: 10,
            },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                stagger: 0.1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                }
            }
        );

        // Mobile: Scroll-Driven Interaction
        const mm = gsap.matchMedia();
        mm.add("(max-width: 768px)", () => {
            cards.forEach((card) => {
                if (!card) return;
                const numberFill = card.querySelector('.number-fill');

                if (numberFill) {
                    gsap.to(numberFill, {
                        clipPath: "inset(0% 0% 0% 0%)",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            end: "center 45%",
                            scrub: 1,
                        },
                        ease: "none"
                    });
                }
            });
        });

    }, { scope: containerRef });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        if (window.innerWidth <= 768) return;

        const card = cardsRef.current[index];
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Subtle spotlight effect
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Tilt effect
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
        });
    };

    const handleMouseLeave = (index: number) => {
        if (window.innerWidth <= 768) return;

        const card = cardsRef.current[index];
        if (!card) return;
        const numberFill = card.querySelector('.number-fill');

        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto"
        });

        // Reset fill
        if (numberFill) {
            gsap.to(numberFill, {
                clipPath: "inset(100% 0% 0% 0%)",
                duration: 0.6,
                ease: "power2.out"
            });
        }
    };

    const handleMouseEnter = (index: number) => {
        if (window.innerWidth <= 768) return;

        const card = cardsRef.current[index];

        // Fill gradient on hover
        if (card) {
            const numberFill = card.querySelector('.number-fill');
            if (numberFill) {
                gsap.to(numberFill, {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 0.8,
                    ease: "power2.out"
                });
            }
        }
    };

    return (
        <section className={`py-32 px-6 overflow-hidden transition-colors duration-700 ${isAfterParty ? 'bg-[#0a0508]' : 'bg-stone-50'}`} ref={containerRef}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 relative">
                    <h2 className={`text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4 opacity-80 ${isAfterParty ? 'text-purple-400' : 'text-rose-500'}`}>
                        {content.faqSection.title}
                    </h2>
                    <p className={`text-4xl md:text-6xl font-serif tracking-tight ${isAfterParty ? 'text-white' : 'text-stone-900'}`}>
                        {content.faqSection.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 perspective-1000">
                    {content.faq.map((item, idx) => (
                        <div
                            key={idx}
                            ref={(el) => { if (el) cardsRef.current[idx] = el; }}
                            onMouseMove={(e) => handleMouseMove(e, idx)}
                            onMouseLeave={() => handleMouseLeave(idx)}
                            onMouseEnter={() => handleMouseEnter(idx)}
                            className={`
                                group relative h-[420px] rounded-[2rem] overflow-hidden cursor-default transition-all duration-500 will-change-transform
                                border backdrop-blur-md
                                ${isAfterParty
                                    ? 'bg-purple-900/10 border-purple-500/20 hover:border-purple-500/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.3)]'
                                    : 'bg-white/40 border-white/60 hover:border-rose-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_-12px_rgba(244,63,94,0.15)]'
                                }
                            `}
                            style={{
                                transformStyle: 'preserve-3d',
                                '--mouse-x': '50%',
                                '--mouse-y': '50%'
                            } as React.CSSProperties}
                        >
                            {/* Spotlight/Glow Effect */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                style={{
                                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${isAfterParty ? 'rgba(168, 85, 247, 0.08)' : 'rgba(244, 63, 94, 0.06)'}, transparent 40%)`
                                }}
                            />

                            <div className="relative h-full flex flex-col justify-between p-10 z-10 select-none">
                                <div className="relative -ml-4 -mt-4 w-fit">
                                    {/* Outline Number (Always visible base) */}
                                    <span className={`block text-9xl font-serif font-bold tracking-tighter opacity-20 ${isAfterParty ? 'text-purple-300' : 'text-stone-400'
                                        }`} style={{ WebkitTextStroke: isAfterParty ? '2px rgba(168,85,247,0.5)' : '2px rgba(244,63,94,0.3)', color: 'transparent' }}>
                                        0{idx + 1}
                                    </span>

                                    {/* Liquid Fill Number (Animated) */}
                                    <span
                                        className={`number-fill absolute top-0 left-0 block text-9xl font-serif font-bold tracking-tighter ${isAfterParty ? 'text-purple-400' : 'text-rose-500'}`}
                                        style={{
                                            clipPath: 'inset(100% 0% 0% 0%)'
                                        }}
                                    >
                                        0{idx + 1}
                                    </span>
                                </div>

                                <div>
                                    <h3 className={`text-2xl font-serif mb-4 transition-colors duration-300 ${isAfterParty ? 'text-white' : 'text-stone-800 group-hover:text-rose-700'}`}>
                                        {item.q}
                                    </h3>
                                    <p className={`text-lg font-light leading-relaxed ${isAfterParty ? 'text-purple-200/70' : 'text-stone-600'}`}>
                                        {item.a}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </section>
    );
};
