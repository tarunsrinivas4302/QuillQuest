// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// const footerLinks = {
//   Company: [
//     { label: 'About', path: '/about' },
//     { label: 'Careers', path: '/careers' },
//     { label: 'Contact', path: '/contact' },
//   ],
//   Resources: [
//     { label: 'Docs', path: '/docs' },
//     { label: 'Support', path: '/support' },
//     { label: 'Blog', path: '/blogs' },
//   ],
//   Legal: [
//     { label: 'Privacy', path: '/privacy' },
//     { label: 'Terms', path: '/terms' },
//   ],
// };

const footerLinks = {};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* <div>
          <h3 className="text-white text-2xl font-bold mb-2">Inkspire</h3>
          <p className="text-sm">
            Write. Share. Inspire. A modern platform for creative minds and thought leaders.
          </p>
        </div> */}

        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h4 className="text-white text-lg font-semibold mb-3">{section}</h4>
            <ul className="space-y-2 text-sm">
              {links.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-yellow-300 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* <div className="text-center border-t border-gray-700 mt-10 pt-6 text-sm text-gray-400"> */}
      <p className='text-sm text-center  text-gray-400'>  © {new Date().getFullYear()} Inkspire. All rights reserved. </p>
      {/* </div> */}
    </footer>
  );
};

export default Footer;
