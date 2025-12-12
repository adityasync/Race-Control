import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Trophy, Timer, ChevronRight, Flag, Award, MapPin, ArrowRight, Zap } from 'lucide-react';

export default function Home() {
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const statsRef = useRef(null);
    const championsRef = useRef(null);
    const featuresRef = useRef(null);

    // Scroll tracking for parallax effects
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        [statsRef, championsRef, featuresRef].forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="bg-black text-white overflow-x-hidden">
            {/* ===== ANIMATED BACKGROUND ===== */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Gradient orbs */}
                <div
                    className="absolute w-[1000px] h-[1000px] rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(225,6,0,0.4) 0%, transparent 70%)',
                        top: `${-200 + scrollY * 0.1}px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                />
                <div
                    className="absolute w-[600px] h-[600px] rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,128,0,0.3) 0%, transparent 70%)',
                        bottom: `${-100 + scrollY * 0.05}px`,
                        right: '-200px',
                    }}
                />

                {/* Animated grid */}
                <div className="absolute inset-0 opacity-[0.015]">
                    <div className="h-full w-full" style={{
                        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                        backgroundSize: '100px 100px',
                        transform: `translateY(${scrollY * 0.1}px)`,
                    }} />
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-f1-red/30 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${15 + Math.random() * 10}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
                {/* Speed lines animation */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-px bg-gradient-to-r from-transparent via-f1-red/40 to-transparent animate-speed-line"
                            style={{
                                top: `${20 + i * 15}%`,
                                left: '-100%',
                                right: '-100%',
                                animationDelay: `${i * 0.3}s`,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 text-center max-w-6xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-3 mb-8 px-6 py-2 rounded-full border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-f1-red rounded-full animate-pulse" />
                        <span className="text-gray-400 font-mono text-xs uppercase tracking-[0.2em]">
                            The Ultimate F1 Database
                        </span>
                    </div>

                    {/* Main title with gradient */}
                    <h1 className="text-8xl md:text-[12rem] font-racing tracking-tighter mb-6 leading-none">
                        <span className="bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
                            F1
                        </span>
                        <span className="bg-gradient-to-r from-f1-red via-orange-500 to-f1-red bg-clip-text text-transparent animate-gradient-x">
                            PEDIA
                        </span>
                    </h1>

                    {/* Animated underline */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="h-1 w-32 bg-gradient-to-r from-transparent via-f1-red to-transparent animate-pulse" />
                        <div className="w-3 h-3 rotate-45 border-2 border-f1-red" />
                        <div className="h-1 w-32 bg-gradient-to-r from-transparent via-f1-red to-transparent animate-pulse" />
                    </div>

                    {/* Subtitle */}
                    <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
                        75 Years of Racing Excellence
                    </p>
                    <p className="text-gray-500 font-mono text-sm mb-12 tracking-wider">
                        860+ DRIVERS • 210+ TEAMS • 1,100+ RACES • 77 CIRCUITS
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap justify-center gap-6 mb-20">
                        <Link
                            to="/drivers"
                            className="group relative px-10 py-5 bg-gradient-to-r from-f1-red to-red-700 text-white font-racing text-xl tracking-wider uppercase overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-f1-red/30"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                <Play fill="currentColor" size={20} />
                                Explore Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </span>
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </Link>
                        <Link
                            to="/analytics"
                            className="group px-10 py-5 border-2 border-gray-700 text-white font-racing text-xl tracking-wider uppercase hover:border-f1-red hover:bg-f1-red/10 transition-all duration-300 flex items-center gap-3"
                        >
                            <Zap className="w-5 h-5" />
                            Analytics
                        </Link>
                    </div>

                    {/* Hero cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <HeroCard
                            to="/drivers"
                            icon={<Users className="w-8 h-8" />}
                            title="Drivers"
                            subtitle="Every legend who ever raced"
                            delay={0}
                        />
                        <HeroCard
                            to="/teams"
                            icon={<Trophy className="w-8 h-8" />}
                            title="Teams"
                            subtitle="Complete constructor history"
                            delay={100}
                        />
                        <HeroCard
                            to="/circuits"
                            icon={<MapPin className="w-8 h-8" />}
                            title="Circuits"
                            subtitle="Every track ever raced"
                            delay={200}
                        />
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
                    <span className="text-xs font-mono uppercase tracking-wider">Scroll</span>
                    <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
            </section>

            {/* ===== STATS SECTION ===== */}
            <section
                ref={statsRef}
                id="stats"
                className="relative py-32 px-4 border-t border-gray-900"
            >
                <div className="max-w-6xl mx-auto">
                    <div className={`transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                        <h2 className="text-5xl md:text-6xl font-racing text-center mb-4">
                            THE <span className="text-f1-red">NUMBERS</span>
                        </h2>
                        <p className="text-gray-500 text-center font-mono text-sm mb-20 tracking-wider">
                            THAT DEFINE MOTORSPORT'S PINNACLE
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <AnimatedStatCard number={1124} label="Grand Prix" suffix="+" icon={<Flag />} visible={isVisible.stats} delay={0} />
                            <AnimatedStatCard number={862} label="Drivers" suffix="+" icon={<Users />} visible={isVisible.stats} delay={200} />
                            <AnimatedStatCard number={211} label="Teams" suffix="+" icon={<Trophy />} visible={isVisible.stats} delay={400} />
                            <AnimatedStatCard number={77} label="Circuits" suffix="" icon={<MapPin />} visible={isVisible.stats} delay={600} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CHAMPIONS SECTION ===== */}
            <section
                ref={championsRef}
                id="champions"
                className="relative py-32 px-4 bg-gradient-to-b from-transparent via-gray-950/80 to-transparent"
            >
                <div className="max-w-6xl mx-auto">
                    <div className={`transition-all duration-1000 ${isVisible.champions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                        <h2 className="text-5xl md:text-6xl font-racing text-center mb-4">
                            HALL OF <span className="text-f1-red">LEGENDS</span>
                        </h2>
                        <p className="text-gray-500 text-center font-mono text-sm mb-20 tracking-wider">
                            THE GREATEST WORLD CHAMPIONS
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <ChampionCard
                                name="Michael Schumacher"
                                titles={7}
                                wins={91}
                                team="Ferrari"
                                teamColor="#DC0000"
                                era="1994-2004"
                                visible={isVisible.champions}
                                delay={0}
                            />
                            <ChampionCard
                                name="Lewis Hamilton"
                                titles={7}
                                wins={104}
                                team="Mercedes"
                                teamColor="#00D2BE"
                                era="2008-2020"
                                featured
                                visible={isVisible.champions}
                                delay={200}
                            />
                            <ChampionCard
                                name="Max Verstappen"
                                titles={4}
                                wins={63}
                                team="Red Bull"
                                teamColor="#1E41FF"
                                era="2021-2024"
                                visible={isVisible.champions}
                                delay={400}
                            />
                        </div>

                        <div className="text-center mt-16">
                            <Link
                                to="/drivers"
                                className="inline-flex items-center gap-3 px-8 py-4 border border-gray-800 text-white font-racing uppercase tracking-wider hover:border-f1-red hover:bg-f1-red/10 transition-all duration-300"
                            >
                                View All Drivers
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section
                ref={featuresRef}
                id="features"
                className="relative py-32 px-4 border-t border-gray-900"
            >
                <div className="max-w-6xl mx-auto">
                    <div className={`transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                        <h2 className="text-5xl md:text-6xl font-racing text-center mb-4">
                            EXPLORE <span className="text-f1-red">EVERYTHING</span>
                        </h2>
                        <p className="text-gray-500 text-center font-mono text-sm mb-20 tracking-wider">
                            DEEP DIVE INTO 75 YEARS OF RACING DATA
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FeatureCard
                                to="/analytics"
                                title="Advanced Analytics"
                                description="Qualifying deltas, race pace, points efficiency, and predictive models powered by machine learning"
                                gradient="from-orange-500/20 to-transparent"
                                visible={isVisible.features}
                                delay={0}
                            />
                            <FeatureCard
                                to="/races"
                                title="Race Database"
                                description="Every Grand Prix from 1950 to today with complete results, lap times, and pit stop data"
                                gradient="from-blue-500/20 to-transparent"
                                visible={isVisible.features}
                                delay={200}
                            />
                            <FeatureCard
                                to="/teams"
                                title="Constructor Archive"
                                description="The complete history of every team, from Alfa Romeo's 1950 dominance to Red Bull's modern era"
                                gradient="from-green-500/20 to-transparent"
                                visible={isVisible.features}
                                delay={400}
                            />
                            <FeatureCard
                                to="/circuits"
                                title="Circuit Encyclopedia"
                                description="77 circuits across 6 continents, with track records, historic winners, and circuit evolution"
                                gradient="from-purple-500/20 to-transparent"
                                visible={isVisible.features}
                                delay={600}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="relative py-20 border-t border-gray-900 bg-gradient-to-t from-gray-950 to-transparent">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Checkered flag */}
                    <div className="flex justify-center mb-12">
                        {[...Array(32)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 ${i % 2 === Math.floor(i / 8) % 2 ? 'bg-white' : 'bg-transparent'}`}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <div className="text-4xl font-racing mb-2">
                                F1<span className="text-f1-red">PEDIA</span>
                            </div>
                            <p className="text-gray-600 font-mono text-xs tracking-wider">
                                THE LIVING ARCHIVE OF FORMULA 1
                            </p>
                        </div>

                        <nav className="flex flex-wrap justify-center gap-8">
                            {['Drivers', 'Teams', 'Races', 'Circuits', 'Analytics'].map(item => (
                                <Link
                                    key={item}
                                    to={`/${item.toLowerCase()}`}
                                    className="text-gray-500 hover:text-f1-red transition-colors font-mono text-sm uppercase tracking-wider"
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>

                        <p className="text-gray-700 font-mono text-xs">
                            1950 — 2024
                        </p>
                    </div>
                </div>
            </footer>

            {/* ===== ANIMATIONS CSS ===== */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    50% { transform: translateY(-10px) translateX(-10px); }
                    75% { transform: translateY(-30px) translateX(5px); }
                }
                .animate-float {
                    animation: float 20s ease-in-out infinite;
                }

                @keyframes speed-line {
                    0% { transform: translateX(-100%); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0; }
                }
                .animate-speed-line {
                    animation: speed-line 4s ease-in-out infinite;
                }

                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
            `}</style>
        </div>
    );
}

