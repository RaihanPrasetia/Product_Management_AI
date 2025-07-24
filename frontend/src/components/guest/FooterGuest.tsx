// src/components/Footer.tsx
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function FooterGuest() {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* Logo / Brand Name */}
                    <div className="text-xl font-semibold text-center md:text-left">
                        <span>E-Shop</span>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
                        <a href="/" className="hover:text-gray-400">Home</a>
                        <a href="/about" className="hover:text-gray-400">About Us</a>
                        <a href="/contact" className="hover:text-gray-400">Contact</a>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex justify-center md:justify-end gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="text-2xl hover:text-gray-400" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter className="text-2xl hover:text-gray-400" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-2xl hover:text-gray-400" />
                        </a>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="text-center mt-6 text-sm">
                    <p>&copy; copyright {new Date().getFullYear()} My E-Commerce. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
