"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Car, Phone, Mail, MapPin, ArrowRight, Check } from "lucide-react";
import { brandLogos } from "@/components/ui/brand-logos";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  priceFormatted: string;
  mileage: number;
  mileageFormatted: string;
  condition: string;
  images?: string[];
  features?: string[];
  mainImage?: string;
}

export default function HomePage() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const companyPhone =
    process.env.NEXT_PUBLIC_COMPANY_PHONE || "(555) 123-4567";
  const companyEmail =
    process.env.NEXT_PUBLIC_COMPANY_EMAIL || "info@ridgewaysmotors.com";

  useEffect(() => {
    fetchFeaturedVehicles();
  }, []);

  const fetchFeaturedVehicles = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/vehicles/featured/list?limit=6`);

      if (response.ok) {
        const data = await response.json();
        setFeaturedVehicles(data.data.vehicles || []);
      }
    } catch (error) {
      console.error("Error fetching featured vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 lg:py-32 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-red-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-red-400 rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  YOUR BEST CAR AND MOTORS DEALER
                </h1>

                <div className="space-y-4">
                  <p className="text-xl text-gray-300 max-w-md leading-relaxed">
                    Since our inception, Ridges Automotors has provided our
                    clients with a wide range of vehicle purchasing and leasing
                    options. Whether new or preowned, we&apos;re sure to have
                    something in stock to meet everyone&apos;s needs.
                  </p>
                  <p className="text-lg text-red-300 font-semibold">
                    Ready to set up a test drive?
                  </p>
                  <p className="text-gray-300">
                    Stop by Ridges Automotors and get behind the drivers seat
                    today!
                  </p>
                </div>
              </div>

              {/*  CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/users/inventory"
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-red-500/25 hover:scale-105"
                >
                  Browse Inventory
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/users/contact-us"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold text-lg backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search By Car Brands Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Search By Car Brands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our carefully selected brands to find a standout and
              award-winning vehicle.
            </p>
          </div>

          {/* Brand Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-12">
            {brandLogos.map((brand, index) => {
              const LogoComponent = brand.component;
              return (
                <div
                  key={brand.name}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200 hover:border-red-500 hover:scale-110 hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <LogoComponent
                        width={50}
                        height={50}
                        className="group-hover:scale-125 transition-transform duration-500"
                      />
                    </div>
                    <div className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors text-sm">
                      {brand.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/users/inventory"
              className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-xl hover:scale-105"
            >
              More Brands
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Cards Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 lg:p-12 text-white overflow-hidden min-h-[400px] group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('car-background.jpeg')`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gray-900/65"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-gray-900/40 to-gray-900/30"></div>
              </div>
              <div className="relative z-10">
                <div className="inline-block bg-white/20 rounded-full px-4 py-2 text-sm font-semibold mb-4">
                  🔥 Hot Deals
                </div>
                <h3 className="text-4xl font-bold mb-6 drop-shadow-lg">
                  Find Your Dream Car?
                </h3>
                <p className="text-red-100 mb-8 leading-relaxed text-lg drop-shadow-md">
                  Dynamically conceptualize methods of empowerment accurate
                  technology. Professional customer service business
                  development.
                </p>
                <Link
                  href="/users/inventory"
                  className="inline-flex items-center bg-white text-red-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold shadow-2xl hover:scale-105"
                >
                  Buy Your Car
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            {/* Test Drive Location Card */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 lg:p-12 text-white overflow-hidden min-h-[400px] group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('driver-bg.jpg')`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gray-900/65"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-gray-900/40 to-gray-900/30"></div>
              </div>

              <div className="relative z-10">
                <div className="inline-block bg-white/20 rounded-full px-4 py-2 text-sm font-semibold mb-4">
                  🚗 Test Drive Available
                </div>
                <h3 className="text-4xl font-bold mb-6">
                  Schedule Your Test Drive
                </h3>
                <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                  Experience your dream car firsthand. Visit our showroom in
                  Nairobi and take any vehicle for a comprehensive test drive.
                  Feel the performance, comfort, and quality.
                </p>

                {/* Location Info */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-5 w-5 mr-3 text-red-600" />
                    <span>123 Auto Plaza Drive, Nairobi</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Phone className="h-5 w-5 mr-3 text-white" />
                    <span>(555) 123-4567</span>
                  </div>
                </div>

                <Link
                  href="/users/contact-us"
                  className="inline-flex items-center bg-white text-red-600 px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 font-bold shadow-xl hover:scale-105"
                >
                  Schedule Test Drive
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured Listings
            </h2>
            <p className="text-xl text-gray-600">
              Discover our handpicked selection of premium vehicles
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-xl bg-red-600 p-1">
              <button className="px-8 py-3 text-sm font-bold text-gray-200 hover:text-gray-700">
                Featured Items
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border"
                >
                  <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-red-500 hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {vehicle.mainImage ? (
                      <img
                        src={vehicle.mainImage}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="h-16 w-16 text-gray-400" />
                      </div>
                    )}

                    {/*  Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {vehicle.condition === "CERTIFIED_PRE_OWNED" && (
                        <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          ✅ Certified
                        </span>
                      )}
                      {vehicle.condition === "NEW" && (
                        <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          🆕 New
                        </span>
                      )}
                    </div>

                    {/*  Wishlist Button */}
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-95 rounded-full flex items-center justify-center hover:bg-red-50 transition-all duration-300 shadow-lg hover:scale-110">
                      <span className="text-gray-600 hover:text-red-600 text-xl">
                        ♡
                      </span>
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {vehicle.mileageFormatted} miles
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          {vehicle.priceFormatted}
                        </span>
                        <div className="text-sm text-gray-500">$299/month</div>
                      </div>
                      <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-lg hover:scale-105">
                        More Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Featured Vehicles
              </h3>
              <p className="text-gray-600">
                Check back soon for our latest featured vehicles!
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/users/inventory"
              className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-xl hover:scale-105"
            >
              <Car className="mr-2 h-5 w-5" />
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('background-car.jpg')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gray-900/65"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-gray-900/40 to-gray-900/30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why Choose Ridges Automotors?
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Ridges Automotors has been a leading Motorcycle Dealer in Nairobi
              Kenya. At our dealership, we&apos;re committed to providing
              quality service to all of our customers - from first-time buyers
              to experienced vehicle owners. We make it easy for everyone to buy
              the vehicle of their dreams. Your Local Vehicle Experts
            </p>
          </div>

          {/*  Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center group">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Vehicles</h3>
              <p className="text-gray-300">
                Certified pre-owned and new vehicles with comprehensive
                inspections
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-gray-300">
                Competitive pricing and flexible financing options available
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Service</h3>
              <p className="text-gray-300">
                Professional team with years of automotive industry experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-white rounded-full opacity-5 blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Find Your Perfect Vehicle?
            </h2>
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
              Contact us today and let our team help you drive away happy
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="flex items-center justify-center space-x-4 group">
                <div className="bg-white/20 bg-opacity-20 rounded-full p-4 group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Call Us</div>
                  <div className="opacity-90">{companyPhone}</div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 group">
                <div className="bg-white/20 bg-opacity-20 rounded-full p-4 group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Email Us</div>
                  <div className="opacity-90">{companyEmail}</div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 group">
                <div className="bg-white/20 bg-opacity-20 rounded-full p-4 group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Visit Us</div>
                  <div className="opacity-90">Kiambu Road, Nairobi, Kenya</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 group">
                <div className="bg-white/20 bg-opacity-20 rounded-full p-4 group-hover:scale-110 transition-transform">
                  <Check className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Opening Hours</div>
                  <div className="opacity-90">
                    Mon - Fri: 8am - 6pm
                    <br />
                    Sat: 9am - 4pm
                    <br />
                    Sun: Closed
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/users/contact-us"
                className="bg-white text-red-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold shadow-2xl hover:scale-105"
              >
                Contact Us Today
              </Link>
              <Link
                href="/users/inventory"
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-red-600 transition-all duration-300 font-bold backdrop-blur-sm"
              >
                Browse Inventory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
