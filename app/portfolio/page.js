"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PortfolioPage() {
  const [works, setWorks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorks() {
      setLoading(true);
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        let data = [];
        try {
          data = await res.json();
        } catch (err) {
          data = [];
        }
        setWorks(Array.isArray(data) ? data : []);
      } catch (err) {
        setWorks([]);
      }
      setLoading(false);
    }
    fetchWorks();
  }, []);

  const filteredWorks = filter === "All"
    ? works
    : works.filter(w => w.category === filter);

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/logo-arrow-insulation.png" alt="Arrow Insulation Logo" width={96} height={96} />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-orange-100 transition-colors duration-300 font-medium">Home</Link>
            <Link href="/#services" className="hover:text-orange-100 transition-colors duration-300 font-medium">Services</Link>
            <Link href="/#about" className="hover:text-orange-100 transition-colors duration-300 font-medium">About Us</Link>
            <Link href="/#contact" className="hover:text-orange-100 transition-colors duration-300 font-medium">Contact</Link>
            <Link href="/#contact" className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-orange-50 transition-colors duration-300 shadow-md">Get Quote</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-200 py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-orange-600">
              Our Work Portfolio
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-700 max-w-3xl mx-auto font-medium">
              Explore our completed insulation projects across Colorado. See the quality and craftsmanship that sets us apart.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button onClick={() => setFilter("All")} className={`px-6 py-3 rounded-full font-semibold shadow-lg ${filter === "All" ? "bg-orange-500 text-white" : "bg-white text-orange-600 border-2 border-orange-200"}`}>All Projects</button>
              <button onClick={() => setFilter("Residential")} className={`px-6 py-3 rounded-full font-semibold shadow-lg ${filter === "Residential" ? "bg-orange-500 text-white" : "bg-white text-orange-600 border-2 border-orange-200"}`}>Residential</button>
              <button onClick={() => setFilter("Commercial")} className={`px-6 py-3 rounded-full font-semibold shadow-lg ${filter === "Commercial" ? "bg-orange-500 text-white" : "bg-white text-orange-600 border-2 border-orange-200"}`}>Commercial</button>
              <button onClick={() => setFilter("Soundproofing")} className={`px-6 py-3 rounded-full font-semibold shadow-lg ${filter === "Soundproofing" ? "bg-orange-500 text-white" : "bg-white text-orange-600 border-2 border-orange-200"}`}>Soundproofing</button>
              <button onClick={() => setFilter("Insulation Removal")} className={`px-6 py-3 rounded-full font-semibold shadow-lg ${filter === "Insulation Removal" ? "bg-orange-500 text-white" : "bg-white text-orange-600 border-2 border-orange-200"}`}>Insulation Removal</button>
              <button onClick={() => setFilter("Blowing Insulation")} className={`px-6 py-3 rounded-full font-semibold shadow-lg ${filter === "Blowing Insulation" ? "bg-orange-500 text-white" : "bg-white text-orange-600 border-2 border-orange-200"}`}>Blowing Insulation</button>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            {loading ? (
              <div className="text-center text-orange-600 text-xl font-semibold py-20">Loading...</div>
            ) : works.length === 0 ? (
              <div className="text-center text-orange-600 text-xl font-semibold py-20">No projects found or error loading data.</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredWorks.map((work) => (
                  <div key={work._id} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-orange-100">
                    <div className="relative h-64 flex items-center justify-center bg-gradient-to-br from-orange-200 to-orange-300">
                      {work.imageUrl && (
                        <Image src={work.imageUrl} alt={work.title} layout="fill" objectFit="cover" />
                      )}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                        work.category === "Residential" ? "bg-orange-500" : 
                        work.category === "Commercial" ? "bg-yellow-500" : 
                        work.category === "Soundproofing" ? "bg-red-500" :
                        work.category === "Insulation Removal" ? "bg-green-500" :
                        work.category === "Blowing Insulation" ? "bg-blue-500" : "bg-gray-500"
                      } text-white`}>
                        {work.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-orange-600">{work.title}</h3>
                      <p className="text-orange-600 mb-4">{work.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-500 font-semibold">Completed: {work.doneAt ? new Date(work.doneAt).toLocaleDateString() : "-"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl mb-8 text-orange-50 font-medium">
              Let us transform your space with professional insulation services. Get your free estimate today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/#contact" className="bg-white text-orange-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-orange-50 transition-all duration-300 shadow-xl">
                Get Free Estimate →
              </Link>
              <Link href="/#contact" className="border-2 border-white text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Image src="/logo-arrow-insulation.png" alt="Arrow Insulation Logo" width={80} height={80} className="w-20 h-20 object-contain bg-white rounded-full p-1" />
              </div>
              <p className="text-orange-100 font-medium">
                Colorado&apos;s trusted partner for professional insulation services since 2008.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Services</h5>
              <ul className="space-y-2 text-orange-100">
                <li><Link href="/#services" className="hover:text-white transition-colors font-medium">Residential</Link></li>
                <li><Link href="/#services" className="hover:text-white transition-colors font-medium">Commercial</Link></li>
                <li><Link href="/#services" className="hover:text-white transition-colors font-medium">Soundproofing</Link></li>
                <li><Link href="/#services" className="hover:text-white transition-colors font-medium">Insulation Removal</Link></li>
                <li><Link href="/#services" className="hover:text-white transition-colors font-medium">Blowing Insulation</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Company</h5>
              <ul className="space-y-2 text-orange-100">
                <li><Link href="/#about" className="hover:text-white transition-colors font-medium">About Us</Link></li>
                <li><Link href="/portfolio" className="hover:text-white transition-colors font-medium">Portfolio</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors font-medium">Contact</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors font-medium">Get Quote</Link></li>
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
    </>
  );
} 