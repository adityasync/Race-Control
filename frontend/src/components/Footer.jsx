import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="relative bg-black border-t border-gray-900 mt-16">
            {/* Full-width checkered flag banner - smaller on mobile */}
            <div
                className="absolute left-0 right-0 -top-3 h-6 md:-top-4 md:h-8"
                style={{
                    background: 'repeating-conic-gradient(#000 0deg 90deg, #fff 90deg 180deg) 0 0/12px 12px'
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 pt-8 md:pt-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <Link to="/" className="flex items-center justify-center md:justify-start gap-1 group">
                            <span className="text-4xl font-racing text-white group-hover:text-f1-red transition-colors">
                                Race<span className="text-f1-red group-hover:text-white"> Control</span>
                            </span>
                        </Link>
                        <p className="text-gray-600 font-mono text-xs tracking-wider mt-2">
                            THE COMPLETE F1 ARCHIVE • 1950—2024
                        </p>
                    </div>

                    <div className="text-center md:text-right">
                        <blockquote className="font-racing text-lg md:text-xl text-f1-offwhite italic">
                            &quot;If my mom had balls, she&apos;d be my dad&quot;
                        </blockquote>
                        <p className="text-f1-red font-mono text-xs uppercase mt-2 tracking-widest">
                            — <Link to="/drivers/830" className="hover:text-white transition-colors border-b border-transparent hover:border-white">Max Verstappen</Link>
                        </p>
                    </div>
                </div>

                {/* Racing stripe divider */}
                <div className="flex items-center gap-2 mt-12">
                    <div className="h-px flex-1 bg-gray-800" />
                    <div className="flex gap-1">
                        <div className="w-8 h-1 bg-f1-red" />
                        <div className="w-4 h-1 bg-orange-500" />
                        <div className="w-2 h-1 bg-yellow-500" />
                    </div>
                    <div className="h-px flex-1 bg-gray-800" />
                </div>

                <p className="text-center text-gray-700 font-mono text-xs mt-8">
                    Data sourced from Ergast Developer API
                </p>
                <p className="text-center text-gray-700 font-mono text-xs mt-2">
                    made by <a href="https://github.com/adityasync" target="_blank" rel="noopener noreferrer" className="hover:text-f1-red transition-colors">aditya</a>
                </p>
            </div>
        </footer>
    );
}
