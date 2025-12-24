import React, { useRef } from 'react';
import { Section } from '../components/Section';
import { Calendar } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const Details: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

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
        // Optional: Add toast notification Logic here if needed
    };

    const handleCalendar = () => {
        // Create ICS file content
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
        <Section id="details" className="relative z-20 bg-white -mt-4 pt-12 pb-24">
            <div ref={containerRef} className="max-w-6xl mx-auto px-4 md:px-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                    {/* ZAMAN Card */}
                    <div className="detail-card bg-white rounded-[2rem] border border-rose-100 p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full min-h-[320px]">
                        <div>
                            <span className="text-xs font-bold text-rose-400 tracking-[0.2em] uppercase mb-8 block">ZAMAN</span>

                            <div className="mb-8">
                                <h3 className="text-4xl md:text-5xl font-serif text-rose-950 mb-2">7 Şubat 2026</h3>
                                <p className="text-stone-500 font-medium">Cumartesi</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-rose-50 pt-8 mt-auto">
                                <span className="text-2xl font-serif text-rose-950 font-medium">16:30</span>
                                <span className="px-4 py-1.5 bg-rose-50 text-rose-500 text-xs font-bold rounded-full uppercase tracking-wider">Nikâh Başlangıcı</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCalendar}
                            className="flex items-center gap-2 text-stone-500 hover:text-rose-600 transition-colors mt-8 group w-fit"
                        >
                            <Calendar size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium border-b border-transparent group-hover:border-rose-200">Takvime Ekle (.ics)</span>
                        </button>
                    </div>

                    {/* MEKAN Card */}
                    <div className="detail-card bg-white rounded-[2rem] border border-rose-100 p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full min-h-[320px]">
                        <div>
                            <span className="text-xs font-bold text-rose-400 tracking-[0.2em] uppercase mb-8 block">MEKÂN</span>

                            <div className="mb-8">
                                <h3 className="text-3xl md:text-4xl font-serif text-rose-950 mb-3 leading-tight">Tarık Akan Nikâh Salonu</h3>
                                <p className="text-stone-500 font-medium">Bakırköy, İstanbul</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 mt-auto pt-8 border-t border-rose-50">
                            <a
                                href="https://maps.app.goo.gl/xyz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-rose-500 hover:text-rose-700 transition-colors group w-fit"
                            >
                                <span className="text-sm font-medium border-b border-rose-200 group-hover:border-rose-400">Haritada Yol Tarifi</span>
                            </a>

                            <button
                                onClick={handleCopyAddress}
                                className="flex items-center gap-2 text-stone-500 hover:text-rose-600 transition-colors group w-fit"
                            >
                                <span className="text-sm font-medium border-b border-transparent group-hover:border-rose-200">Adresi Kopyala</span>
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </Section>
    );
};
