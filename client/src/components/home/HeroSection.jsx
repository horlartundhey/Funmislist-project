import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaDumbbell, FaGuitar, FaHotel, FaHome, FaBriefcase, FaLaptop, FaBook, FaShoppingBag, FaPlane, FaPaw, FaFutbol, FaGlassCheers, FaSpa, FaCar, FaStethoscope, FaTree, FaTools, FaUniversity, FaFilm, FaPalette, FaCouch, FaTshirt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../slices/categorySlice';
import React from 'react';

const HeroSection = () => {  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const { filteredCategories: categories } = useSelector((state) => state.categories);

  const slides = [
    'https://res.cloudinary.com/kamisama/image/upload/v1746846396/Untitled_design_dxd5g3.png',
    'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Slideshow */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Verified listings. Trusted sellers. Happy buyers
            </h1>
            <p className="text-xl text-gray-200 mb-12 animate-fade-in-delay">
              Discover amazing products, real estate properties and various categories listed.
            </p>

            {/* Search bar above category icons */}
            <div className="max-w-lg mx-auto mb-8">
              <form onSubmit={(e) => e.preventDefault()} className="flex">
                <input
                  type="text"
                  placeholder="Search for listings..."
                  className="flex-grow px-4 py-2 rounded-l-full focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-red-500 text-white px-6 py-2 rounded-r-full hover:bg-red-600 transition"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Popular categories icons - Listify style */}
            <div className="mt-8 flex justify-center space-x-6">
              {categories.slice(0, 5).map((category) => {
                const slug = category.name.toLowerCase().replace(/\s+/g, '-');
                // Fine-tuned icon mapping based on category name
                const name = category.name.toLowerCase();
                let icon = FaBriefcase;
                const iconMap = [
                  { keywords: ['electronics', 'gadget', 'device', 'phone', 'laptop', 'computer', 'tv'], icon: FaLaptop },
                  { keywords: ['furniture', 'sofa', 'couch', 'table', 'chair', 'bed'], icon: FaCouch },
                  { keywords: ['apparel', 'clothing', 'fashion', 'tshirt', 'shirt', 'dress', 'wear'], icon: FaTshirt },
                  { keywords: ['books', 'book', 'novel', 'literature', 'reading'], icon: FaBook },
                  { keywords: ['restaurant', 'food', 'cafe', 'dining'], icon: FaStore },
                  { keywords: ['fitness', 'gym', 'workout', 'health'], icon: FaDumbbell },
                  { keywords: ['event', 'music', 'concert', 'party'], icon: FaGuitar },
                  { keywords: ['hotel', 'inn', 'lodge', 'resort'], icon: FaHotel },
                  { keywords: ['estate', 'home', 'apartment', 'realty', 'property', 'house'], icon: FaHome },
                  { keywords: ['tech', 'technology', 'software', 'it'], icon: FaLaptop },
                  { keywords: ['education', 'school', 'learning', 'academy', 'college'], icon: FaBook },
                  { keywords: ['shopping', 'store', 'market', 'mall', 'boutique'], icon: FaShoppingBag },
                  { keywords: ['travel', 'flight', 'tour', 'trip', 'vacation'], icon: FaPlane },
                  { keywords: ['pet', 'animal', 'dog', 'cat'], icon: FaPaw },
                  { keywords: ['sport', 'football', 'soccer', 'basketball', 'tennis'], icon: FaFutbol },
                  { keywords: ['bar', 'drink', 'pub', 'club'], icon: FaGlassCheers },
                  { keywords: ['spa', 'wellness', 'massage'], icon: FaSpa },
                  { keywords: ['car', 'auto', 'vehicle', 'motor'], icon: FaCar },
                  { keywords: ['medical', 'hospital', 'clinic', 'doctor', 'healthcare'], icon: FaStethoscope },
                  { keywords: ['nature', 'park', 'garden', 'outdoor'], icon: FaTree },
                  { keywords: ['service', 'repair', 'maintenance', 'support'], icon: FaTools },
                  { keywords: ['university', 'faculty', 'campus'], icon: FaUniversity },
                  { keywords: ['movie', 'cinema', 'film', 'theater'], icon: FaFilm },
                  { keywords: ['art', 'gallery', 'museum', 'painting'], icon: FaPalette },
                ];
                for (const entry of iconMap) {
                  if (entry.keywords.some((kw) => name.includes(kw))) {
                    icon = entry.icon;
                    break;
                  }
                }
                return (
                  <Link key={category._id} to={`/category/${slug}`} className="flex flex-col items-center text-white hover:text-red-300 transition">
                    <div className="bg-white/20 p-4 rounded-full mb-2">
                      {React.createElement(icon, { size: 28 })}
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-red-500 w-4' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;