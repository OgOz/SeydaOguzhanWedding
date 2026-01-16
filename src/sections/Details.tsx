import React, { useRef } from 'react';
import { Section } from '../components/Section';
import { Calendar, MapPin } from 'lucide-react';
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
        <Section id="details" className="relative z-20 bg-white pt-24 pb-32">
            <div ref={containerRef} className="max-w-6xl mx-auto px-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                    {/* ZAMAN KARTI */}
                    <div className="detail-card bg-white rounded-[2.5rem] border border-stone-100 p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-bold text-rose-400 tracking-[0.3em] uppercase mb-12 block font-sans">ZAMAN</span>

                            <div className="mb-12">
                                <h3 className="text-5xl md:text-6xl font-serif text-stone-800 mb-4 tracking-tight">7 Şubat 2026</h3>
                                <p className="text-stone-400 text-xl font-serif italic">Cumartesi</p>
                            </div>

                            <div className="w-full h-px bg-stone-50 mb-12" />

                            <div className="flex items-center gap-6 mb-12">
                                <span className="text-4xl font-serif text-stone-800 font-medium tracking-tight">16:30</span>
                                <span className="px-5 py-2 bg-rose-50/50 text-rose-400 text-[10px] font-extrabold rounded-full uppercase tracking-[0.2em]">
                                    Nikâh Başlangıcı
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCalendar}
                            className="flex items-center gap-4 text-stone-400 hover:text-rose-500 transition-all group/btn w-fit"
                        >
                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-50 group-hover/btn:bg-rose-50 transition-colors border border-stone-100/50">
                                <Calendar size={18} className="text-stone-400 group-hover/btn:text-rose-500 transition-colors" />
                            </div>
                            <span className="text-sm font-medium border-b border-stone-200 group-hover/btn:border-rose-200 py-0.5">Takvime Ekle (.ics)</span>
                        </button>
                    </div>

                    {/* MEKÂN KARTI */}
                    <div className="detail-card bg-white rounded-[2.5rem] border border-stone-100 p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-bold text-rose-400 tracking-[0.3em] uppercase mb-12 block font-sans">MEKÂN</span>

                            <div className="mb-12">
                                <h3 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4 leading-[1.15] tracking-tight">Tarık Akan Nikâh Salonu</h3>
                                <p className="text-stone-400 text-xl font-serif italic">Bakırköy, İstanbul</p>
                            </div>

                            <div className="w-full h-px bg-stone-50 mb-12" />

                            <a
                                href="https://maps.app.goo.gl/TvXrBjn2bMpvadt66"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 text-rose-400 hover:text-rose-500 transition-all group/link w-fit"
                            >
                                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 transition-colors border border-rose-100/50 group-hover/link:bg-rose-100/50">
                                    <MapPin size={18} />
                                </div>
                                <span className="text-sm font-semibold border-b border-rose-200 group-hover/link:border-rose-400 py-0.5">Haritada Yol Tarifi</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};
