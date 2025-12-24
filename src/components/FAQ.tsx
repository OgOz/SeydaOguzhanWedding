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
        // Initial Reveal Animation
        const items = itemsRef.current.filter(Boolean);

        gsap.fromTo(items,
            {
                y: 100,
                opacity: 0,
                filter: "blur(10px)"
            },
            {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                stagger: 0.1,
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                }
            }
        );
    }, { scope: containerRef });

    const handleMouseEnter = (index: number) => {
        const items = itemsRef.current.filter(Boolean);
        gsap.to(items, {
            opacity: 0.3,
            filter: "blur(4px)",
            scale: 0.98,
            duration: 0.4,
            ease: "power2.out"
        });
        gsap.to(items[index], {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1.05,
            x: 20,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true
        });
    };

    const handleMouseLeave = () => {
        const items = itemsRef.current.filter(Boolean);
        gsap.to(items, {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            x: 0,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    return (
        <section className="py-32 px-6 bg-white overflow-hidden" ref={containerRef}>
            <div className="max-w-5xl mx-auto">
                <h2 className="text-sm md:text-base text-rose-500 font-bold tracking-[0.2em] uppercase mb-16 text-center opacity-60">
                    Merak Edilenler
                </h2>

                <div className="flex flex-col gap-12 md:gap-16" onMouseLeave={handleMouseLeave}>
                    {content.faq.map((item, idx) => (
                        <div
                            key={idx}
                            ref={(el) => { if (el) itemsRef.current[idx] = el; }}
                            onMouseEnter={() => handleMouseEnter(idx)}
                            className="group cursor-default transition-colors w-full"
                        >
                            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
                                <h3 className="text-4xl md:text-6xl font-serif text-rose-950 shrink-0 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                                    {item.q}
                                </h3>
                                <p className="text-xl md:text-3xl text-text-secondary font-light leading-snug">
                                    {item.a}
                                </p>
                            </div>
                            <div className="w-full h-[1px] bg-gradient-to-r from-rose-200 to-transparent mt-8 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
