import React, { useRef } from 'react';
import { Section } from '../components/Section';
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

        // Removed gold-grid animation since elements are removed.

    }, { scope: containerRef });

    return (
        <Section id="gift" className="relative z-20 pb-32">
            <div ref={containerRef}>
                <div className="donation-title text-center mb-12">
                    <span className="text-gold-600 uppercase tracking-widest text-sm font-semibold mb-4 block">Hediye</span>
                    <h2 className="text-5xl md:text-6xl font-serif text-dark-900 mb-6">Düğün Hediyesi</h2>
                    <p className="text-lg text-stone-600 max-w-xl mx-auto font-light leading-relaxed italic">
                        "Dilerseniz çam sakızı çoban armağanı..."
                    </p>
                    <p className="text-sm text-stone-500 max-w-lg mx-auto mt-4 font-light">
                        Yanımızda olmanız en büyük hediye. Arzu eden misafirlerimiz için hediye seçeneği:
                    </p>
                </div>

                <div className="px-4 max-w-xl mx-auto">
                    <CustomDonation />
                </div>
            </div>
        </Section>
    );
};
