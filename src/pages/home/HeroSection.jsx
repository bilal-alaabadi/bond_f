import React from "react";
import { useSelector } from "react-redux";

import card1 from "../../assets/g4741-Edit.png";
import card2 from "../../assets/Screenshot 2025-08-26 175624.png";
import card3 from "../../assets/Screenshot 2025-08-26 175638.png";
import card4 from "../../assets/Screenshot 2025-08-26 175649.png";

const HeroSection = () => {
  const lang = useSelector((s) => s.locale.lang);

  const cards = [
    {
      id: 1,
      image: card1,
      trend: lang === "en" ? "MEN'S INTIMATE WASH COLLECTION" : "مجموعة غسول الرجال",
      title: lang === "en" ? "DISCOVER YOUR SCENT" : "اكتشف عطرك",
    },
    {
      id: 2,
      image: card2,
      trend: lang === "en" ? "MEN'S WEAR COLLECTION" : "مجموعة ملابس الرجال",
      title: lang === "en" ? "STYLE THAT SPEAKS" : "أناقة تتحدث",
    },
    {
      id: 3,
      image: card3,
      trend: lang === "en" ? "PERFUME LOTION COLLECTION" : "مجموعة لوشن العطور",
      title: lang === "en" ? "ESSENCE OF ELEGANCE" : "جوهر الأناقة",
    },
    {
      id: 4,
      image: card4,
      trend: lang === "en" ? "MEN'S CARE COLLECTION" : "مجموعة العناية بالرجال",
      title: lang === "en" ? "ULTIMATE LUXURY" : "الفخامة المطلقة",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card) => (
          <article key={card.id} className="w-full flex flex-col items-center">
            <div className="w-[160px] h-[160px] sm:w-full sm:aspect-square overflow-hidden rounded-none shadow-sm  flex items-center justify-center">
              <img
                src={card.image}
                alt={card.title}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-gray-900">
                {card.trend} <span aria-hidden>→</span>
              </p>
              <p className="text-sm text-gray-700">{card.title}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
