import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';
import { User, Hash, ArrowRight, ArrowLeft, Eye, EyeOff, Waves, Star, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export const GuestLogin = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [showRoom, setShowRoom] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { setGuestInfo } = useGuest();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && room) {
            setIsLoading(true);
            setTimeout(() => {
                setGuestInfo(name, room);
                navigate('/guest');
            }, 800);
        }
    };

    const perks = [
        { icon: <Waves size={18} />, text: 'Pool & Spa Access' },
        { icon: <Coffee size={18} />, text: 'In-Room Dining' },
        { icon: <Star size={18} />, text: 'Concierge 24/7' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left — Hero Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
                <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80"
                    alt="Resort"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/60 to-slate-900/80" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                        <span className="font-serif font-bold text-2xl text-white">B</span>
                    </div>
                    <span className="font-serif font-bold text-2xl text-white tracking-tight">Blue Beach</span>
                </div>

                {/* Center Content */}
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-bold uppercase tracking-widest mb-6">
                            Guest Portal
                        </span>
                        <h2 className="text-5xl font-serif font-bold text-white leading-tight mb-6">
                            Your Luxury <br />
                            <span className="text-blue-300 italic font-light">Awaits</span>
                        </h2>
                        <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-sm">
                            Sign in to access room service, dining reservations, spa bookings and your personal concierge.
                        </p>
                        <div className="flex flex-col gap-4">
                            {perks.map((p, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.15 }}
                                    className="flex items-center gap-3 text-white/80"
                                >
                                    <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 text-blue-300">
                                        {p.icon}
                                    </div>
                                    <span className="font-medium">{p.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Rating */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 w-fit">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#FCD34D" className="text-yellow-300" />)}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">4.9 / 5.0</p>
                            <p className="text-white/60 text-xs">2,400+ guest reviews</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-80 translate-y-1/2 -translate-x-1/2" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Mobile Logo */}
                    <div className="flex lg:hidden items-center gap-2 mb-8">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-serif font-bold text-lg text-white">B</div>
                        <span className="font-serif font-bold text-xl text-slate-800">Blue Beach</span>
                    </div>

                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium mb-8 transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="mb-8">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 mb-6">
                            <User size={26} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Welcome Back</h1>
                        <p className="text-slate-500">Sign in with your name and room number</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Sophia Carter"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Room */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Room Number</label>
                                <div className="relative group">
                                    <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type={showRoom ? 'text' : 'password'}
                                        value={room}
                                        onChange={e => setRoom(e.target.value)}
                                        placeholder="e.g. 402"
                                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowRoom(!showRoom)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                                    >
                                        {showRoom ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base mt-2 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing In…
                                    </>
                                ) : (
                                    <>
                                        Access My Portal
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                            <p className="text-slate-500 text-sm">
                                New guest?{' '}
                                <Link to="/guest/signup" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Trust badge */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </div>
                        Secure connection · Blue Beach Resort
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
