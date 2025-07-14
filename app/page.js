"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent('Free Quote Request');
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nMessage: ${form.message}`);
    window.location.href = `mailto:info@arrowinsulation.com?subject=${subject}&body=${body}`;
    setShowModal(false);
  };

  const services = [
    {
      title: "Residential Insulation",
      description: "Complete home insulation solutions including attic, walls, crawl spaces, and basement. Improve comfort and reduce energy bills by up to 40%.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: "from-orange-400 to-orange-500",
      features: ["Attic Insulation", "Wall Insulation", "Crawl Space Sealing"]
    },
    {
      title: "Commercial Insulation",
      description: "Professional insulation for offices, warehouses, retail spaces, and industrial facilities. Boost energy efficiency and create comfortable work environments.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "from-yellow-400 to-orange-500",
      features: ["Office Buildings", "Warehouses", "Retail Spaces"]
    },
    {
      title: "Soundproofing",
      description: "Advanced acoustic insulation solutions for homes, offices, and studios. Create peaceful environments and improve productivity.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ),
      color: "from-red-400 to-orange-500",
      features: ["Home Theaters", "Music Studios", "Office Spaces"]
    },
    {
      title: "Insulation Removal",
      description: "Professional removal of old, damaged, or contaminated insulation. Safe disposal and preparation for new installation.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      color: "from-green-400 to-orange-500",
      features: ["Attic Cleanout", "Mold Remediation", "Safe Disposal"]
    },
    {
      title: "Blowing Insulation",
      description: "Advanced blown-in insulation for attics and walls. Superior coverage and energy efficiency with minimal disruption.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "from-blue-400 to-orange-500",
      features: ["Attic Blowing", "Wall Cavity Filling", "Cellulose & Fiberglass"]
    }
  ];

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % services.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo-arrow-insulation.png" alt="Arrow Insulation Logo" className="w-24 h-24 object-contain m-0 p-0 border-none" />
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="hover:text-orange-100 transition-colors duration-300 font-medium">Services</a>
            <a href="#about" className="hover:text-orange-100 transition-colors duration-300 font-medium">About Us</a>
            <Link href="/portfolio" className="hover:text-orange-100 transition-colors duration-300 font-medium">Portfolio</Link>
            <a href="#contact" className="hover:text-orange-100 transition-colors duration-300 font-medium">Contact</a>
            <a href="#contact" className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-orange-50 transition-colors duration-300 shadow-md">Get Quote</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-200 py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97316' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <div className="mb-8">
              <span className="inline-block bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
                🏔️ Serving Colorado Since 2008
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 text-orange-600 leading-tight">
              Colorado&apos;s Premier
              <br />
              <span className="text-orange-500">Insulation Experts</span>
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-orange-700 max-w-4xl mx-auto leading-relaxed font-medium">
              Transform your home&apos;s comfort and energy efficiency with our professional insulation services. 
              Save money, protect your property, and enjoy year-round comfort.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="#contact" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                Get Free Estimate →
              </a>
              <a href="#services" className="border-3 border-orange-500 text-orange-600 px-10 py-5 rounded-full text-xl font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 bg-white shadow-lg">
                View Services
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2 bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-5xl font-bold text-orange-500">500+</div>
                <div className="text-orange-700 font-semibold">Happy Customers</div>
              </div>
              <div className="space-y-2 bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-5xl font-bold text-orange-500">15+</div>
                <div className="text-orange-700 font-semibold">Years Experience</div>
              </div>
              <div className="space-y-2 bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-5xl font-bold text-orange-500">100%</div>
                <div className="text-orange-700 font-semibold">Satisfaction Rate</div>
              </div>
              <div className="space-y-2 bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-5xl font-bold text-orange-500">24/7</div>
                <div className="text-orange-700 font-semibold">Emergency Service</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gradient-to-b from-white to-orange-100 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-6 text-orange-600">Our Professional Services</h3>
              <p className="text-xl text-orange-600 max-w-3xl mx-auto font-medium">
                Comprehensive insulation solutions tailored to Colorado&apos;s unique climate and your specific needs
              </p>
            </div>
            
            {/* Services Carousel */}
            <div className="relative">
              {/* Navigation Arrows */}
              <button 
                onClick={goToPrevious}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-orange-600 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border-2 border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={goToNext}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-orange-600 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border-2 border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Carousel Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(calc(-${currentSlide * 33.33}% + 33.33%))` }}
                >
                  {/* Main services */}
                  {services.map((service, index) => (
                    <div key={index} className="w-1/3 flex-shrink-0 px-4">
                      <div className="max-w-sm mx-auto">
                        <div className={`bg-white p-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-orange-200 ${
                          currentSlide === index 
                            ? 'scale-100 opacity-100 shadow-2xl' 
                            : 'scale-90 opacity-60 shadow-lg'
                        }`}>
                          <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg mx-auto`}>
                            {service.icon}
                          </div>
                          <h4 className="text-xl font-bold mb-4 text-orange-600 text-center">{service.title}</h4>
                          <p className="text-orange-600 leading-relaxed mb-6 font-medium text-sm text-center">
                            {service.description}
                          </p>
                          <ul className="space-y-2 text-orange-500 font-medium text-sm">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center justify-center">
                                <span className="mr-2 text-orange-400 text-lg">✓</span> {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-8 space-x-3">
                {services.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCurrentSlide(index);
                        setTimeout(() => setIsTransitioning(false), 500);
                      }
                    }}
                    disabled={isTransitioning}
                    className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                      currentSlide === index 
                        ? 'bg-orange-500 border-orange-500 scale-125' 
                        : 'bg-white border-orange-300 hover:border-orange-400'
                    } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Arrow Insulation?</h3>
                <p className="text-xl mb-8 leading-relaxed text-orange-50 font-medium">
                  With over 15 years serving Colorado communities, we understand the unique challenges of our climate. 
                  Our certified team uses cutting-edge technology and eco-friendly materials to deliver exceptional results.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-orange-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-orange-50 font-semibold">Licensed & Insured</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-orange-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-orange-50 font-semibold">Free Estimates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-orange-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-orange-50 font-semibold">Satisfaction Guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-orange-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-orange-50 font-semibold">Eco-Friendly Materials</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
                <h4 className="text-2xl font-bold mb-6">Colorado&apos;s Climate Experts</h4>
                <p className="text-orange-50 mb-6 font-medium">
                  From Denver&apos;s urban heat to mountain town winters, we understand Colorado&apos;s diverse climate challenges. 
                  Our solutions are specifically designed for our region&apos;s unique weather patterns.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center bg-white/20 rounded-2xl p-4">
                    <div className="text-4xl font-bold text-orange-200">-20°F</div>
                    <div className="text-orange-50 text-sm font-semibold">Winter Protection</div>
                  </div>
                  <div className="text-center bg-white/20 rounded-2xl p-4">
                    <div className="text-4xl font-bold text-orange-200">100°F</div>
                    <div className="text-orange-50 text-sm font-semibold">Summer Comfort</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-orange-100 to-yellow-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-orange-600">Ready to Get Started?</h3>
            <p className="text-xl mb-12 text-orange-600 max-w-2xl mx-auto font-medium">
              Transform your property&apos;s comfort and efficiency today. Get your free consultation and estimate from Colorado&apos;s trusted insulation experts.
            </p>
            
            <div className="grid md:grid-cols-1 gap-8 mb-12">
              <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-orange-200 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-xl mb-3 text-orange-600">Email Us</h4>
                <a href="mailto:info@arrowinsulation.com" className="text-orange-500 hover:text-orange-700 transition-colors font-medium">
                  info@arrowinsulation.com
                </a>
              </div>
            </div>
            
            <a href="#" onClick={() => setShowModal(true)} className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-5 rounded-full text-2xl font-bold hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
              Get Your Free Quote Today →
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo-arrow-insulation.png" alt="Arrow Insulation Logo" className="w-20 h-20 object-contain bg-white rounded-full p-1" />
              </div>
              <p className="text-orange-100 font-medium">
                Colorado&apos;s trusted partner for professional insulation services since 2008.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Services</h5>
              <ul className="space-y-2 text-orange-100">
                <li><a href="#" className="hover:text-white transition-colors font-medium">Residential</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Commercial</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Soundproofing</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Insulation Removal</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Blowing Insulation</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Company</h5>
              <ul className="space-y-2 text-orange-100">
                <li><a href="#" className="hover:text-white transition-colors font-medium">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Reviews</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-medium">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Contact Info</h5>
              <div className="space-y-2 text-orange-100 font-medium">
                <p>Denver, Colorado</p>
                <p>info@arrowinsulation.com</p>
                <p>(555) 123-4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-orange-400 pt-8 text-center text-orange-100">
            <p>&copy; {new Date().getFullYear()} Arrow Insulation. All rights reserved. | Licensed & Insured</p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6 text-orange-600">Get Your Free Quote</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <textarea
                name="message"
                placeholder="Tell us about your project"
                value={form.message}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
                required
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Send Quote Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
