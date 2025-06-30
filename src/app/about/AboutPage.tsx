"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Award,
  Shield,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  ArrowRight,
  Calendar,
  Target,
  Heart,
  TrendingUp,
  Car,
  Handshake,
} from "lucide-react";
import { Header } from "@/components/layout/header";

const teamMembers = [
  {
    name: "John Ridges",
    position: "Founder & CEO",
    image: "/team/john-ridges.jpg", // You'll need to add actual images
    bio: "With over 20 years in the automotive industry, John founded Ridges Automotors with a vision to revolutionize car buying in Kenya.",
    specialties: [
      "Business Strategy",
      "Customer Relations",
      "Industry Leadership",
    ],
  },
  {
    name: "Sarah Mwangi",
    position: "Sales Manager",
    image: "/team/sarah-mwangi.jpg",
    bio: "Sarah leads our sales team with passion and expertise. She's helped thousands of customers find their perfect vehicle.",
    specialties: ["Sales Excellence", "Team Leadership", "Customer Service"],
  },
  {
    name: "Michael Ochieng",
    position: "Finance Director",
    image: "/team/michael-ochieng.jpg",
    bio: "Michael ensures our customers get the best financing options available. He's an expert in automotive finance solutions.",
    specialties: ["Automotive Finance", "Loan Processing", "Credit Solutions"],
  },
  {
    name: "Grace Kiprop",
    position: "Service Manager",
    image: "/team/grace-kiprop.jpg",
    bio: "Grace oversees our service department, ensuring every vehicle meets our high standards before reaching customers.",
    specialties: [
      "Quality Control",
      "Vehicle Inspection",
      "Service Excellence",
    ],
  },
];

const milestones = [
  {
    year: "2020",
    title: "Company Founded",
    description:
      "Ridges Automotors was established with a mission to provide quality vehicles and exceptional service.",
  },
  {
    year: "2021",
    title: "First 1,000 Customers",
    description:
      "Reached our first major milestone by serving over 1,000 satisfied customers.",
  },
  {
    year: "2022",
    title: "Expansion & Certification",
    description:
      "Expanded our facility and became a certified pre-owned dealer with multiple manufacturers.",
  },
  {
    year: "2023",
    title: "Award Recognition",
    description:
      "Received the Customer Satisfaction Excellence Award from the Kenya Auto Dealers Association.",
  },
  {
    year: "2024",
    title: "Digital Innovation",
    description:
      "Launched our advanced online platform for virtual vehicle tours and remote purchasing.",
  },
];

const stats = [
  { number: "5,000+", label: "Happy Customers", icon: Users },
  { number: "15+", label: "Years Combined Experience", icon: Calendar },
  { number: "98%", label: "Customer Satisfaction", icon: Star },
  { number: "500+", label: "Vehicles Sold Annually", icon: Car },
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Every decision we make is centered around providing the best experience for our customers.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "We believe in honest dealings, clear pricing, and transparent communication throughout the process.",
  },
  {
    icon: Award,
    title: "Quality Excellence",
    description:
      "We maintain the highest standards in vehicle selection, inspection, and customer service.",
  },
  {
    icon: Handshake,
    title: "Long-term Relationships",
    description:
      "We're not just here for the sale – we build lasting relationships with our customers and community.",
  },
];

