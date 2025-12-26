import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content } from '../content';

gsap.registerPlugin(ScrollTrigger);

export const FAQ: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const items = itemsRef.current.filter(Boolean);

        // 3D Staggered Reveal
        gsap.fromTo(items,
            {
                y: 100,
                opacity: 0,
                rotateX: -15,
                transformOrigin: "top center",
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
    }, { scope: containerRef });

    const handleMouseEnter = (index: number) => {
        const items = itemsRef.current.filter(Boolean);

        // Focus Effect: Blur others, highlight current
        gsap.to(items, {
            opacity: 0.4,
            filter: "blur(2px)",
            scale: 0.98,
            duration: 0.4,
            ease: "power2.out"
        });

        gsap.to(items[index], {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1.02,
            boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)",
            borderColor: "rgba(225, 29, 72, 0.1)", // Rose-600 with low opacity
            y: -5,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true
        });
    };

    const handleMouseLeave = () => {
        const items = itemsRef.current.filter(Boolean);

        // Reset all
        gsap.to(items, {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            boxShadow: "none",
            borderColor: "rgb(245, 245, 244)", // stone-100
            y: 0,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    return (
        <section className="py-24 px-6 bg-white overflow-hidden perspective-1000" ref={containerRef}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-sm md:text-base text-rose-500 font-bold tracking-[0.2em] uppercase mb-4">
                        MERAK EDİLENLER
                    </h2>
                    <p className="text-3xl md:text-4xl font-serif text-stone-800">
                        Sıkça Sorulan Sorular
                    </p>
                </div>

                <div className="grid gap-6">
                    {content.faq.map((item, idx) => (
                        <div
                            key={idx}
                            ref={(el) => { if (el) itemsRef.current[idx] = el; }}
                            onMouseEnter={() => handleMouseEnter(idx)}
                            onMouseLeave={handleMouseLeave}
                            className="bg-stone-50 rounded-2xl p-8 border border-stone-100 cursor-default transition-colors will-change-transform"
                        >
                            <h3 className="text-xl font-serif text-rose-950 mb-3">
                                {item.q}
                            </h3>
                            <p className="text-stone-600 font-light leading-relaxed">
                                {item.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
