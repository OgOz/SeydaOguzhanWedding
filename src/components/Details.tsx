import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content } from '../content';
import { generateICS } from '../utils/ics';

gsap.registerPlugin(ScrollTrigger);

export const Details: React.FC = () => {
    const storyRef = useRef<HTMLParagraphElement>(null);

    const openMap = () => window.open(content.location.mapLink, '_blank');

    const copyAddress = () => {
        navigator.clipboard.writeText(content.location.address);
        // Could add a toast here in a real app
        alert("Adres kopyalandı!");
    };

    useGSAP(() => {
        if (!storyRef.current) return;

        const chars = storyRef.current.querySelectorAll('.char');

        gsap.fromTo(chars,
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                stagger: 0.03, // Typed effect speed
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: storyRef.current,
                    start: "top 80%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    }, { scope: storyRef });

    // Split text helper
    const splitText = (text: string) => {
        return text.split("").map((char, index) => (
            <span key={index} className="char inline-block min-w-[0.2em] whitespace-pre">
                {char}
            </span>
        ));
    };

    return (
        <section id="details" className="relative py-24 px-6 bg-white overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-16">

                {/* Story Blurb */}
                <div className="text-center space-y-6">
                    <p ref={storyRef} className="text-3xl md:text-4xl font-serif text-text-primary leading-tight max-w-2xl mx-auto flex flex-col items-center gap-2">
                        <span>{splitText("Bu hikâye yıllardır ‘biz’di.")}</span>
                        <span>{splitText("Bugün resmileşiyor.")}</span>
                    </p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="w-16 h-[1px] bg-rose-200 mx-auto"
                    />
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Date & Time Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        className="group p-8 bg-rose-50/50 rounded-3xl border border-rose-100 hover:border-rose-200 transition-colors"
                    >
                        <h3 className="text-rose-500 text-sm tracking-widest uppercase font-semibold mb-6">Zaman</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-3xl font-serif text-text-primary">{content.date.full}</p>
                                <p className="text-text-secondary">{content.date.weekday}</p>
                            </div>
                            <div className="pt-4 border-t border-rose-100">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-text-primary font-medium">{content.date.time}</span>
                                    <span className="text-sm px-3 py-1 bg-rose-100/50 text-rose-800 rounded-full">
                                        {content.date.label}
                                    </span>
                                </div>
                                <button
                                    onClick={() => generateICS(content.date.calendar)}
                                    className="text-sm text-text-secondary hover:text-rose-600 transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
                                    Takvime Ekle (.ics)
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Location Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        className="group p-8 bg-rose-50/50 rounded-3xl border border-rose-100 hover:border-rose-200 transition-colors"
                    >
                        <h3 className="text-rose-500 text-sm tracking-widest uppercase font-semibold mb-6">Mekân</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-2xl font-serif text-text-primary">{content.location.name}</p>
                                <p className="text-text-secondary">{content.location.district}, {content.location.city}</p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={openMap} className="text-sm text-rose-600 underline decoration-rose-300 hover:decoration-rose-600 underline-offset-4 transition-all">
                                    Haritada Yol Tarifi
                                </button>
                                <button onClick={copyAddress} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                                    Adresi Kopyala
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Map Embed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    className="rounded-3xl overflow-hidden border border-rose-100 shadow-2xl shadow-rose-100/50 h-[400px] relative z-0"
                >
                    <iframe
                        src={content.location.embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale hover:grayscale-0 transition-all duration-700"
                    />
                </motion.div>

            </div>
        </section>
    );
};
