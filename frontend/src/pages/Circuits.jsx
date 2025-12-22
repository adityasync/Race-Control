import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCircuitsWithStats, getCircuitStats } from '../services/api';

import SmartLoader from '../components/SmartLoader';
import CircuitMap from '../components/CircuitMap';
import { ChevronRight, MapPin, Flag, Timer, Trophy } from 'lucide-react';

export default function Circuits() {
    const [circuits, setCircuits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCircuit, setSelectedCircuit] = useState(null);
    const [stats, setStats] = useState(null);

    const [showMobilePreview, setShowMobilePreview] = useState(false);

    useEffect(() => {
        const fetchCircuits = async () => {
            try {
                const res = await getCircuitsWithStats();
                setCircuits(res.data);
                if (res.data.length > 0) {
                    setSelectedCircuit(res.data[0]);
                }
            } catch (err) {
                console.error('Failed to load circuits:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCircuits();
    }, []);

    // Fetch detailed stats when selection changes
    useEffect(() => {
        if (!selectedCircuit) return;

        const fetchDetails = async () => {
            try {
                const res = await getCircuitStats(selectedCircuit.circuit_id);
                setStats(res.data);
            } catch (err) {
                console.error('Failed to load circuit stats:', err);
            }
        };
        fetchDetails();
    }, [selectedCircuit]);

    const handleCircuitSelect = (circuit) => {
        setSelectedCircuit(circuit);
        setShowMobilePreview(true);
    };

    if (loading) return <SmartLoader message="Loading circuits..." />;

    // Helper for Stats
    const StatItem = ({ label, value, subtext, icon: Icon, color = "text-white" }) => (
        <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800 backdrop-blur-sm overflow-hidden">
            <div className={`shrink-0 p-2 rounded-full bg-gray-800 ${color}`}>
                <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-[10px] text-gray-500 uppercase font-mono tracking-wider truncate">{label}</div>
                <div className="text-sm md:text-lg font-racing text-white truncate">{value}</div>
                {subtext && <div className="text-[10px] text-gray-400 font-mono truncate" title={subtext}>{subtext}</div>}
            </div>
        </div>
    );

    const lapRecord = stats?.fastestLaps?.[0];

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden h-screen pt-16">
            {/* Left Panel: Content & List */}
            <div className={`w-full md:w-1/2 lg:w-2/5 flex-col h-full bg-black border-r border-gray-900 overflow-y-auto custom-scrollbar relative z-10 ${showMobilePreview ? 'hidden md:flex' : 'flex'}`}>

                {/* Header */}
                <div className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-gray-800 p-6 z-30 shadow-2xl">


                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-3xl md:text-4xl text-white font-racing tracking-tight uppercase">
                            Circuit <span className="text-f1-red">Archive</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1 max-w-md">
                            Explore the legendary tracks of Formula 1 history. Select a circuit to view its layout and statistics.
                        </p>
                    </motion.div>
                </div>

                {/* List */}
                <div className="p-4 space-y-3 pb-24 md:pb-4">
                    {circuits.map((circuit, i) => (
                        <motion.div
                            key={circuit.circuit_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i }}
                        >
                            <div
                                onClick={() => handleCircuitSelect(circuit)}
                                className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${selectedCircuit?.circuit_id === circuit.circuit_id
                                    ? 'bg-gray-900 border-f1-red shadow-[0_0_20px_rgba(255,24,1,0.1)]'
                                    : 'bg-gray-900/40 border-gray-800 hover:bg-gray-900 hover:border-gray-700'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className={`text-lg font-racing transition-colors ${selectedCircuit?.circuit_id === circuit.circuit_id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                                            }`}>
                                            {circuit.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <MapPin size={12} />
                                            <span>{circuit.location}, {circuit.country}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-xs font-mono px-2 py-1 rounded ${selectedCircuit?.circuit_id === circuit.circuit_id ? 'bg-f1-red text-white' : 'bg-gray-800 text-gray-400'
                                            }`}>
                                            {circuit.total_races} Races
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs text-gray-500 border-t border-gray-800/50 pt-3">
                                    <span>First: {circuit.first_race}</span>
                                    <Link
                                        to={`/circuits/${circuit.circuit_id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1 hover:text-f1-red transition-colors cursor-pointer z-20"
                                    >
                                        View Details <ChevronRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Preview */}
            <div className={`md:flex w-full md:w-1/2 lg:w-3/5 bg-gradient-to-br from-gray-900 via-black to-black relative items-center justify-center overflow-hidden border-l border-gray-800 ${showMobilePreview ? 'flex fixed inset-0 z-50 pt-16' : 'hidden'}`}>

                {/* Mobile Back Button */}
                <button
                    onClick={() => setShowMobilePreview(false)}
                    className="md:hidden absolute top-20 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur border border-gray-700 rounded-full text-white text-sm font-mono hover:bg-gray-800 transition-colors"
                >
                    <ChevronRight className="rotate-180 w-4 h-4" /> Back to Archive
                </button>

                {/* Background Grid/Effects */}
                <div className="absolute inset-0 bg-[url('/assets/grid-bg.svg')] opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none"></div>

                <AnimatePresence mode="wait">
                    {selectedCircuit ? (
                        <motion.div
                            key={selectedCircuit.circuit_id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="relative w-full h-full flex flex-col p-4 md:p-8 lg:p-12 z-20"
                        >
                            {/* Circuit Map Container */}
                            <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                                {/* Glow Effect behind map */}
                                <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-f1-red/5 rounded-full blur-[60px] md:blur-[100px] pointer-events-none"></div>

                                <CircuitMap
                                    name={selectedCircuit.name}
                                    location={selectedCircuit.location}
                                    country={selectedCircuit.country}
                                    className="w-full max-w-2xl h-full max-h-[600px] z-10"
                                />
                            </div>

                            {/* Circuit Quick Stats Overlay */}
                            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 z-20 pb-20 md:pb-0">
                                <StatItem
                                    label="Total Races"
                                    value={selectedCircuit.total_races}
                                    icon={Flag}
                                    color="text-f1-red"
                                />
                                <StatItem
                                    label="Lap Record"
                                    value={lapRecord ? lapRecord.fastest_lap_time : "N/A"}
                                    subtext={lapRecord ? `${lapRecord.driver} (${lapRecord.year})` : "-"}
                                    icon={Trophy}
                                    color="text-yellow-400"
                                />
                                <StatItem
                                    label="First / Last"
                                    value={`${selectedCircuit.first_race} - ${selectedCircuit.last_race}`}
                                    icon={Timer}
                                    color="text-cyan-400"
                                />
                                <Link
                                    to={`/circuits/${selectedCircuit.circuit_id}`}
                                    className="flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-lg font-racing p-3 text-sm col-span-2 lg:col-span-1"
                                >
                                    View Full Profile
                                </Link>
                            </div>

                            {/* Circuit Location Text Overlay */}
                            <div className="absolute top-24 md:top-8 right-8 text-right z-10 opacity-50 pointer-events-none select-none">
                                <h1 className="text-6xl lg:text-8xl font-black text-gray-800 leading-none tracking-tighter uppercase opacity-30">
                                    {selectedCircuit.location.substring(0, 3)}
                                </h1>
                                <h1 className="text-6xl lg:text-8xl font-black text-transparent stroke-text leading-none tracking-tighter uppercase opacity-30">
                                    {selectedCircuit.country.substring(0, 3)}
                                </h1>
                            </div>

                        </motion.div>
                    ) : (
                        <div className="text-gray-600 font-mono text-sm max-w-xs text-center px-4">
                            Select a circuit from the archive to view its layout and statistics.
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
