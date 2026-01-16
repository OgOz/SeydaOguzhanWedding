import React, { useRef, useState } from 'react';
import { Section } from '../components/Section';
import { Calendar, MapPin, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const Details: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    useGSAP(() => {
        gsap.from(".detail-card", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            },
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    const handleCopyAddress = () => {
        navigator.clipboard.writeText("Ataköy 7-8-9-10, 34158 Bakırköy/İstanbul");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCalendar = () => {
        const event = {
            title: "Şeyda & Oğuzhan Wedding",
            description: "Şeyda & Oğuzhan Nikah Töreni",
            location: "Tarık Akan Nikâh Salonu, Bakırköy/İstanbul",
            start: "20260207T133000Z", // 16:30 TRT is 13:30 UTC
            end: "20260207T153000Z",
        };

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding//SeydaOguzhan//TR
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
DTSTART:${event.start}
DTEND:${event.end}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'seyda_oguzhan_wedding.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Section id="details" className="relative z-20 bg-stone-50/50 pt-24 pb-32">
            <div ref={containerRef} className="max-w-6xl mx-auto px-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                    {/* ZAMAN KARTI */}
                    <motion.div
                        className="detail-card bg-white rounded-[2.5rem] border border-rose-100/50 p-10 md:p-14 shadow-[0_20px_50px_rgba(244,63,94,0.03)] relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                            <span className="text-[10px] font-bold text-rose-400 tracking-[0.3em] uppercase mb-10 block font-sans">ZAMAN</span>

                            <div className="mb-12">
                                <h3 className="text-5xl md:text-6xl font-serif text-stone-800 mb-3 tracking-tight">7 Şubat 2026</h3>
                                <p className="text-stone-400 text-xl font-serif italic">Cumartesi</p>
                            </div>

                            <div className="w-full h-px bg-stone-100 mb-10" />

                            <div className="flex items-center justify-between mb-12">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-serif text-stone-800 font-medium">16:30</span>
                                </div>
                                <span className="px-5 py-2 bg-rose-50 text-rose-500 text-[10px] font-bold rounded-full uppercase tracking-[0.15em] border border-rose-100/50">
                                    Nikâh Başlangıcı
                                </span>
                            </div>

                            <button
                                onClick={handleCalendar}
                                className="flex items-center gap-3 text-stone-400 hover:text-rose-500 transition-all group/btn"
                            >
                                <div className="p-2 rounded-lg bg-stone-50 group-hover/btn:bg-rose-50 transition-colors">
                                    <Calendar size={18} className="text-stone-400 group-hover/btn:text-rose-500 transition-colors" />
                                </div>
                                <span className="text-sm font-medium border-b border-stone-200 group-hover/btn:border-rose-200">Takvime Ekle (.ics)</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* MEKÂN KARTI */}
                    <motion.div
                        className="detail-card bg-white rounded-[2.5rem] border border-rose-100/50 p-10 md:p-14 shadow-[0_20px_50px_rgba(244,63,94,0.03)] relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                            <span className="text-[10px] font-bold text-rose-400 tracking-[0.3em] uppercase mb-10 block font-sans">MEKÂN</span>

                            <div className="mb-12">
                                <h3 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4 leading-[1.15] tracking-tight">Tarık Akan Nikâh Salonu</h3>
                                <p className="text-stone-400 text-xl font-serif italic">Bakırköy, İstanbul</p>
                            </div>

                            <div className="w-full h-px bg-stone-100 mb-10" />

                            <div className="flex flex-wrap gap-x-10 gap-y-6">
                                <a
                                    href="https://maps.app.goo.gl/kG1YfXnNfF9nZzX98"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-rose-500 hover:text-rose-600 transition-all group/link"
                                >
                                    <div className="p-2 rounded-lg bg-rose-50 group-hover/link:bg-rose-100 transition-colors">
                                        <MapPin size={18} />
                                    </div>
                                    <span className="text-sm font-semibold border-b border-rose-200 group-hover/link:border-rose-400">Haritada Yol Tarifi</span>
                                </a>

                                <button
                                    onClick={handleCopyAddress}
                                    className="flex items-center gap-3 text-stone-400 hover:text-stone-600 transition-all group/btn"
                                >
                                    <div className="p-2 rounded-lg bg-stone-50 group-hover/btn:bg-stone-100 transition-colors relative">
                                        <AnimatePresence mode="wait">
                                            {copied ? (
                                                <motion.div
                                                    key="check"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                >
                                                    <Check size={18} className="text-green-500" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="copy"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                >
                                                    <Copy size={18} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <span className="text-sm font-medium border-b border-stone-200 group-hover/btn:border-stone-400 transition-all">
                                        {copied ? 'Kopyalandı!' : 'Adresi Kopyala'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </Section>
    );
};
