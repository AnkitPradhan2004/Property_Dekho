import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-[color:var(--brand-coral,#FF5533)] text-xl">
            <span className="w-8 h-8 rounded-lg bg-[color:var(--brand-peach,#FFC3B8)] flex items-center justify-center text-[color:var(--brand-espresso,#1A0400)]">PD</span>
            Property-Dekho
          </div>
          <p className="text-gray-600 mt-3">Find, compare and secure your dream property with confidence.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Links</h4>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="/" className="hover:text-gray-900">Home</Link></li>
            <li><a href="/#listings" className="hover:text-gray-900">Browse Properties</a></li>
            <li><Link to="/dashboard" className="hover:text-gray-900">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
          <p className="text-gray-600">Email: support@property-dekho.com</p>
          <p className="text-gray-600">Hours: Mon–Fri, 9am–6pm</p>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-gray-500">© {new Date().getFullYear()} Property-Dekho. All rights reserved.</div>
    </footer>
  );
};

export default Footer;


