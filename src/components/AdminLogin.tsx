import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
    onLogin: () => void;
    onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState(false);

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const ENV_USER = import.meta.env.VITE_ADMIN_USERNAME;
        const ENV_PASS = import.meta.env.VITE_ADMIN_PASSWORD;

        if (loginUser === ENV_USER && loginPass === ENV_PASS) {
            onLogin();
            setLoginError(false);
        } else {
            setLoginError(true);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-stone-100">
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={onBack}
                className="absolute top-8 left-8 flex items-center gap-2 text-stone-500 hover:text-rose-500 transition-colors font-serif"
            >
                <ArrowLeft size={20} />
                Ana Sayfaya Dön
            </motion.button>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md relative overflow-hidden border border-rose-100"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-rose-500" />

                <h3 className="text-3xl font-serif text-rose-950 mb-2 text-center">Yönetici Girişi</h3>
                <p className="text-stone-400 text-center mb-8 text-sm uppercase tracking-widest font-sans">Wedding Dashboard</p>

                <form onSubmit={handleAdminLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-2 px-1">Kullanıcı Adı</label>
                        <input
                            type="text"
                            value={loginUser}
                            onChange={e => setLoginUser(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all text-base text-stone-800"
                            placeholder="Kullanıcı adınız"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-2 px-1">Şifre</label>
                        <input
                            type="password"
                            value={loginPass}
                            onChange={e => setLoginPass(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all text-base text-stone-800"
                            placeholder="••••••••"
                        />
                    </div>

                    {loginError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs font-bold text-center bg-red-50/50 py-3 rounded-xl border border-red-100 uppercase tracking-wider"
                        >
                            Hatalı kullanıcı adı veya şifre.
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-rose-500 text-white font-bold py-5 rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-200 active:scale-[0.98] text-lg mt-4"
                    >
                        Giriş Yap
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
