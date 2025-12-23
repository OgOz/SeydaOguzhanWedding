import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className, onClick }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const { contextSafe } = useGSAP({ scope: buttonRef });

    const onMouseMove = contextSafe((e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = buttonRef.current!.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        gsap.to(buttonRef.current, {
            x: x * 0.2, // Move button slightly
            y: y * 0.2,
            duration: 1,
            ease: "power3.out"
        });

        if (textRef.current) {
            gsap.to(textRef.current, {
                x: x * 0.1, // Move text slightly less for parallax
                y: y * 0.1,
                duration: 1,
                ease: "power3.out"
            });
        }
    });

    const onMouseLeave = contextSafe(() => {
        gsap.to([buttonRef.current, textRef.current], {
            x: 0,
            y: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)"
        });
    });

    return (
        <button
            ref={buttonRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={`relative px-8 py-4 rounded-full overflow-hidden transition-colors ${className}`}
        >
            <span ref={textRef} className="relative z-10 inline-block pointer-events-none">
                {children}
            </span>
        </button>
    );
};
