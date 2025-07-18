"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import CartBadge from "../cart/cartBadge";
import { useCart } from "@/lib/contexts/cartContext";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "About Us",
    href: "/about",
  },
  {
    name: "Inventory",
    href: "/inventory",
  },
  { name: "Contact Us", href: "/contact-us" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const companyName =
    process.env.NEXT_PUBLIC_COMPANY_NAME || "Ridges Automotors";
  const companyPhone =
    process.env.NEXT_PUBLIC_COMPANY_PHONE || "(555) 123-4567";
  const companyEmail =
    process.env.NEXT_PUBLIC_COMPANY_EMAIL || "info@ridgesautomotors.com";

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-lg">
      {/* Top Bar - Contact Info */}
      <div className="top-bar bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>123 Auto Plaza Drive, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-500" />
                <a
                  href={`tel:${companyPhone}`}
                  className="hover:text-red-400 transition-colors"
                >
                  {companyPhone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-500" />
                <a
                  href={`mailto:${companyEmail}`}
                  className="hover:text-red-400 transition-colors"
                >
                  {companyEmail}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Mon-Fri: 9AM-8PM | Sat: 9AM-6PM | Sun: 11AM-5PM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg shadow-lg">
                  <span className="text-2xl font-bold">R</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {companyName}
                  </div>
                  <div className="text-xs text-red-600 font-medium -mt-1">
                    QUALITY VEHICLES & SERVICE
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="desktop-nav">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <div
                    key={item.name}
                    className="relative nav-item"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={`text-sm font-semibold transition-colors py-2 px-3 rounded-lg flex items-center ${
                        isActive
                          ? "text-red-600 bg-red-50"
                          : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="desktop-cta">
              <CartBadge
                className="!bg-red-600 hover:!bg-red-700 !text-white"
                showText={true}
              />

              <Link
                href="/inventory"
                className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium border border-gray-300 hover:border-gray-400 mr-4"
              >
                Browse Inventory
              </Link>
              <Link
                href="/contact-us"
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                Get Quote
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="mobile-menu-btn flex items-center space-x-3">
              {/* 🛒 ADD CART BADGE FOR MOBILE (NEXT TO MENU BUTTON) */}
              <CartBadge
                className="!bg-red-600 hover:!bg-red-700"
                showText={false}
              />

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 mobile-menu-overlay">
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-lg">
                  <span className="text-lg font-bold">R</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {companyName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="py-6 px-6">
              {/* 🛒 ADD CART BADGE TO TOP OF MOBILE MENU */}
              <div className="mb-6">
                <CartBadge
                  className="w-full justify-center !bg-red-600 hover:!bg-red-700"
                  showText={true}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </div>

              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? "bg-red-50 text-red-600 border-l-4 border-red-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </div>
                  );
                })}
              </nav>

              <div className="mt-8 space-y-4">
                <Link
                  href="/inventory"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center border border-gray-300"
                >
                  Browse Inventory
                </Link>
                <Link
                  href="/contact-us"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-medium text-center shadow-lg"
                >
                  Get Quote
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-red-500" />
                    <a
                      href={`tel:${companyPhone}`}
                      className="hover:text-red-600 transition-colors"
                    >
                      {companyPhone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-red-500" />
                    <a
                      href={`mailto:${companyEmail}`}
                      className="hover:text-red-600 transition-colors"
                    >
                      {companyEmail}
                    </a>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                    <span>
                      123 Auto Plaza Drive
                      <br />
                      Nairobi, Kenya
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for responsive behavior */}
      <style jsx>{`
        .top-bar {
          display: none;
        }

        .desktop-nav {
          display: none;
        }

        .desktop-cta {
          display: none;
        }

        .mobile-menu-btn {
          display: flex;
        }

        .mobile-menu-overlay {
          display: block;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 0.5rem;
          width: 14rem;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          z-index: 50;
        }

        /* Desktop styles */
        @media (min-width: 1024px) {
          .top-bar {
            display: block;
          }

          .desktop-nav {
            display: flex;
            align-items: center;
            gap: 2rem;
          }

          .desktop-cta {
            display: flex;
            align-items: center;
          }

          .mobile-menu-btn {
            display: none;
          }

          .mobile-menu-overlay {
            display: none;
          }
        }

        /* Hide mobile elements on desktop */
        @media (min-width: 1024px) {
          .mobile-menu-overlay {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
