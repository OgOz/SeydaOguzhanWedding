import React, { useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className, id }) => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(sectionRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    }, { scope: sectionRef });

    return (
        <section id={id} ref={sectionRef} className={twMerge("py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto translate-y-8", className)}>
            {children}
        </section>
    );
};
