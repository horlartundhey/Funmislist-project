// ShopMidBanner.jsx
import React from 'react';

export default function ShopMidBanner() {
  return (
    <div className="my-10 rounded-lg p-8 text-center bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-xl flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">Discover Weekly Deals!</h2>
      <p className="mb-4 text-lg md:text-xl drop-shadow">Save big on top products every week. Limited time offers!</p>
      <a href="#deals" className="inline-block bg-white text-fuchsia-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-fuchsia-100 transition">See Deals</a>
    </div>
  );
}
