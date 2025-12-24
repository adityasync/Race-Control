import React from 'react';

/**
 * Health Page
 * A fun system status page featuring an F1-themed quote and GIF.
 */
export default function Health() {
    return (
        <div className="h-screen w-screen bg-f1-black flex flex-col items-center justify-center p-4 text-center overflow-hidden">
            {/* The Quote */}
            <h1 className="text-3xl md:text-5xl font-racing text-f1-offwhite max-w-4xl mb-8 uppercase tracking-tighter leading-tight shrink-0">
                "I'm a <span className="text-f1-red">high performance athlete</span>, athletes sweat, sweat baby, <span className="text-f1-red">kih kih kih</span>, rrrar, sweat sweat, <span className="text-f1-red">woo woo</span>"
            </h1>

            {/* The GIF */}
            <div className="relative group w-full max-w-4xl mx-auto shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-f1-red via-orange-500 to-yellow-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <img
                    src="/mic-check.gif"
                    alt="High Performance Athlete"
                    className="relative rounded-lg border-2 border-f1-offwhite shadow-2xl w-full"
                />
            </div>

            {/* Subtitle */}
            <p className="mt-6 text-f1-warmgray font-mono text-sm animate-pulse shrink-0">
                SYSTEM STATUS: HIGH PERFORMANCE
            </p>
        </div>
    );
}
