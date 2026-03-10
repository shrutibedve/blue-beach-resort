import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const ROLES = ['Staff', 'Concierge', 'Manager', 'Chef', 'Security', 'Admin'];

export const StaffSignup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Staff', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (field: string, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email) {
            setIsLoading(true);
            setTimeout(() => {
                localStorage.setItem('staff_auth', 'true');
                navigate('/admin/dashboard');
            }, 900);
        }
    };

    const accessLevels = [
        { role: 'Staff', desc: 'Basic operations access', color: 'bg-slate-500/20 text-slate-400' },
        { role: 'Concierge', desc: 'Guest services & requests', color: 'bg-blue-500/20 text-blue-400' },
        { role: 'Manager', desc: 'Full department access', color: 'bg-violet-500/20 text-violet-400' },
        { role: 'Admin', desc: 'System-wide privileges', color: 'bg-amber-500/20 text-amber-400' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left — Dark Info Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-slate-950">
                <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30">
                        <Shield size={22} className="text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-white text-lg tracking-tight">Blue Beach</span>
                        <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Staff Portal</p>
                    </div>
                </div>

                {/* Center */}
                <div className="relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
                            <Shield size={12} className="text-violet-400" />
                            <span className="text-violet-400 text-xs font-bold uppercase tracking-widest">New Registration</span>
                        </div>
                        <h2 className="text-5xl font-bold text-white leading-tight mb-4">
                            Join the<br />
                            <span className="text-blue-400">Team</span>
                        </h2>
                        <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm">
                            Register your credentials to access the internal management dashboard. Your request will be reviewed by an admin.
                        </p>

                        {/* Access Levels */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Access Levels</p>
                            {accessLevels.map((a, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-3"
                                >
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${a.color}`}>{a.role}</span>
                                    <span className="text-slate-400 text-sm">{a.desc}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom */}
                <div className="relative z-10">
                    <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl px-5 py-4">
                        <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-blue-300/70 text-xs leading-relaxed">
                            All staff registrations are reviewed within 24 hours. You will receive an email confirmation once your access is approved.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#0f172a] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />

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
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Staff Portal</p>
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
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Staff Registration</h1>
                        <p className="text-slate-400">Request internal system access</p>
                    </div>

                    <div className="bg-slate-800/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input type="text" value={formData.name} onChange={e => handleChange('name', e.target.value)}
                                        placeholder="Employee Name"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/80 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        required />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Work Email</label>
                                <div className="relative group">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)}
                                        placeholder="you@resort.internal"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-900/80 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        required />
                                </div>
                            </div>

                            {/* Role + Password */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Department Role</label>
                                    <div className="relative">
                                        <select value={formData.role} onChange={e => handleChange('role', e.target.value)}
                                            className="w-full px-4 py-3.5 bg-slate-900/80 border border-slate-700 rounded-2xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none text-sm">
                                            {ROLES.map(r => <option key={r}>{r}</option>)}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                                    <div className="relative group">
                                        <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input type={showPw ? 'text' : 'password'} value={formData.password} onChange={e => handleChange('password', e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-9 pr-9 py-3.5 bg-slate-900/80 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                            required />
                                        <button type="button" onClick={() => setShowPw(!showPw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors">
                                            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading}
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 border border-blue-500/50 hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-2 disabled:opacity-70">
                                {isLoading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Registering…</>
                                ) : (
                                    <>Request Access <Shield size={20} /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-700/60 text-center">
                            <p className="text-slate-400 text-sm">
                                Already authorized?{' '}
                                <Link to="/staff/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
                                    Staff Login
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
