import React from "react";
import { useSelector } from "react-redux";

const DealsSection = () => {
  const lang = useSelector((s) => s.locale.lang);

  return (
    <section className="relative bg-[#0E161B] text-white py-12 flex flex-col items-center justify-center text-center">
      <div className="px-6 py-2 mb-4">
        <h2 className="text-3xl font-bold tracking-wide">
          {lang === "en" ? "BOND IS" : "بوند هو"}
        </h2>
      </div>

      <p className="max-w-3xl text-sm md:text-base leading-relaxed">
        {lang === "en"
          ? `Bond ... the expert in men’s intimate hygiene
             Designed to meet every man’s needs,
             guaranteed No.1 in sales, leading the market for over 18 years.`
          : `بوند ... الخبير في العناية الحميمة للرجال
             مصمم لتلبية احتياجات كل رجل،
             رقم 1 في المبيعات وضامن للريادة لأكثر من 18 عامًا.`}
      </p>
    </section>
  );
};

export default DealsSection;
