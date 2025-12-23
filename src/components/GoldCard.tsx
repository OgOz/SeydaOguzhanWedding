import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface GoldCardProps {
    title: string;
    price?: string;
    paymentLink: string;
    variant: 'gram' | 'quarter' | 'half' | 'full';
}

export const GoldCard: React.FC<GoldCardProps> = ({ title, price, paymentLink, variant }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: cardRef });

    const getGradient = () => {
        switch (variant) {
            case 'gram': return 'from-yellow-100 to-yellow-300';
            case 'quarter': return 'from-yellow-200 to-yellow-400';
            case 'half': return 'from-amber-200 to-amber-500';
            case 'full': return 'from-amber-300 to-amber-600';
            default: return 'from-yellow-200 to-yellow-400';
        }
    };

    const onEnter = contextSafe(() => {
        gsap.to(cardRef.current, { y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", duration: 0.3 });
    });

    const onLeave = contextSafe(() => {
        gsap.to(cardRef.current, { y: 0, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", duration: 0.3 });
    });

    return (
        <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
        >
            <div
                ref={cardRef}
                className="relative bg-white p-6 rounded-2xl shadow-sm border border-gold-100 overflow-hidden transition-colors"
            >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getGradient()}`} />

                <div className="flex flex-col items-center space-y-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center shadow-inner`}>
                        <div className="w-12 h-12 rounded-full border-2 border-white/50" />
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl font-bold text-dark-800 group-hover:text-gold-600 transition-colors">{title}</h3>
                        {price && <p className="text-stone-500 mt-1">{price}</p>}
                    </div>

                    <div className="px-6 py-2 bg-stone-50 text-gold-600 rounded-full text-sm font-medium group-hover:bg-gold-50 transition-colors">
                        Hediye Et
                    </div>
                </div>
            </div>
        </a>
    );
};
