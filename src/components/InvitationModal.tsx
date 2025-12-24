import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InvitationModal: React.FC<InvitationModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-rose-100 flex justify-between items-center bg-rose-50/50">
                            <h3 className="text-rose-900 font-serif font-medium">Davetiye Kartı</h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-rose-100 rounded-full transition-colors text-rose-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        {/* Image Container */}
                        {/* Image Container */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-stone-100 flex items-center justify-center">
                            <div className="relative bg-white p-3 shadow-xl rotate-1 hover:rotate-0 transition-all duration-500 ease-out">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-rose-500/10 backdrop-blur-sm -rotate-3 z-10 border border-white/20"></div>
                                <img
                                    src="/davetiye.jpg"
                                    alt="Şeyda & Oğuzhan Davetiye"
                                    className="w-full h-auto max-w-[85vw] md:max-w-sm block shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-4 border-t border-rose-100 bg-white flex flex-col gap-3 text-center">
                            <p className="text-xs text-text-secondary">
                                Görseli kaydetmek için basılı tutun veya sağ tıklayın.
                            </p>
                            <a
                                href="/davetiye.jpg"
                                download="Seyda-Oguzhan-Davetiye.jpg"
                                className="w-full py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                Cihaza İndir
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
