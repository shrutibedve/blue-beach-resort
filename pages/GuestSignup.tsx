import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';
import { User, Hash, Mail, ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const GuestSignup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', room: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { setGuestInfo } = useGuest();
    const navigate = useNavigate();

    const handleChange = (field: string, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.room) {
            setIsLoading(true);
            setTimeout(() => {
                setGuestInfo(formData.name, formData.room);
                navigate('/guest');
            }, 900);
        }
    };

    const benefits = [
        'Personalized room service ordering',
        'Table reservations at all restaurants',
        'Spa & wellness bookings',
        'Direct chat with your concierge',
        'Activity & excursion scheduling',
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left — Hero Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
                <img
                    src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80"
                    alt="Resort Pool"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/75 via-slate-900/55 to-slate-900/75" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                        <span className="font-serif font-bold text-2xl text-white">B</span>
                    </div>
                    <span className="font-serif font-bold text-2xl text-white tracking-tight">Blue Beach</span>
                </div>

                {/* Center Content */}
                <div className="relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="inline-block px-4 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6">
                            New Guest
                        </span>
                        <h2 className="text-5xl font-serif font-bold text-white leading-tight mb-6">
                            Begin Your <br />
                            <span className="text-blue-300 italic font-light">Journey</span>
                        </h2>
                        <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-sm">
                            Create your guest account and unlock all the luxury services Blue Beach has to offer.
                        </p>
                        <div className="flex flex-col gap-3">
                            {benefits.map((b, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-3 text-white/80 text-sm"
                                >
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                    {b}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom quote */}
                <div className="relative z-10">
                    <blockquote className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4">
                        <p className="text-white/80 text-sm italic leading-relaxed">
                            "The most seamless guest experience I've ever had at a resort."
                        </p>
                        <p className="text-white/50 text-xs mt-2 font-medium">— Guest review, Feb 2026</p>
                    </blockquote>
                </div>
            </div>

            {/* Right — Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60 -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-80 translate-y-1/2 translate-x-1/2" />

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
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 mb-6">
                            <User size={26} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-500">Start your luxury experience today</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                <div className="relative group">
                                    <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)}
                                        placeholder="e.g. Sophia Carter"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                        required />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                <div className="relative group">
                                    <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                        required />
                                </div>
                            </div>

                            {/* Room + Password side by side on md+ */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Room No.</label>
                                    <div className="relative group">
                                        <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input type="text" value={formData.room} onChange={e => handleChange('room', e.target.value)}
                                            placeholder="402"
                                            className="w-full pl-9 pr-3 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                                            required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                    <div className="relative group">
                                        <input type={showPw ? 'text' : 'password'} value={formData.password} onChange={e => handleChange('password', e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                                            required />
                                        <button type="button" onClick={() => setShowPw(!showPw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors">
                                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading}
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base mt-2 disabled:opacity-70">
                                {isLoading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Account…</>
                                ) : (
                                    <>Create My Account <ArrowRight size={20} /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                            <p className="text-slate-500 text-sm">
                                Already registered?{' '}
                                <Link to="/guest/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-slate-400">
                        By registering you agree to our{' '}
                        <span className="text-blue-500 cursor-pointer">Terms of Service</span> &{' '}
                        <span className="text-blue-500 cursor-pointer">Privacy Policy</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
