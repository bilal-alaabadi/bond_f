import React from 'react';
import dealsImg from "../../assets/SL_Placement Set_LS-BF.png";

const DealsSection = () => {
  return (
    <section className="relative bg-[#0E161B] text-white py-12 flex flex-col items-center justify-center text-center">
      {/* الخلفية (اختياري صورة) */}
      {/* <img 
        src={dealsImg} 
        alt="Deals" 
        className="absolute inset-0 w-full h-full object-cover opacity-10" 
      /> */}

      {/* العنوان داخل مربع شفاف */}
      <div className="px-6 py-2 mb-4">
        <h2 className="text-3xl font-bold tracking-wide">BOND IS</h2>
      </div>

      {/* النص تحت العنوان */}
<p className="max-w-3xl text-sm md:text-base leading-relaxed">
  Bond ... the expert in men’s intimate hygiene   
  Designed to meet every man’s needs,  
  guaranteed No.1 in sales, leading the market for over 18 years.
</p>

    </section>
  );
};

export default DealsSection;
