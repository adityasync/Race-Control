import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue } from 'framer-motion';
import { Users, Trophy, MapPin, ArrowRight, Play, ChevronDown, BarChart3, Flag, Clock, Zap } from 'lucide-react';

export default function Home() {
    const [loaded, setLoaded] = useState(false);
    const [cursorVariant, setCursorVariant] = useState('default');
    const containerRef = useRef(null);
    const horizontalRef = useRef(null);

    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // Custom cursor
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [cursorX, cursorY]);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    // Horizontal scroll for showcase
    const { scrollYProgress: horizontalProgress } = useScroll({
        target: horizontalRef,
        offset: ["start start", "end end"]
    });
    const horizontalX = useTransform(horizontalProgress, [0, 1], ["0%", "-75%"]);

    return (
        <div ref={containerRef} className="bg-black text-white cursor-none">
            {/* Custom Cursor */}
            <motion.div
                className="fixed w-8 h-8 rounded-full border-2 border-f1-red pointer-events-none z-[100] mix-blend-difference"
                style={{ x: cursorX, y: cursorY }}
                animate={cursorVariant}
                variants={{
                    default: { scale: 1 },
                    hover: { scale: 1.5, backgroundColor: 'rgba(225,6,0,0.3)' },
                    click: { scale: 0.8 },
                }}
            />

            {/* Loading Screen */}
            <AnimatePresence>
                {!loaded && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                    >
                        <div className="relative">
                            {/* Animated rings */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 border border-f1-red/30 rounded-full"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: [0.8, 1.5, 2],
                                        opacity: [0.5, 0.3, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.4,
                                        ease: "easeOut"
                                    }}
                                    style={{ width: 200, height: 200, margin: -100 }}
                                />
                            ))}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative z-10 text-center"
                            >
                                <div className="text-7xl font-racing mb-6">
                                    F1<span className="text-f1-red">PEDIA</span>
                                </div>
                                <motion.div
                                    className="w-64 h-1 bg-gray-900 mx-auto overflow-hidden rounded-full"
                                >
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-f1-red via-orange-500 to-f1-red bg-[length:200%_100%]"
                                        initial={{ width: 0, backgroundPosition: '0% 50%' }}
                                        animate={{
                                            width: '100%',
                                            backgroundPosition: ['0% 50%', '100% 50%']
                                        }}
                                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-f1-red via-orange-500 to-yellow-500 z-50 origin-left"
                style={{ scaleX: smoothProgress }}
            />

            {/* ===== HERO SECTION ===== */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Animated grid background */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(225,6,0,0.03) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(225,6,0,0.03) 1px, transparent 1px)
                            `,
                            backgroundSize: '100px 100px',
                        }}
                        animate={{
                            backgroundPosition: ['0px 0px', '100px 100px']
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                </div>

                {/* 3D Rotating Ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        className="w-[600px] h-[600px] border border-white/5 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute w-[500px] h-[500px] border border-f1-red/10 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute w-[400px] h-[400px] border border-orange-500/10 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                </div>

                {/* Gradient orb */}
                <motion.div
                    className="absolute w-[800px] h-[800px] rounded-full opacity-50"
                    style={{
                        background: 'radial-gradient(circle, rgba(225,6,0,0.15) 0%, transparent 60%)',
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Hero Content */}
                <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={loaded ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-12">
                            <motion.span
                                className="w-2 h-2 bg-f1-red rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                            <span className="text-sm font-mono tracking-wider text-gray-300">
                                THE ULTIMATE F1 DATABASE
                            </span>
                        </div>
                    </motion.div>

                    {/* Title with perspective */}
                    <div className="overflow-hidden mb-8 perspective-1000">
                        <motion.h1
                            className="text-[10rem] md:text-[16rem] font-racing leading-none tracking-tighter"
                            initial={{ y: 300, rotateX: 45 }}
                            animate={loaded ? { y: 0, rotateX: 0 } : {}}
                            transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1], delay: 0.5 }}
                        >
                            <span className="text-white">F1</span>
                            <motion.span
                                className="text-f1-red inline-block"
                                animate={{
                                    textShadow: [
                                        '0 0 0px rgba(225,6,0,0)',
                                        '0 0 30px rgba(225,6,0,0.5)',
                                        '0 0 0px rgba(225,6,0,0)'
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                PEDIA
                            </motion.span>
                        </motion.h1>
                    </div>

                    <motion.p
                        className="text-2xl text-gray-400 mb-12 font-light"
                        initial={{ opacity: 0 }}
                        animate={loaded ? { opacity: 1 } : {}}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        75 Years of Racing Excellence • Since 1950
                    </motion.p>

                    {/* Animated Stats Bar */}
                    <motion.div
                        className="flex items-center justify-center gap-12 mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={loaded ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, delay: 1.2 }}
                    >
                        {[
                            { value: '862+', label: 'Drivers' },
                            { value: '211+', label: 'Teams' },
                            { value: '1.1K+', label: 'Races' },
                            { value: '77', label: 'Circuits' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="text-center"
                                whileHover={{ scale: 1.1 }}
                                onMouseEnter={() => setCursorVariant('hover')}
                                onMouseLeave={() => setCursorVariant('default')}
                            >
                                <div className="text-3xl font-racing text-white">{stat.value}</div>
                                <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={loaded ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, delay: 1.4 }}
                    >
                        <Link to="/drivers">
                            <motion.button
                                className="group relative px-12 py-6 bg-f1-red text-white font-racing text-xl tracking-wider uppercase overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onMouseEnter={() => setCursorVariant('hover')}
                                onMouseLeave={() => setCursorVariant('default')}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    <Play fill="currentColor" size={18} />
                                    Start Exploring
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight size={20} />
                                    </motion.span>
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-orange-600 to-f1-red"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.4 }}
                                />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={loaded ? { opacity: 1 } : {}}
                    transition={{ delay: 2 }}
                >
                    <motion.div
                        className="flex flex-col items-center gap-2"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Scroll to explore</span>
                        <ChevronDown className="w-6 h-6 text-f1-red" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ===== HORIZONTAL SCROLL SHOWCASE ===== */}
            <section ref={horizontalRef} className="relative h-[400vh]">
                <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                    <motion.div
                        className="flex gap-8 pl-[10vw]"
                        style={{ x: horizontalX }}
                    >
                        {[
                            {
                                title: 'DRIVERS',
                                subtitle: 'Every legend who ever raced',
                                stat: '862+',
                                icon: Users,
                                color: '#E10600',
                                to: '/drivers'
                            },
                            {
                                title: 'TEAMS',
                                subtitle: 'Complete constructor history',
                                stat: '211+',
                                icon: Trophy,
                                color: '#FF8000',
                                to: '/teams'
                            },
                            {
                                title: 'CIRCUITS',
                                subtitle: 'Every track ever raced',
                                stat: '77',
                                icon: MapPin,
                                color: '#00D2BE',
                                to: '/circuits'
                            },
                            {
                                title: 'ANALYTICS',
                                subtitle: 'Deep performance insights',
                                stat: '100+',
                                icon: BarChart3,
                                color: '#1E41FF',
                                to: '/analytics'
                            },
                        ].map((item, i) => (
                            <Link key={i} to={item.to}>
                                <motion.div
                                    className="relative w-[70vw] md:w-[40vw] h-[70vh] p-12 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden group"
                                    whileHover={{ borderColor: item.color }}
                                    onMouseEnter={() => setCursorVariant('hover')}
                                    onMouseLeave={() => setCursorVariant('default')}
                                >
                                    {/* Large background number */}
                                    <div
                                        className="absolute -right-10 -bottom-20 text-[20rem] font-racing opacity-5 select-none"
                                        style={{ color: item.color }}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 h-full flex flex-col">
                                        <motion.div
                                            className="mb-8"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                        >
                                            <item.icon className="w-16 h-16" style={{ color: item.color }} />
                                        </motion.div>

                                        <div className="text-8xl font-racing mb-4" style={{ color: item.color }}>
                                            {item.stat}
                                        </div>

                                        <h3 className="text-5xl font-racing text-white mb-4 group-hover:text-f1-red transition-colors">
                                            {item.title}
                                        </h3>

                                        <p className="text-xl text-gray-400 mb-auto">{item.subtitle}</p>

                                        <motion.div
                                            className="flex items-center gap-2 text-f1-red font-mono uppercase tracking-wider"
                                            initial={{ x: 0 }}
                                            whileHover={{ x: 10 }}
                                        >
                                            Explore <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ===== CHAMPIONS TIMELINE ===== */}
            <section className="relative py-40 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-7xl md:text-9xl font-racing mb-6">
                            <span className="text-f1-red">LEGENDS</span>
                        </h2>
                        <p className="text-xl text-gray-500 font-mono tracking-widest">
                            THE GREATEST WORLD CHAMPIONS
                        </p>
                    </motion.div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Center line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-f1-red to-transparent" />

                        {[
                            { name: 'SCHUMACHER', titles: 7, team: 'Ferrari', years: '1994-2004', side: 'left' },
                            { name: 'HAMILTON', titles: 7, team: 'Mercedes', years: '2008-2020', side: 'right' },
                            { name: 'VERSTAPPEN', titles: 4, team: 'Red Bull', years: '2021-2024', side: 'left' },
                            { name: 'VETTEL', titles: 4, team: 'Red Bull', years: '2010-2013', side: 'right' },
                            { name: 'PROST', titles: 4, team: 'McLaren', years: '1985-1993', side: 'left' },
                        ].map((champion, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: champion.side === 'left' ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative flex items-center mb-16 ${champion.side === 'left' ? 'justify-start' : 'justify-end'
                                    }`}
                            >
                                {/* Dot on timeline */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-f1-red rounded-full" />

                                {/* Card */}
                                <motion.div
                                    className={`w-[45%] p-8 border border-white/5 bg-white/[0.02] backdrop-blur-sm ${champion.side === 'left' ? 'text-right mr-auto' : 'text-left ml-auto'
                                        }`}
                                    whileHover={{ borderColor: '#E10600', y: -5 }}
                                    onMouseEnter={() => setCursorVariant('hover')}
                                    onMouseLeave={() => setCursorVariant('default')}
                                >
                                    <div className="text-6xl font-racing text-f1-red mb-2">{champion.titles}×</div>
                                    <div className="text-3xl font-racing text-white mb-2">{champion.name}</div>
                                    <div className="text-sm font-mono text-gray-400">{champion.team} • {champion.years}</div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/drivers">
                            <motion.button
                                className="px-12 py-5 border border-white/10 text-white font-racing text-lg tracking-wider uppercase"
                                whileHover={{ borderColor: '#E10600', backgroundColor: 'rgba(225,6,0,0.1)' }}
                                onMouseEnter={() => setCursorVariant('hover')}
                                onMouseLeave={() => setCursorVariant('default')}
                            >
                                View All Champions
                                <ArrowRight className="inline-block ml-3 w-5 h-5" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ===== FEATURES BENTO ===== */}
            <section className="relative py-40 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-7xl md:text-9xl font-racing mb-6">
                            <span className="text-white">EXPLORE</span>
                        </h2>
                    </motion.div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-4 grid-rows-2 gap-6 h-[80vh]">
                        <motion.div
                            className="col-span-2 row-span-2 relative p-10 border border-white/5 bg-gradient-to-br from-f1-red/10 to-transparent overflow-hidden group"
                            whileHover={{ borderColor: '#E10600' }}
                            onMouseEnter={() => setCursorVariant('hover')}
                            onMouseLeave={() => setCursorVariant('default')}
                        >
                            <Link to="/analytics" className="block h-full">
                                <BarChart3 className="w-16 h-16 text-f1-red mb-8" />
                                <h3 className="text-5xl font-racing text-white mb-4">ANALYTICS</h3>
                                <p className="text-gray-400 text-lg">Qualifying deltas, race pace, points efficiency, and predictive models</p>
                                <motion.div
                                    className="absolute bottom-10 right-10"
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-10 h-10 text-f1-red" />
                                </motion.div>
                            </Link>
                        </motion.div>

                        <motion.div
                            className="col-span-1 relative p-8 border border-white/5 bg-gradient-to-br from-orange-500/10 to-transparent"
                            whileHover={{ borderColor: '#FF8000' }}
                            onMouseEnter={() => setCursorVariant('hover')}
                            onMouseLeave={() => setCursorVariant('default')}
                        >
                            <Link to="/races" className="block h-full">
                                <Flag className="w-10 h-10 text-orange-500 mb-4" />
                                <h3 className="text-2xl font-racing text-white">RACES</h3>
                                <p className="text-gray-500 text-sm mt-2">1,124 Grand Prix</p>
                            </Link>
                        </motion.div>

                        <motion.div
                            className="col-span-1 relative p-8 border border-white/5 bg-gradient-to-br from-green-500/10 to-transparent"
                            whileHover={{ borderColor: '#00D2BE' }}
                            onMouseEnter={() => setCursorVariant('hover')}
                            onMouseLeave={() => setCursorVariant('default')}
                        >
                            <Link to="/circuits" className="block h-full">
                                <MapPin className="w-10 h-10 text-green-500 mb-4" />
                                <h3 className="text-2xl font-racing text-white">CIRCUITS</h3>
                                <p className="text-gray-500 text-sm mt-2">77 Tracks</p>
                            </Link>
                        </motion.div>

                        <motion.div
                            className="col-span-1 relative p-8 border border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent"
                            whileHover={{ borderColor: '#1E41FF' }}
                            onMouseEnter={() => setCursorVariant('hover')}
                            onMouseLeave={() => setCursorVariant('default')}
                        >
                            <Link to="/teams" className="block h-full">
                                <Trophy className="w-10 h-10 text-blue-500 mb-4" />
                                <h3 className="text-2xl font-racing text-white">TEAMS</h3>
                                <p className="text-gray-500 text-sm mt-2">211 Constructors</p>
                            </Link>
                        </motion.div>

                        <motion.div
                            className="col-span-1 relative p-8 border border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent"
                            whileHover={{ borderColor: '#9333EA' }}
                            onMouseEnter={() => setCursorVariant('hover')}
                            onMouseLeave={() => setCursorVariant('default')}
                        >
                            <Link to="/drivers" className="block h-full">
                                <Users className="w-10 h-10 text-purple-500 mb-4" />
                                <h3 className="text-2xl font-racing text-white">DRIVERS</h3>
                                <p className="text-gray-500 text-sm mt-2">862 Legends</p>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="relative py-32 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
                        <div>
                            <motion.div
                                className="text-7xl font-racing mb-4"
                                whileHover={{ scale: 1.02 }}
                            >
                                F1<span className="text-f1-red">PEDIA</span>
                            </motion.div>
                            <p className="text-gray-600 font-mono text-sm tracking-widest">
                                THE LIVING ARCHIVE OF FORMULA 1 • 1950 — 2024
                            </p>
                        </div>

                        <nav className="flex flex-wrap justify-center gap-8">
                            {['Drivers', 'Teams', 'Races', 'Circuits', 'Analytics'].map((item) => (
                                <Link
                                    key={item}
                                    to={`/${item.toLowerCase()}`}
                                    className="text-gray-500 hover:text-f1-red transition-colors font-mono uppercase tracking-wider"
                                    onMouseEnter={() => setCursorVariant('hover')}
                                    onMouseLeave={() => setCursorVariant('default')}
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Animated checkered */}
                    <motion.div
                        className="flex justify-center mt-20"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {[...Array(48)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={`w-3 h-3 ${(Math.floor(i / 8) + i) % 2 === 0 ? 'bg-white' : 'bg-transparent'}`}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.01 }}
                            />
                        ))}
                    </motion.div>
                </div>
            </footer>
        </div>
    );
}
