import React from 'react';

import card1 from "../../assets/SL_Placement Set_LS-BF.png";
import card2 from "../../assets/SL_Placement Set_LS-BF.png";
import card3 from "../../assets/SL_Placement Set_LS-BF.png";
import card4 from "../../assets/SL_Placement Set_LS-BF.png";

const cards = [
  { id: 1, image: card1, trend: "MEN'S INTIMATE WASH COLLECTION", title: 'DISCOVER YOUR SCENT' },
  { id: 2, image: card2, trend: "MEN'S WEAR COLLECTION",             title: 'STYLE THAT SPEAKS' },
  { id: 3, image: card3, trend: 'PERFUME LOTION COLLECTION',         title: 'ESSENCE OF ELEGANCE' },
  { id: 4, image: card4, trend: "MEN'S CARE COLLECTION",             title: 'ULTIMATE LUXURY' },
];

const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* صور مربعة + تقليل المسافة بين العناصر */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card) => (
          <article key={card.id} className="w-full">
            {/* الحاوية مربعة؛ الصورة لا تتمدد (object-cover + object-center) */}
            <div className="w-full aspect-square overflow-hidden rounded-md shadow-sm">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>

            <div className="mt-3 text-center">
              <p className="text-sm font-semibold tracking-wide uppercase text-gray-900">
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
