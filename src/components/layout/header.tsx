"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "About Us",
    href: "/about",
    submenu: [
      { name: "Our Story", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Reviews", href: "/reviews" },
    ],
  },
  {
    name: "Inventory",
    href: "/inventory",
    submenu: [
      { name: "All Vehicles", href: "/inventory" },
      { name: "New Arrivals", href: "/inventory?sort=newest" },
      { name: "Under $20K", href: "/inventory?maxPrice=20000" },
      { name: "Certified Pre-Owned", href: "/inventory?condition=certified" },
    ],
  },
  {
    name: "Service",
    href: "/service",
    submenu: [
      { name: "Financing", href: "/financing" },
      { name: "Trade-In", href: "/trade-in" },
      { name: "Warranties", href: "/warranties" },
      { name: "Service Center", href: "/service" },
    ],
  },
  { name: "Contact Us", href: "/contact" },
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
    process.env.NEXT_PUBLIC_COMPANY_EMAIL || "info@ridgewaysmotors.com";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar - Contact Info */}
      <div className="hidden lg:block bg-black text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>123 Auto Plaza Drive, Your City, State 12345</span>
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
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() =>
                      item.submenu && setActiveDropdown(item.name)
                    }
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={`
                        flex items-center text-sm font-semibold transition-colors duration-200 py-2
                        ${
                          isActive
                            ? "text-red-600 border-b-2 border-red-600"
                            : "text-gray-700 hover:text-red-600"
                        }
                      `}
                    >
                      {item.name}
                      {item.submenu && <ChevronDown className="ml-1 h-4 w-4" />}
                    </Link>

                    {/* Dropdown Menu */}
                    {item.submenu && activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/inventory"
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Browse Inventory
              </Link>
              <Link
                href="/contact"
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg"
              >
                Get Quote
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
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
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          block px-4 py-3 rounded-lg text-base font-medium transition-colors
                          ${
                            isActive
                              ? "bg-red-50 text-red-600 border-l-4 border-red-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }
                        `}
                      >
                        {item.name}
                      </Link>
                      {item.submenu && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="mt-8 space-y-4">
                <Link
                  href="/inventory"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                >
                  Browse Inventory
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-center"
                >
                  Get Quote
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-red-500" />
                    <a
                      href={`tel:${companyPhone}`}
                      className="hover:text-red-600"
                    >
                      {companyPhone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-red-500" />
                    <a
                      href={`mailto:${companyEmail}`}
                      className="hover:text-red-600"
                    >
                      {companyEmail}
                    </a>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                    <span>
                      123 Auto Plaza Drive
                      <br />
                      Your City, State 12345
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
