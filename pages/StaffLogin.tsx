import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff, Activity, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export const StaffLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            setIsLoading(true);
            setTimeout(() => {
                localStorage.setItem('staff_auth', 'true');
                navigate('/admin/dashboard');
            }, 900);
        }
    };

    const stats = [
        { icon: <Users size={18} />, label: 'Guests Today', value: '142' },
        { icon: <Activity size={18} />, label: 'Live Ops Active', value: '98%' },
        { icon: <BarChart3 size={18} />, label: 'Satisfaction', value: '4.9★' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left — Dark Command Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-slate-950">
                {/* Ambient glows */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30">
                        <Shield size={22} className="text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-white text-lg tracking-tight">Blue Beach</span>
                        <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Staff Terminal</p>
                    </div>
                </div>

                {/* Center Content */}
                <div className="relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">System Online</span>
                        </div>
                        <h2 className="text-5xl font-bold text-white leading-tight mb-4">
                            Internal<br />
                            <span className="text-blue-400">Management</span><br />
                            Access
                        </h2>
                        <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
                            Authorized personnel only. Access resort operations, guest management, work orders and live dashboards.
                        </p>

                        {/* Live Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {stats.map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.15 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
                                >
                                    <div className="w-8 h-8 bg-blue-500/15 rounded-xl flex items-center justify-center text-blue-400 mx-auto mb-2">
                                        {s.icon}
                                    </div>
                                    <p className="text-xl font-bold text-white">{s.value}</p>
                                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom security notice */}
                <div className="relative z-10">
                    <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-4">
                        <Shield size={16} className="text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-amber-300/80 text-xs leading-relaxed">
                            This system is monitored. Unauthorized access attempts will be logged and reported. Session expires after 8 hours.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right — Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#0f172a] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Mobile Logo */}
                    <div className="flex lg:hidden items-center gap-3 mb-8">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Shield size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-base">Blue Beach</p>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Staff Terminal</p>
                        </div>
                    </div>

                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-400 text-sm font-medium mb-8 transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Portal Selection
                    </Link>

                    <div className="mb-8">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30 mb-6">
                            <Shield size={26} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Staff Terminal</h1>
                        <p className="text-slate-400">Internal Management Access Only</p>
                    </div>

                    <div className="bg-slate-800/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Internal Email</label>
                                <div className="relative group">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="email" value={email} onChange={e => setEmail(e.target.value)}
                                        placeholder="you@resort.internal"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/80 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Access Token</label>
                                    <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">Forgot password?</button>
                                </div>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••••"
                                        className="w-full pl-11 pr-12 py-3.5 bg-slate-900/80 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors">
                                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit" disabled={isLoading}
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 border border-blue-500/50 hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-2 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Authorizing…</>
                                ) : (
                                    <>Authorize Login <LogIn size={20} /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-700/60 text-center">
                            <p className="text-slate-400 text-sm">
                                New to the team?{' '}
                                <Link to="/staff/signup" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                                    Register clearance
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-center gap-2 text-slate-600 text-xs">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Secure · Encrypted · Monitored
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
