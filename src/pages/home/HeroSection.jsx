import React from 'react';

import card1 from "../../assets/g4741-Edit.png";
import card2 from "../../assets/Screenshot 2025-08-26 175624.png";
import card3 from "../../assets/Screenshot 2025-08-26 175638.png";
import card4 from "../../assets/Screenshot 2025-08-26 175649.png";

const cards = [
  { id: 1, image: card1, trend: "MEN'S INTIMATE WASH COLLECTION", title: 'DISCOVER YOUR SCENT' },
  { id: 2, image: card2, trend: "MEN'S WEAR COLLECTION",          title: 'STYLE THAT SPEAKS' },
  { id: 3, image: card3, trend: 'PERFUME LOTION COLLECTION',      title: 'ESSENCE OF ELEGANCE' },
  { id: 4, image: card4, trend: "MEN'S CARE COLLECTION",          title: 'ULTIMATE LUXURY' },
];

const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* شبكة الصور */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card) => (
          <article key={card.id} className="w-full flex flex-col items-center">
            {/* الصورة مربعة دائمًا - بدون قص */}
            <div className="w-[160px] h-[160px] sm:w-full sm:aspect-square overflow-hidden rounded-none shadow-sm bg-white flex items-center justify-center">
              <img
                src={card.image}
                alt={card.title}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>

            {/* النص */}
            <div className="mt-3 text-center">
              <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-gray-900">
                {card.trend} <span aria-hidden>→</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