// ===== COMPONENTS =====

function HeroCard({ to, icon, title, subtitle, delay }) {
    return (
        <Link
            to={to}
            className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 hover:border-f1-red hover:bg-gray-900/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-f1-red/10"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-f1-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
                <div className="text-f1-red mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                <h3 className="text-2xl font-racing text-white mb-2 group-hover:text-f1-red transition-colors">{title}</h3>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <ChevronRight className="absolute bottom-8 right-8 w-6 h-6 text-gray-700 group-hover:text-f1-red group-hover:translate-x-2 transition-all" />
        </Link>
    );
}

function AnimatedStatCard({ number, label, suffix, icon, visible, delay }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!visible) return;

        const timeout = setTimeout(() => {
            const duration = 2000;
            const start = Date.now();

            const animate = () => {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                setCount(Math.floor(number * eased));
                if (progress < 1) requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        }, delay);

        return () => clearTimeout(timeout);
    }, [visible, number, delay]);

    return (
        <div className="group relative bg-gray-900/30 backdrop-blur-sm border border-gray-800 p-8 text-center hover:border-f1-red transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-t from-f1-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
                <div className="text-f1-red/50 mb-4 flex justify-center group-hover:text-f1-red transition-colors">
                    {icon}
                </div>
                <div className="text-5xl md:text-6xl font-racing text-white mb-2 tabular-nums">
                    {count.toLocaleString()}{suffix}
                </div>
                <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">{label}</div>
            </div>
        </div>
    );
}

