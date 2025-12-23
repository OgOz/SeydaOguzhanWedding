import React, { useRef } from 'react';
import { Section } from '../components/Section';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MagneticButton } from '../components/MagneticButton';

export const Details: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".detail-item", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            },
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out"
        });

        gsap.from(".line-separator", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            },
            scaleX: 0,
            opacity: 0,
            duration: 1.5,
            ease: "expo.out"
        });

    }, { scope: containerRef });

    return (
        <Section id="details" className="relative z-20 bg-white rounded-t-[3rem] -mt-10 pt-24 pb-32 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
            <div ref={containerRef} className="max-w-5xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-8">

                    {/* Date */}
                    <div className="detail-item flex-1 w-full text-center md:text-left group">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                            <span className="p-3 bg-stone-50 rounded-full text-gold-600 group-hover:bg-gold-50 transition-colors">
                                <Calendar size={24} />
                            </span>
                            <span className="text-sm font-semibold text-gold-600 uppercase tracking-wider">Tarih</span>
                        </div>
                        <h3 className="text-4xl font-serif text-dark-900 mb-2">7 Şubat 2026</h3>
                        <p className="text-stone-500">Cumartesi günü, en mutlu günümüz.</p>
                    </div>

                    <div className="hidden md:block w-px h-32 bg-stone-200 line-separator origin-top"></div>

                    {/* Time */}
                    <div className="detail-item flex-1 w-full text-center md:text-left group">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                            <span className="p-3 bg-stone-50 rounded-full text-gold-600 group-hover:bg-gold-50 transition-colors">
                                <Clock size={24} />
                            </span>
                            <span className="text-sm font-semibold text-gold-600 uppercase tracking-wider">Saat</span>
                        </div>
                        <h3 className="text-4xl font-serif text-dark-900 mb-2">14:00</h3>
                        <p className="text-stone-500">Nikah töreni başlangıcı.</p>
                    </div>

                </div>

                <div className="w-full h-px bg-stone-200 my-12 line-separator origin-left"></div>

                {/* Location */}
                <div className="detail-item flex flex-col md:flex-row items-center justify-between gap-8 bg-stone-50 p-8 md:p-12 rounded-3xl border border-dashed border-stone-200">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                            <span className="p-3 bg-white rounded-full text-gold-600 shadow-sm">
                                <MapPin size={24} />
                            </span>
                            <span className="text-sm font-semibold text-gold-600 uppercase tracking-wider">Mekan</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-serif text-dark-900 mb-2">Tarık Akan Nikah Salonu</h3>
                        <p className="text-stone-500">Bakırköy, İstanbul</p>
                    </div>

                    <MagneticButton
                        onClick={() => window.open("https://share.google/MXRr4EekYQFK7N9TJ", "_blank")}
                        className="bg-dark-900 text-white hover:bg-dark-800 min-w-[200px]"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <span>Haritada Aç</span>
                            <ArrowRight size={18} />
                        </div>
                    </MagneticButton>
                </div>

            </div>
        </Section>
    );
};
