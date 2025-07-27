// ShopBanner.jsx
import React from 'react';

const banners = [
  {
    image: '/public/vite.svg',
    title: 'Mega Sale!',
    subtitle: 'Up to 50% off select products',
    bg: 'bg-gradient-to-r from-blue-400 to-indigo-500',
  },
  {
    image: '/public/background-pattern.svg',
    title: 'New Arrivals',
    subtitle: 'Check out the latest products in our shop',
    bg: 'bg-gradient-to-r from-green-400 to-blue-500',
  },
  {
    image: '/public/Funmislist-cr.png',
    title: 'Shop with Confidence',
    subtitle: 'Quality products, fast delivery',
    bg: 'bg-gradient-to-r from-yellow-400 to-pink-500',
  },
];

export default function ShopBanner() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const banner = banners[index];

  return (
    <div className={`relative mb-10 rounded-3xl px-6 py-10 md:py-16 text-center text-white shadow-2xl overflow-hidden ${banner.bg}`}
      style={{ minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
        <div className="flex-shrink-0 flex items-center justify-center">
          <img src={banner.image} alt={banner.title} className="h-28 w-28 md:h-40 md:w-40 object-contain rounded-xl shadow-lg border-4 border-white/30 bg-white/10" />
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h2 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-2 tracking-tight">{banner.title}</h2>
          <p className="mt-2 text-lg md:text-2xl drop-shadow font-medium max-w-xl">{banner.subtitle}</p>
        </div>
      </div>
      <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <span key={i} className={`inline-block w-4 h-4 rounded-full border-2 border-white ${i === index ? 'bg-white' : 'bg-white/40'}`}></span>
        ))}
      </div>
      {/* Decorative blurred circles */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl z-0"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl z-0"></div>
    </div>
  );
}
