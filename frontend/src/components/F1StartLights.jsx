import { useState, useEffect } from 'react';

export default function F1StartLights({ onComplete, duration = 3000 }) {
    const [activeLight, setActiveLight] = useState(0);
    const [lightsOut, setLightsOut] = useState(false);

    useEffect(() => {
        const lightInterval = duration / 6; // Time per light

        const timers = [];

        // Light up sequence: 1, 2, 3, 4, 5
        for (let i = 1; i <= 5; i++) {
            timers.push(setTimeout(() => {
                setActiveLight(i);
            }, lightInterval * i));
        }

        // Lights out
        timers.push(setTimeout(() => {
            setLightsOut(true);
        }, lightInterval * 5.5));

        // Complete callback
        timers.push(setTimeout(() => {
            if (onComplete) onComplete();
        }, duration));

        return () => timers.forEach(t => clearTimeout(t));
    }, [duration, onComplete]);

    return (
        <div className="fixed inset-0 bg-black flex items-start justify-center pt-8 z-50">
            <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((light) => (
                    <div
                        key={light}
                        className={`w-12 h-12 rounded-full border-4 border-gray-700 transition-all duration-200 ${lightsOut
                                ? 'bg-gray-900 border-gray-800'
                                : activeLight >= light
                                    ? 'bg-red-600 border-red-500 shadow-lg shadow-red-500/50'
                                    : 'bg-gray-900'
                            }`}
                    />
                ))}
            </div>
            <p className="absolute bottom-8 text-gray-600 font-mono text-xs uppercase tracking-wider">
                {lightsOut ? 'GO!' : 'Loading...'}
            </p>
        </div>
    );
}
