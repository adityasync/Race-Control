import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Timer, Users, TrendingUp, MapPin } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <motion.nav
            className={`sticky top-0 z-50 ${isHome ? 'bg-transparent absolute w-full' : 'bg-black'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Racing stripe top - only show on non-home pages */}
            {!isHome && (
                <div className="h-1 bg-gradient-to-r from-f1-red via-orange-500 to-f1-red"></div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo with checkered flag */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div
                            className="w-8 h-8 grid grid-cols-2 grid-rows-2 rounded overflow-hidden"
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-white"></div>
                            <div className="bg-f1-red"></div>
                            <div className="bg-f1-red"></div>
                            <div className="bg-white"></div>
                        </motion.div>
                        <span className="font-racing text-2xl tracking-tighter text-white group-hover:text-f1-red transition-colors">
                            F1<span className="text-f1-red group-hover:text-white">PEDIA</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/drivers" icon={<Users size={16} />} text="Drivers" active={location.pathname.startsWith('/drivers')} />
                        <NavLink to="/teams" icon={<Trophy size={16} />} text="Teams" active={location.pathname.startsWith('/teams')} />
                        <NavLink to="/circuits" icon={<MapPin size={16} />} text="Circuits" active={location.pathname.startsWith('/circuits')} />
                        <NavLink to="/races" icon={<Timer size={16} />} text="Races" active={location.pathname === '/races'} />
                        <NavLink to="/analytics" icon={<TrendingUp size={16} />} text="Analytics" active={location.pathname === '/analytics'} />
                    </div>
                </div>
            </div>

            {!isHome && (
                <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
            )}
        </motion.nav>
    );
}

function NavLink({ to, icon, text, active }) {
    return (
        <Link to={to}>
            <motion.div
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-racing uppercase tracking-wider transition-all
                    ${active
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
            >
                {icon}
                {text}

                {/* Active indicator - racing stripe */}
                {active && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-f1-red"
                        layoutId="navbar-indicator"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </motion.div>
        </Link>
    );
}
