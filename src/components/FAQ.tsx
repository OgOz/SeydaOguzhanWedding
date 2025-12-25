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

        gsap.fromTo(items,
            {
                y: 50,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section className="py-24 px-6 bg-white overflow-hidden" ref={containerRef}>
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
                            className="bg-stone-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-stone-100"
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
