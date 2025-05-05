
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, X, Bell } from 'lucide-react';
// import HeaderCTA from './header-cta';

// const navLinks = [
//     { label: 'Home', path: '/' },
//     { label: 'Blogs', path: '/blogs' },
//     { label: 'Categories', path: '/categories' },
//     { label: 'About', path: '/about' },
// ];

// const Header = () => {
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//     // TODO  : Need to fetch the notifications count from the server
//     const notifications = 3; // Example notification count
//     return (
//         <header className="shadow-2xl bg-gray-50 sticky top-0 font-mono z-50">
//             <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//                 {/* Brand */}
//                 <Link
//                     to="/"
//                     className="text-3xl font-bold text-gray-900 tracking-wide hover:opacity-90 transition font-mono"
//                 >
//                     Inkspire
//                 </Link>

//                 {/* Desktop Navigation */}
//                 <nav className="hidden md:flex items-center space-x-6">
//                     {navLinks.map((link) => (
//                         <Link
//                             key={link.path}
//                             to={link.path}
//                             className="text-gray-900 hover:border-b hover:transition duration-300"
//                         >
//                             {link.label}
//                         </Link>
//                     ))}
//                 </nav>

//                 <div className="hidden md:flex items-center space-x-4">
//                     <Link to="/updates" className='relative '>
//                         <Bell className="inline-block " size={22} />
//                         <span className={`absolute -top-1  left-2 bg-red-500 text-white text-xs rounded-full px-1.5 ${notifications ? "animate-bounce opacity-80" : ""} `}>
//                             {notifications}
//                         </span>
//                     </Link>

//                 </div>
//                 <div className='flex items-center space-x-4'>
//                     <HeaderCTA />

//                     {/* Mobile Menu Toggle */}
//                     <button
//                         className="md:hidden text-gray-900 focus:outline-none"
//                         onClick={toggleMobileMenu}
//                     >
//                         {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
//                     </button>
//                 </div>
//             </div>

//             {/* Mobile Navigation */}
//             {isMobileMenuOpen && (
//                 <>
//                     <div className="md:hidden px-4 pb-4 space-y-4 animate-slide-down">
//                         <div className="space-y-2">
//                             {navLinks.map((link) => (
//                                 <Link
//                                     key={link.path}
//                                     to={link.path}
//                                     onClick={() => setIsMobileMenuOpen(false)}
//                                     className="block text-gray-900 border-b py-2"
//                                 >
//                                     {link.label}
//                                 </Link>
//                             ))}
//                         </div>

//                         {/* Notifications */}
//                         <div className="flex items-center space-x-2">
//                             <Bell size={20} className="text-gray-700" />
//                             <span className="text-sm">You have {notifications} new notifications</span>
//                         </div>

//                     </div>
//                 </>
//             )}
//         </header>
//     );
// };

// export default Header;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell } from 'lucide-react';
import HeaderCTA from './header-cta';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Categories', path: '/categories' },
  { label: 'About', path: '/about' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notifications = 3;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="shadow-2xl bg-gray-50 sticky top-0 font-mono z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-3xl font-bold text-gray-900 tracking-wide hover:opacity-90 transition font-mono"
        >
          Inkspire
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-900 hover:border-b hover:transition duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side (Avatar and Hamburger) */}
        <div className="flex items-center space-x-4">
          {/* Notifications (Desktop only) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/updates" className="relative">
              <Bell className="inline-block" size={22} />
              <span className={`absolute -top-1 left-2 bg-red-500 text-white text-xs rounded-full px-1.5 ${notifications ? 'animate-bounce opacity-80' : ''}`}>
                {notifications}
              </span>
            </Link>
          </div>

          {/* HeaderCTA: Avatar always visible */}
          <HeaderCTA />

          {/* Hamburger menu (Mobile only) */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-900 focus:outline-none">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - only nav links */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 animate-slide-down">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-900 border-b py-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
