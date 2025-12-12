import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, BarChart3 } from 'lucide-react';
import ParticleCanvas from '../components/ParticleCanvas';
import TeamColorSpectrum from '../components/TeamColorSpectrum';

// F1 Team colors for the intro bars
const TEAM_COLORS = [
    '#E10600', '#FF8000', '#00D2BE', '#1E41FF', '#006F62',
    '#0090FF', '#2B4562', '#900000', '#FFFFFF', '#B6BABD',
    '#FFD700', '#00A651', '#3399FF', '#FF1493', '#8B4513',
    '#DC143C', '#4169E1', '#32CD32', '#FF6347', '#9932CC'
];

export default function Home() {
    const [phase, setPhase] = useState('darkness'); // darkness, line, bars, reveal, main
    const [counter, setCounter] = useState(0);
    const [hoveredCta, setHoveredCta] = useState(null);

    // Check if already visited
    useEffect(() => {
        const seen = sessionStorage.getItem('f1pedia-seen');
        if (seen) {
            setPhase('main');
        }
    }, []);

    // Intro sequence timing
    useEffect(() => {
        if (phase === 'main') return;

        const sequence = {
            darkness: { next: 'line', delay: 2000 },
            line: { next: 'bars', delay: 1500 },
            bars: { next: 'reveal', delay: 2500 },
            reveal: { next: 'main', delay: 2000 },
        };

        const current = sequence[phase];
        if (!current) return;

        const timer = setTimeout(() => {
            setPhase(current.next);
            if (current.next === 'main') {
                sessionStorage.setItem('f1pedia-seen', 'true');
            }
        }, current.delay);

        return () => clearTimeout(timer);
    }, [phase]);

    // Counter animation
    useEffect(() => {
        if (phase !== 'main') return;

        const target = 2847593;
        const duration = 2500;
        const start = Date.now();

        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCounter(Math.floor(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [phase]);

    // ========== INTRO PHASES ==========

    // Phase 1: Pure darkness
    if (phase === 'darkness') {
        return <div className="fixed inset-0 bg-black" />;
    }

    // Phase 2: White line draws across
    if (phase === 'line') {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <div
                    className="h-[2px] bg-white animate-line-draw"
                    style={{ width: '60%' }}
                />
                <style>{`
                    @keyframes line-draw {
                        from { transform: scaleX(0); }
                        to { transform: scaleX(1); }
                    }
                    .animate-line-draw {
                        animation: line-draw 1.2s ease-out forwards;
                    }
                `}</style>
            </div>
        );
    }

    // Phase 3: Colored bars fade in
    if (phase === 'bars') {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                {/* The white line stays */}
                <div className="absolute h-[2px] bg-white/30" style={{ width: '60%' }} />

                {/* Colored bars rise up */}
                <div className="flex items-end gap-[3px] h-[40vh]">
                    {TEAM_COLORS.map((color, i) => (
                        <div
                            key={i}
                            className="w-[12px] rounded-t-sm animate-bar-rise"
                            style={{
                                backgroundColor: color,
                                height: `${30 + Math.sin(i * 0.7) * 25}%`,
                                animationDelay: `${i * 60}ms`,
                                opacity: 0.8,
                            }}
                        />
                    ))}
                </div>
                <style>{`
                    @keyframes bar-rise {
                        from { transform: scaleY(0); opacity: 0; }
                        to { transform: scaleY(1); opacity: 0.8; }
                    }
                    .animate-bar-rise {
                        transform-origin: bottom;
                        animation: bar-rise 0.8s ease-out forwards;
                    }
                `}</style>
            </div>
        );
    }

    // Phase 4: Reveal tagline
    if (phase === 'reveal') {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
                {/* Bars fade to background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="flex items-end gap-[3px] h-[40vh]">
                        {TEAM_COLORS.map((color, i) => (
                            <div
                                key={i}
                                className="w-[12px] rounded-t-sm"
                                style={{
                                    backgroundColor: color,
                                    height: `${30 + Math.sin(i * 0.7) * 25}%`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Tagline appears */}
                <div className="relative z-10 text-center animate-fade-up">
                    <p className="text-3xl md:text-5xl font-racing text-white tracking-wide">
                        <span className="text-f1-red">75</span> Years.{' '}
                        <span className="text-f1-red">1,000+</span> Races.{' '}
                        <span className="text-f1-red">850+</span> Drivers.
                    </p>
                    <p className="text-xl md:text-2xl text-gray-500 font-racing mt-4">
                        One Story.
                    </p>
                </div>
                <style>{`
                    @keyframes fade-up {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-up {
                        animation: fade-up 1s ease-out forwards;
                    }
                `}</style>
            </div>
        );
    }

    // ========== MAIN HOMEPAGE ==========
    return (
        <div className={`min-h-screen bg-black transition-all duration-700 ${hoveredCta === 'teams' ? 'bg-gradient-to-b from-red-950/50 to-black' :
                hoveredCta === 'drivers' ? 'bg-gradient-to-b from-slate-900/50 to-black' :
                    hoveredCta === 'data' ? 'bg-gradient-to-b from-amber-950/50 to-black' : ''
            }`}>
            {/* Living particle background */}
            <ParticleCanvas particleCount={250} />

            {/* Content */}
            <div className="relative z-10">

                {/* Panel 1: The Question */}
                <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-racing text-white leading-relaxed max-w-4xl">
                        What if you could see <span className="text-f1-red">every race</span>,<br />
                        every driver, every team,<br />
                        across <span className="text-f1-red">75 years</span> of Formula 1<br />
                        as a single, <span className="italic text-gray-400">living organism</span>?
                    </h1>

                    {/* Stats display */}
                    <div className="mt-16 flex flex-col md:flex-row items-center gap-12">
                        {/* Lap counter */}
                        <div className="text-center">
                            <div className="text-6xl md:text-8xl font-racing text-f1-red tabular-nums tracking-tight">
                                {counter.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-600 font-mono uppercase tracking-widest mt-2">
                                Total Laps Ever Driven
                            </div>
                        </div>

                        {/* Heartbeat visualization */}
                        <div className="flex items-end gap-[2px] h-16">
                            {[2, 4, 3, 8, 5, 10, 6, 9, 4, 7, 3, 5, 2, 4, 6, 8, 5, 3].map((h, i) => (
                                <div
                                    key={i}
                                    className="w-[3px] bg-f1-red/60 rounded-t animate-pulse"
                                    style={{
                                        height: `${h * 6}px`,
                                        animationDelay: `${i * 100}ms`,
                                        animationDuration: '1.5s',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Scroll hint */}
                    <div className="absolute bottom-12 text-gray-700 animate-bounce">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                    </div>
                </section>

                {/* Panel 2: The Spectrum */}
                <section className="py-24 px-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-racing text-white mb-4 text-center">
                            The Spectrum of <span className="text-f1-red">Speed</span>
                        </h2>
                        <p className="text-gray-600 text-center mb-12 font-mono text-sm">
                            Hover to explore 75 years of motorsport history
                        </p>
                        <TeamColorSpectrum />
                    </div>
                </section>

                {/* Panel 3: The Invitation - Podium CTAs */}
                <section className="py-24 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-end justify-center gap-6">
                            {/* 3rd - Bronze */}
                            <InvitationCard
                                to="/analytics"
                                icon={<BarChart3 size={36} />}
                                label="Dive Into Data"
                                position={3}
                                onHover={() => setHoveredCta('data')}
                                onLeave={() => setHoveredCta(null)}
                            />
                            {/* 1st - Gold */}
                            <InvitationCard
                                to="/teams"
                                icon={<Trophy size={42} />}
                                label="Explore Teams"
                                position={1}
                                onHover={() => setHoveredCta('teams')}
                                onLeave={() => setHoveredCta(null)}
                            />
                            {/* 2nd - Silver */}
                            <InvitationCard
                                to="/drivers"
                                icon={<Users size={36} />}
                                label="Discover Drivers"
                                position={2}
                                onHover={() => setHoveredCta('drivers')}
                                onLeave={() => setHoveredCta(null)}
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 border-t border-white/5">
                    <div className="flex justify-center gap-0.5 mb-6">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 ${i % 2 === 0 ? 'bg-white/80' : 'bg-black'}`} />
                        ))}
                    </div>
                    <p className="text-center text-gray-800 font-mono text-xs uppercase tracking-widest">
                        F1Pedia • The Living Archive
                    </p>
                </footer>
            </div>
        </div>
    );
}

// Podium-style invitation card
function InvitationCard({ to, icon, label, position, onHover, onLeave }) {
    const heights = { 1: 'h-72', 2: 'h-56', 3: 'h-48' };
    const accents = {
        1: 'hover:border-f1-red hover:shadow-red-500/20',
        2: 'hover:border-gray-400 hover:shadow-gray-500/20',
        3: 'hover:border-amber-500 hover:shadow-amber-500/20',
    };

    return (
        <Link
            to={to}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className={`
                group relative flex flex-col items-center justify-center
                w-44 md:w-52 ${heights[position]}
                bg-gray-900/40 backdrop-blur border border-gray-800
                transition-all duration-500 hover:bg-gray-900/60 hover:shadow-2xl hover:scale-105
                ${accents[position]}
            `}
        >
            {/* Position number */}
            <div className="absolute -top-5 w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center font-racing text-lg text-white group-hover:bg-white group-hover:text-black transition-all">
                {position}
            </div>

            <div className="text-gray-500 group-hover:text-white transition-colors mb-4">
                {icon}
            </div>

            <span className="font-racing text-lg text-white uppercase tracking-wider text-center leading-tight">
                {label}
            </span>
        </Link>
    );
}