function ChampionCard({ name, titles, wins, team, teamColor, era, featured, visible, delay }) {
    return (
        <div
            className={`group relative bg-gray-900/50 backdrop-blur-sm border ${featured ? 'border-f1-red md:scale-105 md:-my-4' : 'border-gray-800'} p-8 transition-all duration-700 hover:border-f1-red ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {/* Team color accent */}
            <div className="absolute top-0 left-0 right-0 h-1 transition-all duration-300" style={{ backgroundColor: teamColor }} />

            {featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-f1-red px-4 py-1 text-xs font-mono uppercase tracking-wider">
                    Most Wins
                </div>
            )}

            <div className="text-center pt-2">
                <div className="flex justify-center gap-1 mb-4">
                    {[...Array(titles)].map((_, i) => (
                        <Trophy key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" />
                    ))}
                </div>
                <div className="text-6xl font-racing text-f1-red mb-2">{titles}×</div>
                <div className="text-xs text-gray-500 font-mono mb-4">WORLD CHAMPION</div>
                <div className="text-2xl font-racing text-white mb-2">{name}</div>
                <div className="text-sm font-mono mb-1" style={{ color: teamColor }}>{team}</div>
                <div className="text-sm text-gray-400 mb-4">{wins} Career Wins</div>
                <div className="text-xs text-gray-600 font-mono">{era}</div>
            </div>
        </div>
    );
}

function FeatureCard({ to, title, description, gradient, visible, delay }) {
    return (
        <Link
            to={to}
            className={`group relative bg-gray-900/30 backdrop-blur-sm border border-gray-800 p-10 hover:border-f1-red transition-all duration-700 hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10">
                <h3 className="text-2xl font-racing text-white mb-4 group-hover:text-f1-red transition-colors">
                    {title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                    {description}
                </p>
                <div className="flex items-center gap-2 text-f1-red font-mono text-sm uppercase tracking-wider">
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
            </div>
        </Link>
    );
}
