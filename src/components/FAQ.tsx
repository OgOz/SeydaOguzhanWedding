import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content } from '../content';

gsap.registerPlugin(ScrollTrigger);

export const FAQ: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const cards = cardsRef.current.filter(Boolean);

        // Initial Staggered Entrance
        gsap.fromTo(cards,
            {
                y: 150,
                opacity: 0,
                rotateX: 15,
                transformPerspective: 1000
            },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                stagger: 0.15,
                duration: 1.4,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );

    }, { scope: containerRef });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        const card = cardsRef.current[index];
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Tilt calculation (inverted for natural feel)
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg tilt
        const rotateY = ((x - centerX) / centerX) * 10;

        // Apply Tilt
        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.1, // Quick response
            ease: "power1.out",
            overwrite: "auto"
        });

        // Move Spotlight
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    const handleMouseLeave = (index: number) => {
        const card = cardsRef.current[index];
        if (!card) return;

        // Reset Tilt
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto"
        });

        // Reset siblings opacity
        gsap.to(cardsRef.current.filter(Boolean), {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.4
        });
    };

    const handleMouseEnter = (index: number) => {
        // Dim siblings
        const others = cardsRef.current.filter((_, i) => i !== index && _);
        gsap.to(others, {
            opacity: 0.4,
            filter: "blur(2px)",
            duration: 0.4,
            ease: "power2.out"
        });
    };

    return (
        <section className="py-32 px-6 bg-stone-50 overflow-hidden" ref={containerRef}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-sm md:text-base text-rose-500 font-bold tracking-[0.3em] uppercase mb-4 opacity-80">
                        MERAK EDİLENLER
                    </h2>
                    <p className="text-4xl md:text-6xl font-serif text-stone-900 tracking-tight">
                        Detaylar & Notlar
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 perspective-2000">
                    {content.faq.map((item, idx) => (
                        <div
                            key={idx}
                            ref={(el) => { if (el) cardsRef.current[idx] = el; }}
                            onMouseMove={(e) => handleMouseMove(e, idx)}
                            onMouseLeave={() => handleMouseLeave(idx)}
                            onMouseEnter={() => handleMouseEnter(idx)}
                            className="group relative h-[400px] md:h-[500px] rounded-[2rem] bg-white border border-stone-200 shadow-xl overflow-hidden cursor-default preserve-3d will-change-transform"
                            style={{
                                transformStyle: 'preserve-3d',
                                '--mouse-x': '50%',
                                '--mouse-y': '50%'
                            } as React.CSSProperties}
                        >
                            {/* Spotlight Gradient */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                                style={{
                                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(244, 63, 94, 0.06), transparent 40%)`
                                }}
                            />

                            {/* Card Content Container - Slight float effect */}
                            <div className="relative h-full flex flex-col justify-between p-8 md:p-10 z-10 pointer-events-none select-none">
                                {/* Number Watermark */}
                                <div className="text-8xl font-serif text-stone-100/80 -ml-4 -mt-4 font-bold tracking-tighter">
                                    0{idx + 1}
                                </div>

                                <div>
                                    <h3 className="text-2xl md:text-3xl font-serif text-rose-950 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                                        {item.q}
                                    </h3>
                                    <p className="text-lg text-stone-600 font-light leading-relaxed">
                                        {item.a}
                                    </p>
                                </div>

                                {/* Subtle Decoration */}
                                <div className="w-full h-[1px] bg-gradient-to-r from-rose-200/0 via-rose-200 to-rose-200/0 opacity-50 mt-8" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Global CSS for perspective utility if not in tailwind config */}
            <style>{`
                .perspective-2000 {
                    perspective: 2000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
            `}</style>
        </section>
    );
};
