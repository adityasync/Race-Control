import { useState } from 'react';

// F1 Team colors by era - dominant teams get wider bands
const TEAM_COLORS = [
    // 1950s - British Racing Green era
    { color: '#004225', team: 'British Racing Green', start: 1950, end: 1959 },
    { color: '#CD853F', team: 'Maserati', start: 1950, end: 1957 },

    // 1960s - Mix of eras
    { color: '#004225', team: 'Lotus Green', start: 1960, end: 1969 },
    { color: '#FF0000', team: 'Ferrari', start: 1960, end: 1969 },

    // 1970s - Lotus, Ferrari dominance
    { color: '#FFD700', team: 'Lotus Gold/Black', start: 1970, end: 1978 },
    { color: '#FF0000', team: 'Ferrari', start: 1975, end: 1979 },

    // 1980s - McLaren/Williams rise
    { color: '#FF0000', team: 'Ferrari', start: 1980, end: 1983 },
    { color: '#FFFFFF', team: 'Williams', start: 1980, end: 1987 },
    { color: '#FF8C00', team: 'McLaren Marlboro', start: 1984, end: 1989 },

    // 1990s - Williams/McLaren/Ferrari
    { color: '#0057A0', team: 'Williams Rothmans', start: 1990, end: 1997 },
    { color: '#DC0000', team: 'Ferrari', start: 1998, end: 1999 },

    // 2000s - Ferrari Schumacher era
    { color: '#DC0000', team: 'Ferrari', start: 2000, end: 2004 },
    { color: '#00A3E0', team: 'Renault', start: 2005, end: 2006 },
    { color: '#DC0000', team: 'Ferrari', start: 2007, end: 2008 },
    { color: '#F5C200', team: 'Brawn GP', start: 2009, end: 2009 },

    // 2010s - Red Bull/Mercedes era
    { color: '#0600EF', team: 'Red Bull', start: 2010, end: 2013 },
    { color: '#00D2BE', team: 'Mercedes', start: 2014, end: 2020 },

    // 2020s - Red Bull dominance
    { color: '#0600EF', team: 'Red Bull', start: 2021, end: 2024 },
];

export default function TeamColorSpectrum({ className = '' }) {
    const [hoveredTeam, setHoveredTeam] = useState(null);

    const startYear = 1950;
    const endYear = 2024;
    const totalYears = endYear - startYear;

    return (
        <div className={`w-full ${className}`}>
            {/* The spectrum bar */}
            <div className="relative h-16 rounded-lg overflow-hidden group cursor-crosshair">
                <div className="absolute inset-0 flex">
                    {Array.from({ length: totalYears + 1 }, (_, i) => {
                        const year = startYear + i;
                        // Find dominant team for this year
                        const team = TEAM_COLORS.find(t => year >= t.start && year <= t.end);
                        const color = team?.color || '#333';

                        return (
                            <div
                                key={year}
                                className="flex-1 transition-all duration-300 hover:flex-[3]"
                                style={{ backgroundColor: color }}
                                onMouseEnter={() => setHoveredTeam({ year, team: team?.team })}
                                onMouseLeave={() => setHoveredTeam(null)}
                            />
                        );
                    })}
                </div>

                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/30 pointer-events-none" />

                {/* Hover tooltip */}
                {hoveredTeam && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 px-3 py-1 rounded text-white text-sm font-mono whitespace-nowrap">
                        {hoveredTeam.year} • {hoveredTeam.team || 'Various'}
                    </div>
                )}
            </div>

            {/* Year markers */}
            <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                <span>1950</span>
                <span>1970</span>
                <span>1990</span>
                <span>2010</span>
                <span>2024</span>
            </div>
        </div>
    );
}
