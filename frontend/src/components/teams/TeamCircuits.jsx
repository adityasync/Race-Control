import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import { MapPin, Trophy } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-f1-black border border-f1-red p-3 rounded shadow-lg text-xs">
                <p className="font-bold text-f1-offwhite">{data.circuit}</p>
                <p className="text-gray-400">Start: P{data.avgGrid}</p>
                <p className="text-gray-400">Finish: P{data.avgFinish}</p>
                <p className="text-f1-red font-bold">{data.totalPoints} Pts</p>
            </div>
        );
    }
    return null;
};

export default function TeamCircuits({ circuits }) {
    if (!circuits || circuits.length === 0) return null;

    // Top 10 circuits by points
    const topCircuits = [...circuits]
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 10);

    return (
        <div className="space-y-8 fade-in">
            {/* Chart Section */}
            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-f1-charcoal border border-f1-warmgray/20 p-6 rounded-lg">
                    <h2 className="text-xl font-racing text-f1-offwhite mb-6 flex items-center gap-2">
                        <MapPin className="text-f1-red" /> Best Hunting Grounds
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topCircuits} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="circuit" stroke="#999" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" />
                                <YAxis stroke="#eee" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600', color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="totalPoints" name="Total Points" radius={[4, 4, 0, 0]}>
                                    {topCircuits.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index < 3 ? '#E10600' : '#444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-f1-charcoal border border-f1-warmgray/20 p-6 rounded-lg">
                    <h2 className="text-xl font-racing text-f1-offwhite mb-6 flex items-center gap-2">
                        <Trophy className="text-f1-red" /> Efficiency Matrix (Grid vs Finish)
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis type="number" dataKey="avgGrid" name="Avg Grid" stroke="#999" label={{ value: 'Avg Start Pos', position: 'bottom', fill: '#666' }} domain={['dataMin - 1', 'dataMax + 1']} reversed />
                                <YAxis type="number" dataKey="avgFinish" name="Avg Finish" stroke="#999" label={{ value: 'Avg Finish Pos', angle: -90, position: 'left', fill: '#666' }} domain={['dataMin - 1', 'dataMax + 1']} reversed />
                                <ZAxis type="number" dataKey="totalPoints" range={[50, 400]} name="Points" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                                <ReferenceLine segment={[{ x: 1, y: 1 }, { x: 20, y: 20 }]} stroke="#666" strokeDasharray="3 3" />
                                <Scatter name="Circuits" data={circuits} fill="#E10600" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-f1-charcoal border border-f1-warmgray/20 p-6 rounded-lg">
                <h2 className="text-xl font-racing text-f1-offwhite mb-6 flex items-center gap-2">
                    <Trophy className="text-yellow-500" /> Circuit Statistics
                </h2>
                <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-f1-red scrollbar-track-black">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-f1-charcoal z-10">
                            <tr className="border-b border-f1-red text-gray-400 font-mono text-xs uppercase shadow-lg">
                                <th className="text-left py-3 px-4">Circuit</th>
                                <th className="text-center py-3 px-4">Races</th>
                                <th className="text-center py-3 px-4">Wins</th>
                                <th className="text-center py-3 px-4">Podiums</th>
                                <th className="text-center py-3 px-4">Best Res</th>
                                <th className="text-center py-3 px-4">Avg Grid</th>
                                <th className="text-center py-3 px-4">Avg Fin</th>
                                <th className="text-center py-3 px-4">DNFs</th>
                                <th className="text-right py-3 px-4">Total Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {circuits.map((circuit, idx) => (
                                <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 font-bold text-f1-offwhite">{circuit.circuit}</td>
                                    <td className="py-3 px-4 text-center text-gray-400">{circuit.races}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={circuit.wins > 0 ? "text-yellow-500 font-bold" : "text-gray-500"}>{circuit.wins}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={circuit.podiums > 0 ? "text-orange-400 font-bold" : "text-gray-500"}>{circuit.podiums}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center text-f1-offwhite">{circuit.bestFinish}</td>
                                    <td className="py-3 px-4 text-center text-gray-400">{circuit.avgGrid}</td>
                                    <td className="py-3 px-4 text-center text-cyan-400 font-mono">{circuit.avgFinish}</td>
                                    <td className="py-3 px-4 text-center text-red-500/80">{circuit.dnfs}</td>
                                    <td className="py-3 px-4 text-right text-f1-red font-mono font-bold">{circuit.totalPoints}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
