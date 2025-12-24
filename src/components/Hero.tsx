import React from 'react';
import { motion } from 'framer-motion';
import { content } from '../content';
import { HoldButton } from './HoldButton';
import { generateICS } from '../utils/ics';

export const Hero: React.FC = () => {
    const scrollToDetails = () => {
        document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
    };

    const openCalendar = () => {
        generateICS(content.date.calendar);
    };

    return (
        <section className="relative z-10 w-full min-h-[100svh] flex flex-col items-center justify-between py-12 px-6 overflow-hidden bg-bg-primary text-text-primary">

            {/* Top Content */}
            <div className="flex flex-col items-center flex-grow-[2] justify-center text-center space-y-8 mt-12 md:mt-0">
                <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-xs md:text-sm tracking-[0.3em] uppercase text-text-secondary font-sans"
                >
                    {content.hero.eyebrow}
                </motion.span>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="space-y-2"
                >
                    <h1 className="text-6xl md:text-8xl font-serif text-text-primary leading-[1.1]">
                        {content.names.bride}
                        <span className="block text-4xl md:text-5xl my-2 text-rose-400 font-light">&</span>
                        {content.names.groom}
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-lg md:text-xl text-text-secondary font-serif italic"
                >
                    {content.hero.sub}
                </motion.p>
            </div>

            {/* Interactive Heart */}
            <div className="flex-grow-[3] flex items-center justify-center w-full max-w-md mx-auto relative">
                <HoldButton className="z-10" onComplete={scrollToDetails} />
            </div>

            {/* Signature & Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col items-center space-y-8 flex-grow-0 w-full mb-8"
            >
                <p className="text-sm md:text-base text-rose-500 font-medium tracking-wide">
                    {content.hero.signature}
                </p>

                <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
                    <button
                        onClick={scrollToDetails}
                        className="px-6 py-3 rounded-full border border-rose-200 text-text-secondary text-sm hover:bg-rose-50 hover:border-rose-300 transition-all duration-300"
                    >
                        {content.hero.cta.details}
                    </button>

                    <button
                        onClick={openCalendar}
                        className="px-6 py-3 rounded-full border border-rose-200 text-text-secondary text-sm hover:bg-rose-50 hover:border-rose-300 transition-all duration-300"
                    >
                        {content.hero.cta.calendar}
                    </button>
                </div>
            </motion.div>
        </section>
    );
};