const certifications = [
  {
    title: "Better Business Bureau",
    subtitle: "A+ Accredited Business",
    description:
      "Maintaining the highest standards of business ethics and customer service excellence.",
  },
  {
    title: "AutoCheck Certified",
    subtitle: "Verified Dealer Network",
    description:
      "Official member of the AutoCheck certified dealer network with verified vehicle histories.",
  },
  {
    title: "ASE Certified",
    subtitle: "Automotive Service Excellence",
    description:
      "Our technicians are ASE certified, ensuring professional automotive service standards.",
  },
  {
    title: "Kenya Auto Dealers Association",
    subtitle: "Licensed Member",
    description:
      "Fully licensed and regulated member of the Kenya Auto Dealers Association.",
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("story");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-red-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-red-400 rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              About Ridges Automotors
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Since our inception, we&apos;ve been dedicated to connecting
              customers with quality vehicles while providing exceptional
              service that exceeds expectations.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center group hover:scale-110 transition-transform duration-300"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-700 transition-colors">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-300">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex space-x-8 overflow-x-auto">
              {[
                { id: "story", label: "Our Story" },
                { id: "values", label: "Values" },
                { id: "team", label: "Our Team" },
                { id: "timeline", label: "Timeline" },
                { id: "certifications", label: "Certifications" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-red-600 text-red-600"
                      : "border-transparent text-gray-700 hover:text-red-600 hover:border-red-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      {activeTab === "story" && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                  Our Story
                </h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    With our wide range of vehicle options in stock, Ridgeways
                    Motors has something to offer all of our customers. We’ve
                    helped connect clients with the best vehicles on the market.
                    Whether you’re looking for a Specific Model or something
                    from our wide range of collection, our team is here to help
                    you every step of the way.
                  </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/inventory"
                    className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:scale-105"
                  >
                    Browse Our Inventory
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-96 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for showroom image */}
                  <div className="text-center">
                    <Car className="h-24 w-24 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                      Our Modern Showroom
                    </p>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl">
                  5+ Years Strong
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl">
                  5,000+ Happy Customers
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {activeTab === "values" && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These principles guide everything we do and shape every
                interaction with our customers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-red-500 transition-all duration-500 hover:scale-105 group"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                      <IconComponent className="h-8 w-8 text-red-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Mission & Vision */}
            <div className="grid lg:grid-cols-2 gap-12 mt-20">
              <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-8 rounded-2xl">
                <Target className="h-12 w-12 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-red-100 leading-relaxed">
                  To provide exceptional automotive solutions by connecting
                  customers with quality vehicles through transparent processes,
                  expert guidance, and unparalleled customer service that builds
                  trust and lasting relationships.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-2xl">
                <TrendingUp className="h-12 w-12 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-300 leading-relaxed">
                  To be Kenya&apos;s most trusted automotive dealership,
                  recognized for innovation, integrity, and customer
                  satisfaction while setting new standards for excellence in the
                  automotive retail industry.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {activeTab === "team" && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our experienced professionals are dedicated to helping you find
                the perfect vehicle and providing exceptional service every step
                of the way.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Users className="h-16 w-16 text-gray-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-red-600 font-semibold mb-4">
                      {member.position}
                    </p>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {member.bio}
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Specialties:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Join Our Team CTA */}
            <div className="mt-16 text-center bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Join Our Team
              </h3>
              <p className="text-gray-600 mb-6">
                We&apos;re always looking for passionate individuals to join our
                growing team.
              </p>
              <Link
                href="/careers"
                className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:scale-105"
              >
                View Open Positions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Timeline Section */}
      {activeTab === "timeline" && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From humble beginnings to becoming one of Nairobi&apos;s most
                trusted dealerships.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-red-600"></div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  } mb-12`}
                >
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                    }`}
                  >
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                      <div className="text-2xl font-bold text-red-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {activeTab === "certifications" && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Certifications & Recognition
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our commitment to excellence is recognized by industry leaders
                and regulatory bodies.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-red-500 transition-all duration-500 hover:scale-105 group"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-full group-hover:bg-red-600 transition-colors">
                      <Award className="h-8 w-8 text-red-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {cert.title}
                      </h3>
                      <p className="text-red-600 font-semibold mb-3">
                        {cert.subtitle}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {cert.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional recognitions */}
            <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-2xl text-center">
              <h3 className="text-2xl font-bold mb-4">Industry Recognition</h3>
              <p className="text-red-100 mb-6 max-w-3xl mx-auto">
                Winner of the 2023 Customer Satisfaction Excellence Award from
                the Kenya Auto Dealers Association, recognizing our outstanding
                commitment to customer service and business ethics.
              </p>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <Star className="h-12 w-12 mx-auto mb-2" />
                  <div className="font-bold">5-Star Rating</div>
                  <div className="text-red-200">Customer Reviews</div>
                </div>
                <div className="text-center">
                  <Award className="h-12 w-12 mx-auto mb-2" />
                  <div className="font-bold">Excellence Award</div>
                  <div className="text-red-200">2023 Winner</div>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                  <div className="font-bold">Certified Dealer</div>
                  <div className="text-red-200">Verified Network</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience the Ridges Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Visit our showroom, browse our inventory, or speak with one of our
            automotive experts today.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-red-600 p-4 rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="font-bold">Visit Us</div>
                <div className="text-gray-300">
                  Windsor, Kiambu Road, Nakumatt Junction, Next To Windsor
                  Hotel, Ridgeways Rd, Nairobi City, Kenya
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-red-600 p-4 rounded-full">
                <Phone className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="font-bold">Call Us</div>
                <div className="text-gray-300">+254 711690560</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-red-600 p-4 rounded-full">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="font-bold">Open Daily</div>
                <div className="text-gray-300">
                  Mon-Fri: 8AM-6PM
                  <br />
                  Sat: 8AM-5PM
                  <br />
                  Sun: Closed
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-all duration-300 font-bold shadow-2xl hover:scale-105"
            >
              Browse Our Inventory
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 font-bold"
            >
              Schedule a Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
