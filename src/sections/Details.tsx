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

                <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
                    <p className="text-2xl md:text-3xl font-serif italic text-gold-600 leading-relaxed">
                        "Gelin, birlikte kutlayalım,<br />kahkaha serbest, duygulanmak normal."
                    </p>
                </div>

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
                        <h3 className="text-4xl font-serif text-dark-900 mb-2">16:30</h3>
                        <p className="text-stone-500">Nikah töreni başlangıcı.</p>
                    </div>

                </div>

                <div className="w-full h-px bg-stone-200 my-12 line-separator origin-left"></div>

                {/* Location with Map */}
                <div className="detail-item flex flex-col gap-8 bg-stone-50 p-8 md:p-12 rounded-3xl border border-dashed border-gold-300/50">
                    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
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
                            onClick={() => window.open("https://goo.gl/maps/xyz", "_blank")} // Ideally update this link if provided, using iframe for now
                            className="bg-white text-gold-600 border border-gold-200 hover:bg-gold-50 min-w-[180px]"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <span>Haritada Yol Tarifi</span>
                                <ArrowRight size={18} />
                            </div>
                        </MagneticButton>
                    </div>

                    {/* Integrated Map Frame */}
                    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-gold-200 relative group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3012.022060459553!2d28.851520876622743!3d40.98099777135443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa34de3054557%3A0x2fe1ee990a4772cf!2sTar%C4%B1k%20Akan%20Konferans%20Salonu!5e0!3m2!1str!2str!4v1766565419609!5m2!1str!2str"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                        {/* Overlay for aesthetic tint */}
                        <div className="absolute inset-0 bg-gold-600/10 pointer-events-none mix-blend-multiply group-hover:opacity-0 transition-opacity duration-700"></div>
                    </div>
                </div>

            </div>
        </Section>
    );
};
