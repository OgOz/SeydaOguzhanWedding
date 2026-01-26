import React, { useRef } from 'react';
import { Section } from '../components/Section';
import { Calendar, MapPin } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Content } from '../content';

interface DetailsProps {
    isAfterParty?: boolean;
    data: {
        date: string;
        weekday: string;
        time: string;
        timeLabel: string;
        locationName: string;
        locationDistrict: string;
        locationMapLink: string;
        calendar: {
            title: string;
            description: string;
            location: string;
            start: string;
            end: string;
        }
    };
    content: Content;
}

export const Details: React.FC<DetailsProps> = ({ isAfterParty, data, content }) => {
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
        const { calendar } = data;
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding//SeydaOguzhan//TR
BEGIN:VEVENT
SUMMARY:${calendar.title}
DESCRIPTION:${calendar.description}
LOCATION:${calendar.location}
DTSTART:${calendar.start}
DTEND:${calendar.end}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `${isAfterParty ? 'after_party' : 'seyda_oguzhan_wedding'}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Section id="details" className={`relative z-20 pt-24 pb-32 transition-colors duration-700 ${isAfterParty ? 'bg-[#0a0508]' : 'bg-white'}`}>
            <div ref={containerRef} className="max-w-6xl mx-auto px-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                    {/* ZAMAN KARTI */}
                    <div className={`detail-card rounded-[2.5rem] border p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-colors ${isAfterParty ? 'bg-purple-950/10 border-purple-500/20 shadow-purple-500/5' : 'bg-white border-stone-100'}`}>
                        <div>
                            <span className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-12 block font-sans ${isAfterParty ? 'text-purple-400' : 'text-rose-400'}`}>
                                {content.detailsSection.timeTitle}
                            </span>

                            <div className="mb-12">
                                <h3 className={`text-5xl md:text-6xl font-serif mb-4 tracking-tight ${isAfterParty ? 'text-white' : 'text-stone-800'}`}>{data.date}</h3>
                                <p className={`text-xl font-serif italic ${isAfterParty ? 'text-purple-200/60' : 'text-stone-400'}`}>{data.weekday}</p>
                            </div>

                            <div className={`w-full h-px mb-12 ${isAfterParty ? 'bg-purple-500/10' : 'bg-stone-50'}`} />

                            <div className="flex items-center gap-6 mb-12">
                                <span className={`text-4xl font-serif font-medium tracking-tight ${isAfterParty ? 'text-white' : 'text-stone-800'}`}>{data.time}</span>
                                <span className={`px-5 py-2 text-[10px] font-extrabold rounded-full uppercase tracking-[0.2em] ${isAfterParty ? 'bg-purple-500/20 text-purple-300' : 'bg-rose-50/50 text-rose-400'}`}>
                                    {data.timeLabel}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCalendar}
                            className={`flex items-center gap-4 transition-all group/btn w-fit ${isAfterParty ? 'text-purple-300/80 hover:text-purple-400' : 'text-stone-400 hover:text-rose-500'}`}
                        >
                            <div className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-colors ${isAfterParty ? 'bg-purple-900/20 group-hover/btn:bg-purple-800/30 border-purple-500/20' : 'bg-stone-50 group-hover/btn:bg-rose-50 border-stone-100/50'}`}>
                                <Calendar size={18} className="transition-colors" />
                            </div>
                            <span className={`text-sm font-medium border-b py-0.5 ${isAfterParty ? 'border-purple-300/30 group-hover/btn:border-purple-400' : 'border-stone-200 group-hover/btn:border-rose-200'}`}>
                                {content.detailsSection.calendarBtn}
                            </span>
                        </button>
                    </div>

                    {/* MEKÂN KARTI */}
                    <div className={`detail-card rounded-[2.5rem] border p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-colors ${isAfterParty ? 'bg-purple-950/10 border-purple-500/20 shadow-purple-500/5' : 'bg-white border-stone-100'}`}>
                        <div>
                            <span className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-12 block font-sans ${isAfterParty ? 'text-purple-400' : 'text-rose-400'}`}>
                                {content.detailsSection.locationTitle}
                            </span>

                            <div className="mb-12">
                                <h3 className={`text-4xl md:text-5xl font-serif mb-4 leading-[1.15] tracking-tight ${isAfterParty ? 'text-white' : 'text-stone-800'}`}>{data.locationName}</h3>
                                <p className={`text-xl font-serif italic ${isAfterParty ? 'text-purple-200/60' : 'text-stone-400'}`}>{data.locationDistrict}</p>
                            </div>

                            <div className={`w-full h-px mb-12 ${isAfterParty ? 'bg-purple-500/10' : 'bg-stone-50'}`} />

                            <a
                                href={data.locationMapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-4 transition-all group/link w-fit ${isAfterParty ? 'text-purple-400 hover:text-purple-300' : 'text-rose-400 hover:text-rose-500'}`}
                            >
                                <div className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-colors ${isAfterParty ? 'bg-purple-900/30 border-purple-500/30 group-hover/link:bg-purple-800/40' : 'bg-rose-50 border-rose-100/50 group-hover/link:bg-rose-100/50'}`}>
                                    <MapPin size={18} />
                                </div>
                                <span className={`text-sm font-semibold border-b py-0.5 ${isAfterParty ? 'border-purple-500/30 group-hover/link:border-purple-300' : 'border-rose-200 group-hover/link:border-rose-400'}`}>
                                    {content.detailsSection.directionsBtn}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

