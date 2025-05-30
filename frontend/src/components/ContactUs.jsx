import { FaLinkedin, FaInstagram, FaXTwitter, FaFacebook } from "react-icons/fa6";

const ContactUs = () => {
  return (
    <footer className="bg-black text-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-yellow-400 mb-2">
          On a mission to change how the{" "}
          <span className="font-bold">world interviews forever</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="/why-us" className="text-gray-400 hover:text-white">Why LiveHire?</a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-400 hover:text-white">Pricing</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Compare Section */}
          <div>
            <h3 className="text-lg font-semibold">Compare</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Vs Karat</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Vs Incruiter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Vs Interviewvector</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Vs Barraiser</a></li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold">Follow us</h3>
            <div className="flex gap-4 mt-3">
              <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaLinkedin /></a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaXTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaFacebook /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-4 flex justify-between items-center">
          <p className="text-gray-400">LiveHire © 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default ContactUs;
