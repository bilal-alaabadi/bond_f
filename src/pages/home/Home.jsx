import React from 'react';
import Banner from './Banner';
import TrendingProducts from '../shop/TrendingProducts';
import HeroSection from './HeroSection';
import DealsSection from './DealsSection';
import One from './One';

const Home = () => {
  return (
    <>
      <Banner />
      <HeroSection />
      <DealsSection />

      {/* الأحدث - عادي */}
      <TrendingProducts index={0} flip={false} />
      <One />

      {/* الثاني - نفس الأول (غير معكوس) */}
      <TrendingProducts index={1} flip={false} />

      {/* الثالث - معكوس */}
      <TrendingProducts index={2} flip={true} />

    </>
  );
};

export default Home;
