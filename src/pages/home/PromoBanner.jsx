import React from "react";
import { useSelector } from "react-redux";

const PromoBanner = () => {
  const lang = useSelector((s) => s.locale.lang);

  return (
    <section className="bg-[#0E161B] text-center py-16 px-4 ">
      <p className="text-gray-300 text-sm md:text-base mb-4">
        {lang === "en" ? "The Men’s Intimate Care Expert" : "خبير العناية الحميمة للرجال"}
      </p>
      <h2 className="text-white text-2xl md:text-4xl font-bold">
        {lang === "en" ? "Try and you'll love it." : "جرّب وسوف تحبه."}
      </h2>
    </section>
  );
};

export default PromoBanner;
