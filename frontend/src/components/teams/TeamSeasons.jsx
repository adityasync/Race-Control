import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Calendar, Trophy, TrendingUp, UserCheck } from 'lucide-react';

const COLORS = ['#E10600', '#F1F1F1', '#5D5D5D', '#FFD700', '#FF8700', '#1E90FF'];

export default function TeamSeasons({ seasons }) {
    if (!seasons || seasons.length === 0) return null;

    // Reverse for chronological chart (it usually comes sorted desc)
    const chartData = [...seasons].reverse();

    // extract all unique driver names for the stacked bar chart keys
    const allDriverNames = Array.from(new Set(
        seasons.flatMap(s => s.driverPoints ? Object.keys(s.driverPoints) : [])
    ));

    return (
        <div className="space-y-8 fade-in">
            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-f1-charcoal border border-f1-warmgray/20 p-6 rounded-lg">
                    <h2 className="text-xl font-racing text-f1-offwhite mb-6 flex items-center gap-2">
                        <TrendingUp className="text-f1-red" /> Performance Progression
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="year" stroke="#999" />
                                <YAxis yAxisId="left" stroke="#E10600" width={40} />
                                <YAxis yAxisId="right" orientation="right" stroke="#FFD700" width={40} />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600', color: '#fff' }} />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="points" name="Points" stroke="#E10600" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line yAxisId="right" type="stepAfter" dataKey="wins" name="Wins" stroke="#FFD700" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-f1-charcoal border border-f1-warmgray/20 p-6 rounded-lg">
                    <h2 className="text-xl font-racing text-f1-offwhite mb-6 flex items-center gap-2">
                        <UserCheck className="text-f1-red" /> Driver Battle (Points Split)
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="year" stroke="#999" />
                                <YAxis stroke="#eee" />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #E10600', color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Legend />
                                {/* Dynamically generate bars for drivers is tricky with Recharts if keys vary.
                                    For now, we'll flatten the driverPoints data into the main object in the parent or here.
                                */}
                                {allDriverNames.slice(0, 5).map((driver, index) => (
                                    <Bar key={driver} dataKey={`driverPoints.${driver}`} name={driver} stackId="a" fill={COLORS[index % COLORS.length]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-f1-charcoal border border-f1-warmgray/20 p-6 rounded-lg">
                <h2 className="text-xl font-racing text-f1-offwhite mb-6 flex items-center gap-2">
                    <Calendar className="text-f1-red" /> Season Breakdown
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400 font-mono text-xs uppercase">
                                <th className="text-left py-3 px-4">Year</th>
                                <th className="text-center py-3 px-4">Races</th>
                                <th className="text-center py-3 px-4">Wins</th>
                                <th className="text-center py-3 px-4">Podiums</th>
                                <th className="text-center py-3 px-4">Best Pos</th>
                                <th className="text-center py-3 px-4">Avg Grid</th>
                                <th className="text-center py-3 px-4">DNFs</th>
                                <th className="text-right py-3 px-4">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seasons.map((season) => (
                                <tr key={season.year} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 font-racing text-lg text-f1-offwhite">{season.year}</td>
                                    <td className="py-3 px-4 text-center text-gray-400">{season.races}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={season.wins > 0 ? "text-yellow-500 font-bold" : "text-gray-500"}>{season.wins}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={season.podiums > 0 ? "text-orange-400 font-bold" : "text-gray-500"}>{season.podiums}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center text-f1-offwhite">{season.bestFinish}</td>
                                    <td className="py-3 px-4 text-center text-gray-400">{season.avgGrid}</td>
                                    <td className="py-3 px-4 text-center text-red-500/80">{season.dnfs}</td>
                                    <td className="py-3 px-4 text-right text-f1-red font-mono font-bold">{season.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
