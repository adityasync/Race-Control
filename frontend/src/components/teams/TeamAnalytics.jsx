import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Trophy, TrendingUp, Activity } from 'lucide-react';

export default function TeamAnalytics({ driverStats }) {
    if (!driverStats || driverStats.length === 0) return null;

    // 1. Top Contributors (Points)
    const topPoints = [...driverStats]
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 10);

    // 2. Victory Distribution (Wins > 0)
    const winners = driverStats
        .filter(d => d.wins > 0)
        .sort((a, b) => b.wins - a.wins);

    // 3. Efficiency (Points per Race, min 5 races)
    const efficientDrivers = driverStats
        .filter(d => d.races >= 5 && d.totalPoints > 0)
        .map(d => ({
            ...d,
            efficiency: d.totalPoints / d.races
        }))
        .sort((a, b) => b.efficiency - a.efficiency)
        .slice(0, 10); // Top 10

    return (
        <div className="bg-f1-charcoal/50 border-y border-f1-red/30 py-12 mb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-racing text-f1-offwhite mb-8 flex items-center gap-3">
                    <Activity className="text-f1-red" /> Team Analytics
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Points Contribution */}
                    <div className="bg-f1-black/50 p-6 rounded-lg border border-f1-warmgray/20">
                        <h3 className="text-xl font-racing text-f1-offwhite mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-yellow-500" /> Top Point Scorers
                        </h3>
                        <div className="h-[500px] md:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topPoints} layout="vertical" margin={{ left: 10, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                    <XAxis type="number" stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis
                                        type="category"
                                        dataKey="surname"
                                        stroke="#eee"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        width={80}
                                        tickFormatter={(val) => val.split(' ').pop()}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                    <Bar dataKey="totalPoints" name="Points" radius={[0, 4, 4, 0]}>
                                        {topPoints.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index < 3 ? '#E10600' : '#444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Efficiency Stats */}
                    <div className="bg-f1-black/50 p-6 rounded-lg border border-f1-warmgray/20">
                        <h3 className="text-xl font-racing text-f1-offwhite mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-cyan-400" /> Driver Efficiency (Pts/Race)
                        </h3>
                        <div className="h-[500px] md:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={efficientDrivers} layout="vertical" margin={{ left: 10, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                    <XAxis type="number" stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis
                                        type="category"
                                        dataKey="surname"
                                        stroke="#eee"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        width={80}
                                        tickFormatter={(val) => val.split(' ').pop()}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                    <Bar dataKey="efficiency" name="Pts/Race" radius={[0, 4, 4, 0]}>
                                        {efficientDrivers.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index < 3 ? '#00D2BE' : '#333'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Wins Distribution - Full Width if data exists */}
                    {winners.length > 0 && (
                        <div className="lg:col-span-2 bg-f1-black/50 p-6 rounded-lg border border-f1-warmgray/20">
                            <h3 className="text-xl font-racing text-f1-offwhite mb-6 flex items-center gap-2">
                                <Trophy size={20} className="text-yellow-500" /> Race Winners
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={winners}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis
                                            dataKey="surname"
                                            stroke="#999"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                        <Bar dataKey="wins" name="Wins" radius={[4, 4, 0, 0]}>
                                            {winners.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill="#FFD700" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-f1-black border border-f1-red p-3 rounded shadow-lg text-f1-offwhite">
                <p className="font-racing text-lg">{label}</p>
                <p className="text-sm font-mono text-f1-warmgray">
                    {payload[0].name}: <span className="text-f1-red font-bold">{payload[0].value.toFixed(2)}</span>
                </p>
            </div>
        );
    }
    return null;
};
