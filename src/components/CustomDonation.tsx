import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomDonation: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleDonate = () => {
        if (!amount) return;
        // In a real app, this would redirect to a payment processor
        window.open('#', '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-8 p-8 md:p-10 max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(202,134,157,0.15)] border border-rose-100/50"
        >
            <div className="flex flex-col items-center">
                <h3 className="text-xl text-center text-stone-600 font-light mb-8">
                    Farklı bir tutar iletmek isterseniz
                </h3>

                <div className="relative w-full max-w-[240px] mb-8 group">
                    <div
                        className={`absolute inset-x-0 bottom-0 h-0.5 bg-rose-200 transition-colors duration-300 ${isFocused ? 'bg-rose-500' : ''}`}
                    />

                    <div className="flex items-baseline justify-center gap-2 pb-2">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="0"
                            className="w-32 text-center text-5xl font-serif text-rose-950 bg-transparent border-none outline-none placeholder:text-rose-200/50 p-0 m-0"
                            min="0"
                        />
                        <span className="text-2xl text-rose-400 font-light select-none">TL</span>
                    </div>
                </div>

                <AnimatePresence>
                    {amount && (
                        <motion.button
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onClick={handleDonate}
                            className="w-full py-4 bg-rose-500 text-white rounded-2xl font-medium text-lg tracking-wide shadow-lg shadow-rose-500/25 hover:bg-rose-600 hover:shadow-rose-600/30 transition-all active:scale-[0.98]"
                        >
                            Gönder
                        </motion.button>
                    )}
                </AnimatePresence>

                {!amount && (
                    <div className="h-[60px] flex items-center justify-center text-sm text-rose-300/60 font-medium italic">
                        Tutar giriniz
                    </div>
                )}
            </div>
        </motion.div>
    );
};
