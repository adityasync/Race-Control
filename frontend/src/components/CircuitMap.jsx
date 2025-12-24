import { useMemo } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import geoData from '../data/f1-circuits.json';

export default function CircuitMap({ name, location, className = "" }) {
    // 1. Find the matching feature
    const feature = useMemo(() => {
        if (!geoData || !geoData.features) return null;

        // Try to match by name or location
        // Normalize strings for comparison
        const norm = (str) => str?.toLowerCase().replace(/[^a-z0-9]/g, '');
        const targetName = norm(name);
        const targetLocation = norm(location);

        return geoData.features.find(f => {
            const fName = norm(f.properties.Name);
            const fLocation = norm(f.properties.Location);
            // Some checks
            return fName && targetName && (fName.includes(targetName) || targetName.includes(fName)) ||
                fLocation && targetLocation && fLocation === targetLocation;
        });
    }, [name, location]);

    // 2. Convert coordinates to SVG path
    const pathData = useMemo(() => {
        if (!feature) return null;

        const type = feature.geometry.type;
        if (type !== "LineString" && type !== "MultiLineString") return null;

        // Normalize to array of Lines (each Line is array of [x, y])
        // LineString: [ [x,y], [x,y] ] -> Wrap in array -> [ [ [x,y], ... ] ]
        // MultiLineString: [ [ [x,y], ... ], [ [x,y], ... ] ] -> Already correct
        const lines = type === "LineString"
            ? [feature.geometry.coordinates]
            : feature.geometry.coordinates;

        if (!lines || lines.length === 0) return null;

        // Flatten all points to find bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        lines.forEach(line => {
            line.forEach(([x, y]) => {
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            });
        });

        const width = maxX - minX;
        const height = maxY - minY;

        // Let's normalize to 0-100 for simplicity in styling
        const scale = 100 / Math.max(width, height);

        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        // Center offsets
        const dx = (100 - scaledWidth) / 2;
        const dy = (100 - scaledHeight) / 2;

        // Convert each line to an "M ... L ..." string
        const pathSegments = lines.map(line => {
            const linePoints = line.map(([x, y]) => {
                const px = ((x - minX) * scale) + dx;
                // Flip Y and center
                const py = (100 - dy) - ((y - minY) * scale);
                return `${px},${py}`;
            }).join(" L ");
            return `M ${linePoints}`;
        });

        // Join all segments into one path string
        return pathSegments.join(" ");
    }, [feature]);

    if (!feature || !pathData) {
        return (
            <div className={`relative flex items-center justify-center bg-gray-900/40 rounded-lg border border-gray-800/50 overflow-hidden ${className}`}>
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('/grid-bg.png')] bg-center bg-cover mix-blend-overlay"></div>

                {/* Diagonal Striped overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)'
                }}></div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        className="w-12 h-12 border-2 border-gray-700 rounded-full flex items-center justify-center"
                    >
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </motion.div>
                    <div className="flex flex-col items-center">
                        <span className="text-gray-500 text-xs font-mono tracking-widest uppercase mb-1">Telemetry Offline</span>
                        <span className="text-gray-700 text-[10px] font-mono tracking-widest">Layout Coming Soon</span>
                    </div>
                </div>

                {/* Corner accents */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-red-500/30"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-red-500/30"></div>
            </div>
        );
    }

    return (
        <div className={`relative flex items-center justify-center p-4 ${className}`}>
            <svg
                viewBox="-10 -10 120 120"
                className="w-full h-full drop-shadow-[0_0_15px_rgba(255,24,1,0.3)]"
                style={{ overflow: 'visible' }}
            >
                {/* Track Outline (Glow blur) */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke="#FF1801"
                    strokeWidth="4"
                    strokeOpacity="0.2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
                {/* Track Base */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke="#333"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {/* Active drawing track */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke="#FF1801" // F1 Red
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                />
            </svg>

            {/* Optional: Label */}
            {/* <div className="absolute bottom-2 right-2 text-[10px] text-gray-500 font-mono">
                {feature.properties.Name}
            </div> */}
        </div>
    );
}
