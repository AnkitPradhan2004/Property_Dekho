import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-[color:var(--brand-coral,#FF5533)] text-xl">
            <span className="w-8 h-8 rounded-lg bg-[color:var(--brand-peach,#FFC3B8)] flex items-center justify-center text-[color:var(--brand-espresso,#1A0400)]">PD</span>
            Property-Dekho
          </div>
          <p className="text-gray-300 mt-3">Find, compare and secure your dream property with confidence.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Links</h4>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><a href="/#listings" className="hover:text-white">Browse Properties</a></li>
            <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <p className="text-gray-300">Email: Propertydekho.in@gmail.com</p>
          <p className="text-gray-300">Hours: Mon–Fri, 9am–6pm</p>
          <div className="mt-3">
            <a href="https://github.com/AnkitPradhan2004" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              GitHub: AnkitPradhan2004
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">© {new Date().getFullYear()} Property-Dekho. All rights reserved.</div>
    </footer>
  );
};

export default Footer;


