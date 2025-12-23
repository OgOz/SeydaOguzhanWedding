import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const CustomDonation: React.FC = () => {
    const [amount, setAmount] = useState('');
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { contextSafe } = useGSAP({ scope: buttonRef });

    const handleDonate = () => {
        if (!amount) return;
        console.log(`Donating ${amount} TL`);
        window.open('#', '_blank');
    };

    const onEnter = contextSafe(() => {
        gsap.to(buttonRef.current, { scale: 1.02, duration: 0.2 });
    });

    const onLeave = contextSafe(() => {
        gsap.to(buttonRef.current, { scale: 1, duration: 0.2 });
    });

    const onPress = contextSafe(() => {
        gsap.to(buttonRef.current, { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1 });
    });

    return (
        <div className="mt-8 p-8 max-w-xl mx-auto bg-stone-50 rounded-2xl border border-dashed border-gold-300">
            <h3 className="text-xl font-semibold text-center text-dark-800 mb-6">Farklı Bir Tutar Hediye Etmek İster misiniz?</h3>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-semibold">₺</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Tutar giriniz"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white transition-shadow"
                    />
                </div>

                <button
                    ref={buttonRef}
                    onClick={handleDonate}
                    onMouseEnter={onEnter}
                    onMouseLeave={onLeave}
                    onMouseDown={onPress}
                    className="px-8 py-3 bg-dark-900 text-white rounded-xl font-medium hover:bg-dark-800 transition-colors shadow-lg shadow-dark-900/10"
                >
                    Gönder
                </button>
            </div>
        </div>
    );
};
