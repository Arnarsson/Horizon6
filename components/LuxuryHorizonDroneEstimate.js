import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from '@googlemaps/js-api-loader';

const LuxuryHorizonDroneEstimate = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [estimateData, setEstimateData] = useState({
    name: '',
    email: '',
    hours: 1,
    location: 'urban',
    resolution: '4k',
    lat: null,
    lng: null,
  });
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Initialize Google Maps
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    loader.load().then(() => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 8,
      });

      mapInstanceRef.current = map;

      const marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: { lat: 0, lng: 0 },
      });

      markerRef.current = marker;

      google.maps.event.addListener(marker, 'dragend', function() {
        const position = marker.getPosition();
        setEstimateData(prev => ({
          ...prev,
          lat: position.lat(),
          lng: position.lng(),
        }));
      });
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateEstimate = () => {
    let basePrice = 100;
    let locationMultiplier = estimateData.location === 'urban' ? 1 : 1.5;
    let resolutionMultiplier = estimateData.resolution === '4k' ? 1 : 1.25;

    let total = basePrice * estimateData.hours * locationMultiplier * resolutionMultiplier;
    setEstimatedPrice(Math.round(total));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEstimateData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateEstimate();
    console.log('Estimate request:', estimateData);
    alert('Estimate request sent! We will contact you soon.');
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setEstimateData(prev => ({
          ...prev,
          lat: latitude,
          lng: longitude,
        }));

        if (markerRef.current && mapInstanceRef.current) {
          const newPosition = new google.maps.LatLng(latitude, longitude);
          markerRef.current.setPosition(newPosition);
          mapInstanceRef.current.panTo(newPosition);
          mapInstanceRef.current.setZoom(12); // Optionally zoom in
        }
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-serif">
      <Head>
        <title>Horizon | Luxury FPV Drone Videography</title>
        <meta name="description" content="Experience cinematic drone videography with Horizon - Capture the world from a new perspective" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="fixed w-full z-50 bg-gradient-to-b from-gray-900 to-transparent">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-bold tracking-wider font-playfair text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
          >
            Horizon
          </motion.h1>
          <motion.button
            className="text-white focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </header>

      {/* Full-screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <nav className="text-center">
              {['Home', 'Services', 'Gallery', 'About', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="block text-2xl my-4 text-gray-300 hover:text-orange-500 transition-colors duration-300 relative overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  {item}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full opacity-60"
          >
            <source src="/video1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-70" />
        <motion.div 
          className="relative z-20 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.h2 
            className="text-6xl md:text-8xl font-bold mb-4 text-white shadow-lg font-sans"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            HORIZON
          </motion.h2>
          <motion.p 
            className="text-2xl md:text-3xl text-white mb-8 font-sans uppercase tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Take your real estate to the next level
          </motion.p>
          <motion.a
            href="#estimate"
            className="bg-orange-500 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:bg-orange-600 transition-colors duration-300 font-sans"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            Get an offer
          </motion.a>
        </motion.div>
      </section>

      {/* Estimate Section */}
      <section id="estimate" className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center font-playfair">Estimate Your Drone Service</h2>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-roboto">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={estimateData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-roboto">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={estimateData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="hours" className="block mb-2 font-roboto">Hours of Service</label>
              <input
                type="number"
                id="hours"
                name="hours"
                min="1"
                value={estimateData.hours}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="block mb-2 font-roboto">Location Type</label>
              <select
                id="location"
                name="location"
                value={estimateData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                required
              >
                <option value="urban">Urban</option>
                <option value="rural">Rural</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="resolution" className="block mb-2 font-roboto">Video Resolution</label>
              <select
                id="resolution"
                name="resolution"
                value={estimateData.resolution}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                required
              >
                <option value="4k">4K</option>
                <option value="8k">8K</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-roboto">Location</label>
              <div ref={mapRef} style={{ width: '100%', height: '200px' }} className="mb-2"></div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 mb-2"
              >
                Use Current Location
              </button>
            </div>
            <motion.button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Calculate Estimate
            </motion.button>
          </form>
          {estimatedPrice > 0 && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold font-playfair">Estimated Price</h3>
              <p className="text-4xl font-bold text-orange-500 font-playfair">${estimatedPrice}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-center py-8">
        <p className="text-gray-400">&copy; 2024 Horizon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LuxuryHorizonDroneEstimate;