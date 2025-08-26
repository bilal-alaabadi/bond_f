import React from 'react';
import { Link } from 'react-router-dom';
import timings from "../../assets/MA_Banner_Lotion Var2.png";

const Banner = () => {
  return (
    <div className="w-full pt-20">
      <Link to="/shop">
        <img
          src={timings}
          alt="صورة البانر"
          className="w-full h-auto object-cover"
        />
      </Link>
    </div>
  );
};

export default Banner;
