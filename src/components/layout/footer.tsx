"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  ChevronUp,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  //const [showScrollTop, setShowScrollTop] = useState(false);

  const companyName =
    process.env.NEXT_PUBLIC_COMPANY_NAME || "Ridges Automotors";
  const companyPhone =
    process.env.NEXT_PUBLIC_COMPANY_PHONE || "(555) 123-4567";
  const companyEmail =
    process.env.NEXT_PUBLIC_COMPANY_EMAIL || "info@ridgesautomotors.com";

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigation links organized by category
  const navigationLinks = {
    inventory: [
      { name: "All Vehicles", href: "/inventory" },
      { name: "Under KES 100000", href: "/inventory?maxPrice=100000" },
      { name: "Certified Pre-Owned", href: "/inventory?condition=certified" },
      { name: "Luxury Vehicles", href: "/inventory?category=luxury" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Customer Reviews", href: "/reviews" },
      { name: "Careers", href: "/careers" },
    ],
    support: [
      { name: "Contact Us", href: "/contact-us" },
      { name: "FAQ", href: "/faq" },
    ],
  };

  const businessHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "8:00 AM - 5:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <>
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500 rounded-full opacity-5 blur-3xl"></div>
        </div>

        {/* Main Footer Content */}
        <div className="relative">
          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-red-900 to-red-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-4">
                    Stay Updated with Latest Deals!
                  </h3>
                  <p className="text-red-100 text-lg">
                    Get exclusive offers, new inventory alerts, and automotive
                    tips delivered to your inbox.
                  </p>
                </div>
                <div className="lg:justify-self-end w-full max-w-md">
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="flex gap-3"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg hover:scale-105 flex items-center"
                    >
                      {isSubscribed ? "Subscribed!" : "Subscribe"}
                      {!isSubscribed && <ArrowRight className="ml-2 h-4 w-4" />}
                    </button>
                  </form>
                  {isSubscribed && (
                    <p className="text-green-100 text-sm mt-2 font-medium">
                      ✅ Thank you for subscribing! Check your email for
                      confirmation.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Sections */}
          <div className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                {/* Company Info */}
                <div className="lg:col-span-2">
                  <Link href="/" className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg shadow-lg">
                      <span className="text-2xl font-bold">R</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {companyName}
                      </div>
                      <div className="text-xs text-red-400 font-medium -mt-1">
                        QUALITY VEHICLES & SERVICE
                      </div>
                    </div>
                  </Link>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Since our inception, Ridges Automotors has provided our
                    clients with a wide range of vehicle purchasing and leasing
                    options. We&apos;re committed to quality service and
                    customer satisfaction.
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 group">
                      <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-700 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <a
                        href={`tel:${companyPhone}`}
                        className="hover:text-red-400 transition-colors"
                      >
                        {companyPhone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3 group">
                      <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-700 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <a
                        href={`mailto:${companyEmail}`}
                        className="hover:text-red-400 transition-colors"
                      >
                        {companyEmail}
                      </a>
                    </div>
                    <div className="flex items-start space-x-3 group">
                      <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-700 transition-colors">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="text-gray-300">
                        123 Auto Plaza Drive
                        <br />
                        Kiambu Road, Nairobi, Kenya
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inventory Links */}
                <div>
                  <h4 className="text-lg font-bold mb-6 text-white">
                    Our Inventory
                  </h4>
                  <ul className="space-y-3">
                    {navigationLinks.inventory.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-red-400 transition-colors duration-300 flex items-center group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform">
                            {link.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Links */}
                <div>
                  <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
                  <ul className="space-y-3">
                    {navigationLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-red-400 transition-colors duration-300 flex items-center group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform">
                            {link.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Business Hours & Support */}
                <div>
                  <h4 className="text-lg font-bold mb-6 text-white">
                    Business Hours
                  </h4>
                  <div className="space-y-3 mb-8">
                    {businessHours.map((schedule, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-red-400" />
                        <div className="text-sm">
                          <div className="text-gray-300 font-medium">
                            {schedule.day}
                          </div>
                          <div className="text-red-300">{schedule.hours}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h5 className="text-md font-semibold mb-4 text-white">
                    Customer Support
                  </h5>
                  <ul className="space-y-2">
                    {navigationLinks.support.slice(0, 3).map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-red-400 transition-colors text-sm group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform">
                            {link.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Certifications */}
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="bg-black py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                {/* Copyright */}
                <div className="text-center md:text-left">
                  <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} {companyName}. All rights
                    reserved.
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Licensed Automotive Dealer
                  </p>
                </div>

                {/* Social Media Links */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm mr-2">Follow Us:</span>
                  <a
                    href="https://facebook.com/ridgesautomotors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="https://instagram.com/ridgesautomotors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://twitter.com/ridgesautomotors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-110"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href="https://youtube.com/ridgesautomotors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-2 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-110"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                </div>

                {/* Legal Links */}
                <div className="flex items-center space-x-4 text-sm">
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link
                    href="/sitemap"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Sitemap
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-red-600 text-white p-3 rounded-full shadow-2xl hover:bg-red-700 transition-all duration-300 hover:scale-110 z-50"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </>
  );
}
