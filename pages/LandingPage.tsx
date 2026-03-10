import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, ChevronRight, Star, User, Shield, ArrowRight,
    MapPin, Waves, Utensils, Calendar, Clock, Phone, Mail
} from 'lucide-react';

// ─── Static Data ─────────────────────────────────────────────────────────────

const GALLERY_ITEMS = [
    { id: 0, title: 'Infinity Pool at Dusk', span: 'col-span-12 md:col-span-8', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&q=80' },
    { id: 1, title: 'Ocean Front Spa', span: 'col-span-12 md:col-span-4', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80' },
    { id: 2, title: 'Sky Lounge Panorama', span: 'col-span-12 md:col-span-4', img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80' },
    { id: 3, title: 'Oceanic Master Suite', span: 'col-span-12 md:col-span-8', img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80' },
    { id: 4, title: 'Azure Grill Fine Dining', span: 'col-span-12 md:col-span-6', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80' },
    { id: 5, title: 'Luna Rooftop Bar', span: 'col-span-12 md:col-span-6', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80' },
    { id: 6, title: 'Private Beach Dinner', span: 'col-span-12 md:col-span-5', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80' },
    { id: 7, title: 'Coral Reef Villa', span: 'col-span-12 md:col-span-7', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?w=1200&q=80' },
];

const AMENITIES: Record<string, any> = {
    'Ocean Front Spa': {
        title: 'Ocean Front Spa',
        img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80',
        color: 'from-blue-400 to-cyan-400',
        desc: 'Indulge in world-class holistic treatments while the rhythmic sound of ocean waves soothes your senses. Our team of certified therapists curates every session to restore balance and deep relaxation.',
        features: [
            'Oceanview treatment rooms', 'Hot stone & deep-tissue massage', "Couple's spa packages",
            'Aromatherapy & hydrotherapy', 'Ayurvedic rituals', 'Private outdoor bathtub',
            'Certified wellness therapists', 'Organic product lines'
        ],
        time: 'Open Daily: 07:00 – 21:00',
    },
    'Infinity Pool': {
        title: 'Infinity Pool',
        img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&q=80',
        color: 'from-cyan-400 to-blue-600',
        desc: 'Our signature 52-metre infinity pool seamlessly blends with the Mediterranean horizon. Sip cocktails from the in-pool bar as the sun melts into the sea each evening.',
        features: [
            '52-metre horizon infinity edge', 'Heated to 28°C year-round', 'In-pool cocktail bar',
            'Private cabanas available', 'Poolside butler service', 'Sunrise yoga sessions',
            "Separate children's pool", 'Lifeguard on duty 08:00-20:00'
        ],
        time: 'Open Daily: 06:00 – 22:00',
    },
    'Sky Lounge': {
        title: 'Sky Lounge',
        img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=1200&q=80',
        color: 'from-violet-500 to-indigo-600',
        desc: 'Perched on the 18th floor, the Sky Lounge offers exclusive access to craft cocktails, curated spirits and 360-degree panoramic views of the coastline and Amalfi cliffs.',
        features: [
            '360° panoramic rooftop views', 'Signature craft cocktails', 'Live DJ sets (Fri & Sat)',
            'Premium cigar lounge', 'Michelin sommelier on-site', 'Private event hire',
            'Dress code: smart casual', 'Non-alcoholic mocktail menu'
        ],
        time: 'Open Daily: 16:00 – 02:00',
    },
};

const SUITES: Record<string, any> = {
    'Oceanic Master Suite': {
        title: 'Oceanic Master Suite',
        img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80',
        color: 'from-blue-400 to-teal-400',
        desc: 'Our crown jewel — a 220 m² sanctuary with panoramic Amalfi coastline views, a private infinity plunge pool on the terrace, and bespoke Italian furnishings curated from the finest ateliers.',
        features: [
            '220 m² living space', 'Private infinity plunge pool', 'Floor-to-ceiling ocean views',
            'Italian marble bathroom', 'Smart home automation', 'Butler service 24/7',
            'Complimentary minibar', 'King-size canopy bed', 'Rain shower & soaking tub'
        ],
        price: '$1,200',
    },
    'Azure Terrace Room': {
        title: 'Azure Terrace Room',
        img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
        color: 'from-sky-400 to-blue-500',
        desc: 'An elegant 85 m² retreat featuring a wrap-around terrace with garden and sea glimpses, premium thread-count linens and a soaking bathtub with a view.',
        features: [
            '85 m² with private terrace', 'Garden & partial sea view', 'Luxury soaking bathtub',
            'King or twin bed options', 'Espresso machine & minibar', 'Smart TV & Bose sound',
            'Complimentary breakfast', 'Evening turndown service'
        ],
        price: '$450',
    },
    'Coral Reef Villa': {
        title: 'Coral Reef Villa',
        img: 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=1200&q=80',
        color: 'from-rose-400 to-orange-400',
        desc: 'A secluded 150 m² freestanding villa just steps from the private beach. Features a shaded outdoor lounge, a private plunge pool and direct beach access — the ultimate family or honeymoon retreat.',
        features: [
            '150 m² freestanding villa', 'Direct private beach access', 'Outdoor plunge pool',
            'Two ensuite bedrooms', 'Fully stocked private kitchen', 'Daily chef breakfast',
            'Golf cart transport', 'Personal concierge'
        ],
        price: '$890',
    },
    'All Rooms': {
        title: 'Our Suite Collection',
        img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80',
        color: 'from-blue-400 to-teal-400',
        desc: 'From intimate terrace rooms to sprawling oceanfront villas, every space at Blue Beach is a sanctuary of luxury. Choose from our curated suite collection to find your perfect haven.',
        features: [
            'Azure Terrace Room from $450/night', 'Coral Reef Villa from $890/night',
            'Oceanic Master Suite from $1,200/night', 'All suites include premium linens',
            'Complimentary high-speed Wi-Fi', 'In-room dining available 24/7',
            'Personalized pillow menu', 'Airport limousine transfer'
        ],
        price: '$450',
    },
};

const DINING: Record<string, any> = {
    'The Azure Grill': {
        title: 'The Azure Grill',
        img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80',
        color: 'from-amber-400 to-orange-500',
        desc: 'A Michelin-starred fine dining experience helmed by Executive Chef Marco Bellini. Seasonal Mediterranean menus marry local catches with globally inspired techniques, presented in an elegant al-fresco setting.',
        features: [
            'Michelin-starred cuisine', 'Seasonal tasting menus (7 & 12 course)', 'Vegetarian & vegan menus',
            'Award-winning wine cellar (800+ labels)', 'Reservations strongly recommended',
            'Private dining room (up to 14 guests)', "Chef's table experience", 'Dress code: smart elegant'
        ],
        time: 'Open: 19:00 – 23:00 (Tue – Sun)',
    },
    'Sands Café': {
        title: 'Sands Café',
        img: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=1200&q=80',
        color: 'from-yellow-400 to-amber-500',
        desc: 'Our laid-back beachfront café serves freshly brewed coffees, cold-pressed juices, artisan pastries and light Mediterranean bites. Perfect for a casual breakfast or lunchtime escape by the sea.',
        features: [
            'Beachfront open-air setting', 'Specialty coffee & fresh juices', 'Gluten-free & vegan options',
            'Build-your-own salad bar', 'Live acoustic music (weekends)', "Kids' menu available",
            'Daily fresh-catch specials', 'Order via QR code from your sunbed'
        ],
        time: 'Open Daily: 08:00 – 18:00',
    },
    'Luna Rooftop': {
        title: 'Luna Rooftop',
        img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&q=80',
        color: 'from-violet-500 to-pink-500',
        desc: 'As the sun sets, Luna Rooftop comes alive with handcrafted cocktails, small-plate Mediterranean tapas and a curated playlist curated for the night. The most atmospheric spot on the Amalfi strip.',
        features: [
            'Rooftop panoramic views', '40+ signature cocktails', 'Tapas & sharing plates menu',
            'Resident DJ (Fri, Sat, Sun)', 'VIP bottle service', 'Hookah terrace',
            'Non-alcoholic cocktail menu', 'Open late till 02:00'
        ],
        time: 'Open Daily: 17:00 – 02:00',
    },
};

const EXPERIENCES: Record<string, any> = {
    'All Experiences': {
        title: 'Curated Experiences',
        img: 'https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?w=1200&q=80',
        color: 'from-blue-400 to-cyan-400',
        desc: 'Beyond the suite, Blue Beach offers over 35 curated activities — from private yacht expeditions and coral diving to cooking masterclasses and stargazing dinners. Every moment crafted to be unforgettable.',
        features: [
            'Private yacht expeditions (half/full day)', 'Certified coral & wreck diving',
            'Private beach dinner under the stars', 'Italian cooking masterclass',
            'Sunrise paddleboard yoga', 'Helicopter coastal sightseeing',
            'Truffle hunting with local chefs', 'Guided Amalfi village tours',
            'Stargazing with telescope access', "Kids' marine biology workshop"
        ],
        time: 'Bookable daily via concierge',
    },
    'Yacht Expeditions': {
        title: 'Yacht Expeditions',
        img: 'https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?w=1200&q=80',
        color: 'from-blue-400 to-cyan-400',
        desc: 'Set sail on a private guided yacht tour along secret coastal caves and nearby islands. Our experienced skippers navigate you to hidden gems inaccessible by road, with a gourmet picnic prepared by our chefs.',
        features: [
            'Half-day & full-day options', 'Private skipper & crew', 'Gourmet on-board picnic',
            'Snorkelling gear included', 'Visit secret sea caves', 'Sunset sailings available',
            'Max 8 guests per yacht', 'From $350 per person'
        ],
        time: 'Departures: 09:00 & 14:00 daily',
    },
    'Private Beach Dinner': {
        title: 'Private Beach Dinner',
        img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=80',
        color: 'from-rose-400 to-amber-400',
        desc: 'A bespoke multi-course candlelit meal set directly on the private beach, served under a canopy of stars with a live cellist playing softly in the background. The ultimate romantic resort experience.',
        features: [
            '5-course personalised menu', 'Private cellist performance', 'Premium champagne included',
            'Rose petal & candle setup', 'Butler & chef on-site', 'Dietary requirements catered',
            'Available for proposals & anniversaries', 'From $480 per couple'
        ],
        time: 'Available: 20:00 – 23:00 (booking required)',
    },
    'Coral Diving': {
        title: 'Coral Diving',
        img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80',
        color: 'from-cyan-400 to-blue-600',
        desc: 'Explore the vibrant underwater ecosystem of the Tyrrhenian Sea with our PADI-certified dive masters. Suitable for all levels — from first-timers to advanced divers seeking wreck dives.',
        features: [
            'PADI-certified instructors', 'Beginner & advanced dives', 'All equipment provided',
            'Reef & wreck dive sites', 'Underwater photography guide', 'Night dives available',
            'Max 6 divers per group', 'From $120 per person'
        ],
        time: 'Sessions: 08:00, 11:00 & 15:00 daily',
    },
};

// ─── Modal Component ──────────────────────────────────────────────────────────

const Modal = ({ data, onClose }: { data: any; onClose: () => void }) => {
    if (!data) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-md cursor-pointer"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-6xl bg-white rounded-[2rem] overflow-hidden shadow-2xl z-[101] max-h-[90vh] flex flex-col"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 z-50 w-11 h-11 bg-black/20 hover:bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-all hover:rotate-90"
                    >
                        <X size={22} />
                    </button>

                    {data.type === 'gallery' ? (
                        <div className="p-8 md:p-12 overflow-y-auto bg-slate-50">
                            <div className="max-w-4xl mx-auto mb-10 text-center">
                                <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.3em] mb-3 block">Visual Journey</span>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Resort Gallery</h2>
                                <p className="text-slate-500 mt-3 text-base">A curated collection of our most beautiful spaces and moments.</p>
                            </div>
                            <div className="grid grid-cols-12 auto-rows-[220px] gap-4">
                                {GALLERY_ITEMS.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: item.id * 0.07 }}
                                        className={`relative rounded-2xl overflow-hidden group shadow-lg ${item.span}`}
                                    >
                                        <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                                            <h3 className="text-white font-bold text-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row h-full w-full bg-white overflow-hidden">
                            <div className="w-full md:w-[55%] h-64 md:h-auto min-h-[380px] shrink-0 relative overflow-hidden">
                                <img src={data.img} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
                                {data.color && <div className={`absolute inset-0 bg-gradient-to-tr ${data.color} mix-blend-overlay opacity-30`} />}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>
                            <div className="w-full md:w-[45%] flex flex-col bg-white">
                                <div className="p-8 md:p-10 overflow-y-auto flex-1">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest mb-5">
                                        {data.price ? 'Accommodation' : data.time?.includes('Open') ? 'Gastronomy / Amenity' : 'Experience'}
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 leading-tight">{data.title}</h2>
                                    <p className="text-slate-600 text-base mb-8 leading-relaxed">{data.desc}</p>
                                    {data.features && (
                                        <div className="mb-8">
                                            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Key Highlights</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {data.features.map((f: string, i: number) => (
                                                    <div key={i} className="flex items-start gap-2 text-slate-700">
                                                        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                                                            <Star size={9} fill="currentColor" />
                                                        </div>
                                                        <span className="text-sm font-medium">{f}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 md:p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                                    <div>
                                        {data.price && <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Starting From</div>}
                                        {data.price && <div className="text-3xl font-bold text-slate-900 font-serif">{data.price}<span className="text-base text-slate-500 font-sans font-medium">/night</span></div>}
                                        {data.time && (
                                            <div className="text-sm font-bold text-slate-700 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                {data.time}
                                            </div>
                                        )}
                                    </div>
                                    <Link to="/guest" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-center whitespace-nowrap">
                                        Reserve Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [modalData, setModalData] = useState<any>(null);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
            const sections = ['amenities', 'suites', 'dining', 'experience'];
            let current = '';
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el && window.scrollY >= el.offsetTop - 120) current = id;
            }
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openGallery = () => setModalData({ type: 'gallery' });
    const openDetail = (data: any) => setModalData({ type: 'detail', ...data });

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Modal data={modalData} onClose={() => setModalData(null)} />

            {/* Nav */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 py-3' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('top')}>
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-serif font-bold text-2xl transition-all duration-500 ${isScrolled ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 shadow-2xl'}`}>B</div>
                        <span className={`font-serif font-bold text-2xl tracking-tight transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white drop-shadow-lg'}`}>Blue Beach</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 bg-white/10 backdrop-blur-md px-8 py-3 rounded-full border border-white/20">
                        {['Amenities', 'Suites', 'Dining', 'Experience'].map((item) => {
                            const id = item.toLowerCase();
                            const isActive = activeSection === id;
                            return (
                                <button key={item} onClick={() => scrollToSection(id)}
                                    className={`relative text-sm font-bold transition-all duration-300 pb-1 ${isActive ? 'text-blue-400' : isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}>
                                    {item}
                                    {isActive && <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative">
                        <button onClick={() => setIsLoginOpen(!isLoginOpen)}
                            className={`px-7 py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${isScrolled ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 shadow-xl hover:scale-105'}`}>
                            <User size={16} /> Portal Access
                        </button>
                        <AnimatePresence>
                            {isLoginOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsLoginOpen(false)} />
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-20">
                                        <div className="p-3">
                                            <Link to="/guest/login" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group" onClick={() => setIsLoginOpen(false)}>
                                                <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors"><User size={20} /></div>
                                                <div><p className="text-sm font-bold text-slate-800">Guest Portal</p><p className="text-xs text-slate-500">Manage your stay</p></div>
                                                <ChevronRight size={16} className="ml-auto text-slate-300 group-hover:text-blue-600" />
                                            </Link>
                                            <Link to="/staff/login" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group mt-1" onClick={() => setIsLoginOpen(false)}>
                                                <div className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors"><Shield size={20} /></div>
                                                <div><p className="text-sm font-bold text-slate-800">Staff Portal</p><p className="text-xs text-slate-500">Internal access</p></div>
                                                <ChevronRight size={16} className="ml-auto text-slate-300" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section id="top" className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80" alt="Hero" className="w-full h-full object-cover scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-slate-50/90" />
                </div>
                <div className="relative z-10 max-w-5xl px-6 text-center text-white mt-20">
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
                            className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-2xl">
                            Welcome to Paradise
                        </motion.span>
                        <h1 className="text-6xl md:text-9xl font-serif font-bold leading-tight mb-8 drop-shadow-2xl">
                            Where Luxury <br /> Meets the <span className="text-blue-200 italic font-light">Ocean</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-medium drop-shadow-lg leading-relaxed">
                            Experience unparalleled comfort at Blue Beach Resort — a timeless sanctuary designed to rejuvenate your soul.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                            <Link to="/guest" className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 shadow-2xl shadow-blue-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3 text-lg">
                                Book Your Stay <ArrowRight size={20} />
                            </Link>
                            <button onClick={openGallery}
                                className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border border-white/30 hover:bg-white/20 transition-all flex items-center justify-center gap-3 text-lg hover:scale-105">
                                View Gallery
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Amenities */}
            <section id="amenities" className="py-32 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Essentials</span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-5">Elite Amenities</h2>
                        <div className="w-20 h-2 bg-blue-600 mx-auto rounded-full mb-6" />
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">Curated experiences designed to provide the ultimate relaxation and entertainment during your stay.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        {Object.values(AMENITIES).map((item, i) => (
                            <motion.div key={i} whileHover={{ y: -12 }} className="group cursor-pointer" onClick={() => openDetail(item)}>
                                <div className="relative h-[30rem] rounded-[2.5rem] overflow-hidden mb-5 shadow-2xl shadow-slate-200/50">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <h3 className="text-2xl font-serif font-bold text-white mb-2 flex items-center justify-between">
                                            {item.title}
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <ChevronRight size={18} className="text-white" />
                                            </div>
                                        </h3>
                                        <p className="text-white/80 text-sm leading-relaxed">{item.desc.substring(0, 80)}…</p>
                                        <div className="mt-3 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            {item.time}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Suites */}
            <section id="suites" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-blue-600 font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Accommodation</span>
                            <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-5">Signature Suites</h2>
                            <p className="text-slate-500 text-lg leading-relaxed">Each room is a masterpiece of design, offering unparalleled views and intuitive technology.</p>
                        </div>
                        <button onClick={() => openDetail(SUITES['All Rooms'])} className="px-10 py-5 bg-slate-900 text-white font-bold rounded-full hover:bg-blue-600 transition-colors flex items-center gap-3 shadow-2xl text-base">
                            Explore Collection <ChevronRight size={20} />
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-10">
                        <motion.div whileHover={{ scale: 1.02 }} className="relative h-[38rem] rounded-[3rem] overflow-hidden group shadow-2xl cursor-pointer" onClick={() => openDetail(SUITES['Oceanic Master Suite'])}>
                            <img src={SUITES['Oceanic Master Suite'].img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                            <div className="absolute top-8 left-8"><span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-xs font-bold text-slate-900 uppercase tracking-widest">Masterpiece Collection</span></div>
                            <div className="absolute bottom-10 left-10 right-10 text-white">
                                <div className="flex justify-between items-end mb-3">
                                    <h3 className="text-3xl font-serif font-bold">Oceanic Master Suite</h3>
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"><ArrowRight size={22} /></div>
                                </div>
                                <p className="text-white/80 mb-6 text-base font-medium">220 m² · Private infinity plunge pool · Panoramic coast views</p>
                                <div className="flex items-center gap-4 text-sm font-bold bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                    <span className="bg-black/20 px-4 py-2 rounded-full">220 m²</span>
                                    <span className="bg-black/20 px-4 py-2 rounded-full">Private Plunge Pool</span>
                                    <span className="ml-auto text-2xl font-serif text-blue-200">$1,200<span className="text-sm font-sans text-white/60">/night</span></span>
                                </div>
                            </div>
                        </motion.div>
                        <div className="grid grid-rows-2 gap-10">
                            {['Azure Terrace Room', 'Coral Reef Villa'].map((key) => (
                                <motion.div key={key} whileHover={{ scale: 1.02 }} className="relative h-[18rem] rounded-[3rem] overflow-hidden group shadow-xl cursor-pointer" onClick={() => openDetail(SUITES[key])}>
                                    <img src={SUITES[key].img} alt={SUITES[key].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition-colors duration-500" />
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-slate-900 uppercase tracking-widest shadow">
                                            {key === 'Azure Terrace Room' ? 'Terrace View' : 'Beachfront Villa'}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-8 left-8 right-8 text-white flex justify-between items-end">
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold mb-1">{SUITES[key].title}</h3>
                                            <p className="text-lg text-white/80 font-serif">{SUITES[key].price} <span className="text-sm font-sans uppercase tracking-widest">/ night</span></p>
                                        </div>
                                        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"><ArrowRight size={18} /></div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Dining */}
            <section id="dining" className="py-32 px-6 bg-slate-950 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/20 blur-[150px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-rose-600/10 blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-amber-400 font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Gastronomy</span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold mb-5">World Class Dining</h2>
                        <div className="w-20 h-2 bg-amber-500 mx-auto rounded-full mb-6" />
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">From Michelin-starred fine dining to casual beachfront grills and rooftop cocktail bars.</p>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {Object.values(DINING).map((place, i) => (
                            <div key={i} className="group cursor-pointer p-5 hover:bg-white/5 rounded-[2.5rem] transition-colors border border-transparent hover:border-white/10" onClick={() => openDetail(place)}>
                                <div className="h-80 rounded-[2rem] overflow-hidden mb-6 relative shadow-2xl shadow-black/50">
                                    <img src={place.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-30 transition-opacity duration-500" />
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-full"><ArrowRight size={18} className="text-white" /></div>
                                    </div>
                                </div>
                                <div className="px-2">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-xl font-serif font-bold group-hover:text-amber-300 transition-colors">{place.title}</h3>
                                        <span className="text-xs text-amber-500 font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">{place.features?.[0]?.split(' ')[0] === 'Michelin' ? 'Fine Dining' : place.title === 'Sands Café' ? 'Casual' : 'Bar'}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm flex items-center gap-2 font-medium">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" /> {place.time}
                                    </p>
                                    <p className="text-slate-500 text-sm mt-2 leading-relaxed line-clamp-2">{place.desc.substring(0, 100)}…</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section id="experience" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Lifestyle</span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-5">Beyond the Ordinary Stay</h2>
                        <div className="w-20 h-2 bg-blue-600 mx-auto rounded-full mb-6" />
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">Over 35 curated activities — from private yacht expeditions to coral diving and starlit dinners.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {[
                            { icon: '🛥️', title: 'Yacht Expeditions', key: 'Yacht Expeditions', color: 'from-blue-50 to-cyan-50 border-blue-100' },
                            { icon: '✨', title: 'Private Beach Dinner', key: 'Private Beach Dinner', color: 'from-rose-50 to-amber-50 border-rose-100' },
                            { icon: '🤿', title: 'Coral Diving', key: 'Coral Diving', color: 'from-cyan-50 to-blue-50 border-cyan-100' },
                            { icon: '🚁', title: 'Helicopter Tours', key: 'All Experiences', color: 'from-violet-50 to-indigo-50 border-violet-100' },
                            { icon: '🧘', title: 'Sunrise Yoga', key: 'All Experiences', color: 'from-amber-50 to-yellow-50 border-amber-100' },
                            { icon: '🍽️', title: 'Cooking Masterclass', key: 'All Experiences', color: 'from-green-50 to-emerald-50 border-green-100' },
                            { icon: '🔭', title: 'Stargazing Night', key: 'All Experiences', color: 'from-slate-50 to-blue-50 border-slate-100' },
                            { icon: '🏄', title: 'Paddleboard Session', key: 'All Experiences', color: 'from-teal-50 to-cyan-50 border-teal-100' },
                        ].map((exp, i) => (
                            <motion.div key={i} whileHover={{ y: -8, scale: 1.02 }}
                                className={`bg-gradient-to-br ${exp.color} border rounded-3xl p-6 cursor-pointer group transition-shadow hover:shadow-xl hover:shadow-blue-100`}
                                onClick={() => openDetail(EXPERIENCES[exp.key])}>
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{exp.icon}</div>
                                <h4 className="font-bold text-slate-900 text-lg mb-1 font-serif group-hover:text-blue-600 transition-colors">{exp.title}</h4>
                                <p className="text-slate-500 text-sm">Click to explore details</p>
                                <div className="mt-4 flex items-center gap-1 text-blue-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn more <ArrowRight size={12} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center">
                        <button onClick={() => openDetail(EXPERIENCES['All Experiences'])}
                            className="px-12 py-5 bg-slate-900 text-white font-bold rounded-full shadow-2xl shadow-slate-900/20 hover:bg-blue-600 transition-colors text-lg flex items-center gap-3 mx-auto">
                            Discover All 35+ Experiences <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-white py-20 px-6 border-t border-slate-900">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-14">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => scrollToSection('top')}>
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-serif font-bold text-xl">B</div>
                            <span className="font-serif font-bold text-3xl">Blue Beach</span>
                        </div>
                        <p className="text-slate-400 max-w-md mb-8 leading-loose text-base">
                            Elevating the standard of coastal living through meticulous design and heartfelt hospitality. Nestled in the heart of the Amalfi Coast.
                        </p>
                        <div className="flex gap-4">
                            {['FB', 'IG', 'TW', 'YT'].map(s => (
                                <div key={s} className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 transition-colors flex items-center justify-center text-xs font-bold cursor-pointer">{s}</div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-lg font-serif">Quick Links</h4>
                        <ul className="space-y-4 text-slate-400 font-medium">
                            <li><button onClick={() => openDetail(SUITES['All Rooms'])} className="hover:text-blue-400 transition-colors">Our Suites</button></li>
                            <li><button onClick={() => scrollToSection('dining')} className="hover:text-blue-400 transition-colors">Dining</button></li>
                            <li><button onClick={() => openDetail(EXPERIENCES['All Experiences'])} className="hover:text-blue-400 transition-colors">Activities</button></li>
                            <li><button onClick={openGallery} className="hover:text-blue-400 transition-colors">Gallery</button></li>
                            <li><Link to="/guest" className="hover:text-blue-400 transition-colors">Book a Stay</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-lg font-serif">Contact</h4>
                        <ul className="space-y-4 text-slate-400 font-medium">
                            <li className="flex items-center gap-3"><MapPin size={18} className="text-blue-500 shrink-0" /> Amalfi Coast, Italy</li>
                            <li className="flex items-center gap-3"><Mail size={18} className="text-blue-500 shrink-0" /> reservations@bluebeach.com</li>
                            <li className="flex items-center gap-3"><Phone size={18} className="text-blue-500 shrink-0" /> +39 089 123 4567</li>
                            <li className="flex items-center gap-3 mt-4">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                                <span className="text-white font-bold text-sm">Open for Reservations</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto border-t border-slate-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© 2026 Blue Beach Resort. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
                        <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
