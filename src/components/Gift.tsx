import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { content } from '../content';

export const Gift: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleChipClick = (val: number) => {
        setAmount(val.toString());
    };

    const handlePayment = async () => {
        if (!amount || Number(amount) < 10) return;

        setLoading(true);

        try {
            // In Phase 3, this will call /api/create-payment
            // For now, we mock the behavior or just alert
            /* 
            const res = await fetch('/api/create-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount, currency: 'TRY' })
            });
            const data = await res.json();
            if (data.html) { ... }
            */

            console.log('Processing payment for:', amount);
            alert('Shopier entegrasyonu Phase 3\'te eklenecek.');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="gift" className="relative py-24 px-6 bg-gradient-to-b from-white to-rose-50/30">
            <div className="max-w-xl mx-auto text-center space-y-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                >
                    <span className="text-rose-500 text-xs tracking-[0.2em] uppercase font-semibold">
                        {content.gift.title}
                    </span>
                    <p className="text-2xl md:text-3xl font-serif text-text-primary leading-snug">
                        "{content.gift.sub}"
                    </p>
                </motion.div>

                {/* Gift Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-rose-200/20 border border-rose-100"
                >
                    {/* Chip Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                        {content.gift.chips.map((chip) => (
                            <button
                                key={chip}
                                onClick={() => handleChipClick(chip)}
                                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${amount === chip.toString()
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                                    : 'bg-rose-50 text-rose-900/60 hover:bg-rose-100'
                                    }`}
                            >
                                {chip} ₺
                            </button>
                        ))}
                    </div>

                    {/* Custom Input */}
                    <div className="relative mb-8 group">
                        <label className="block text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2 text-left px-1">
                            {content.gift.customLabel}
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-2xl text-rose-300 font-light">₺</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="w-full bg-rose-50/30 text-4xl font-serif text-rose-950 pl-10 pr-4 py-4 rounded-2xl border-2 border-transparent focus:border-rose-200 focus:bg-white transition-all outline-none placeholder:text-rose-200"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handlePayment}
                        disabled={!amount || loading}
                        className="w-full py-4 bg-rose-950 text-white rounded-xl font-medium text-lg shadow-xl shadow-rose-950/10 hover:bg-rose-900 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'İşleniyor...' : content.gift.button}
                    </button>

                    <p className="mt-6 text-xs text-text-secondary/60 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        {content.gift.note}
                    </p>
                </motion.div>

            </div>
        </section>
    );
};
