import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBannersByPosition } from '../../slices/bannerSlice';

// Fallback banners if no backend banners are available
const fallbackBanners = [
  {
    _id: 'fallback-1',
    title: 'Mega Sale!',
    subtitle: 'Up to 50% off select products',
    imageUrl: '/public/vite.svg',
    backgroundColor: 'linear-gradient(to right, #60a5fa, #6366f1)',
    textColor: '#ffffff',
    linkUrl: '/shop',
    linkText: 'Shop Now'
  },
  {
    _id: 'fallback-2',
    title: 'New Arrivals',
    subtitle: 'Check out the latest products in our shop',
    imageUrl: '/public/background-pattern.svg',
    backgroundColor: 'linear-gradient(to right, #4ade80, #3b82f6)',
    textColor: '#ffffff',
    linkUrl: '/shop',
    linkText: 'Explore'
  },
  {
    _id: 'fallback-3',
    title: 'Shop with Confidence',
    subtitle: 'Quality products, fast delivery',
    imageUrl: '/public/Funmislist-cr.png',
    backgroundColor: 'linear-gradient(to right, #facc15, #ec4899)',
    textColor: '#ffffff',
    linkUrl: '/shop',
    linkText: 'Learn More'
  },
];

export default function ShopBanner() {
  const dispatch = useDispatch();
  const { shopBanners, loading } = useSelector((state) => state.banners);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use backend banners if available, otherwise fallback
  const banners = shopBanners.length > 0 ? shopBanners : fallbackBanners;

  useEffect(() => {
    // Fetch shop banners from backend
    dispatch(fetchBannersByPosition('shop'));
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading && shopBanners.length === 0) {
    return (
      <div className="relative mb-10 rounded-3xl px-6 py-10 md:py-16 text-center bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"
        style={{ minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-gray-500">Loading banners...</div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null; // Don't render if no banners
  }

  const currentBanner = banners[currentIndex];

  const handleBannerClick = () => {
    if (currentBanner.linkUrl) {
      window.location.href = currentBanner.linkUrl;
    }
  };

  return (
    <div 
      className="relative mb-10 rounded-3xl px-6 py-10 md:py-16 text-center shadow-2xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
      style={{ 
        minHeight: '260px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: currentBanner.backgroundColor || 'linear-gradient(to right, #60a5fa, #6366f1)',
        color: currentBanner.textColor || '#ffffff'
      }}
      onClick={handleBannerClick}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full z-10 relative">
        <div className="flex-shrink-0 flex items-center justify-center">
          <img 
            src={currentBanner.imageUrl} 
            alt={currentBanner.title} 
            className="h-28 w-28 md:h-40 md:w-40 object-contain rounded-xl shadow-lg border-4 border-white/30 bg-white/10"
            onError={(e) => {
              e.target.src = '/public/vite.svg'; // Fallback image
            }}
          />
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h2 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-2 tracking-tight">
            {currentBanner.title}
          </h2>
          <p className="mt-2 text-lg md:text-2xl drop-shadow font-medium max-w-xl">
            {currentBanner.subtitle}
          </p>
          {currentBanner.description && (
            <p className="mt-2 text-base md:text-lg drop-shadow max-w-xl opacity-90">
              {currentBanner.description}
            </p>
          )}
          {currentBanner.linkUrl && (
            <button 
              className="mt-4 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: currentBanner.buttonColor || '#ffffff',
                color: currentBanner.backgroundColor || '#1f2937'
              }}
            >
              {currentBanner.linkText || 'Learn More'}
            </button>
          )}
        </div>
      </div>
      
      {/* Pagination dots */}
      {banners.length > 1 && (
        <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`w-4 h-4 rounded-full border-2 border-white transition-all ${
                i === currentIndex ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl z-0"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl z-0"></div>
    </div>
  );
}
