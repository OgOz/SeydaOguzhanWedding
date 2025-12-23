import React, { useRef } from 'react';
import { Section } from '../components/Section';
import { GoldCard } from '../components/GoldCard';
import { CustomDonation } from '../components/CustomDonation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const Donation: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".donation-title", {
            scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
            y: 40, opacity: 0, duration: 1, ease: "power3.out"
        });

        gsap.from(".gold-grid > a", {
            scrollTrigger: { trigger: ".gold-grid", start: "top 85%" },
            y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)"
        });

    }, { scope: containerRef });

    return (
        <Section id="gift" className="relative z-20 pb-32">
            <div ref={containerRef}>
                <div className="donation-title text-center mb-16">
                    <span className="text-gold-600 uppercase tracking-widest text-sm font-semibold mb-4 block">Hediye</span>
                    <h2 className="text-5xl md:text-6xl font-serif text-dark-900 mb-6">Düğün Hediyesi</h2>
                    <p className="text-lg text-stone-600 max-w-xl mx-auto font-light leading-relaxed">
                        Yanımızda olmanız en büyük hediye. Arzu eden misafirlerimiz için dijital hediye seçenekleri:
                    </p>
                </div>

                <div className="gold-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 px-4">
                    <GoldCard title="Gram Altın" variant="gram" paymentLink="#" />
                    <GoldCard title="Çeyrek Altın" variant="quarter" paymentLink="#" />
                    <GoldCard title="Yarım Altın" variant="half" paymentLink="#" />
                    <GoldCard title="Tam Altın" variant="full" paymentLink="#" />
                </div>

                <CustomDonation />
            </div>
        </Section>
    );
};
