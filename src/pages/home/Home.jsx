// src/pages/home/Home.jsx
import React from 'react';
import Banner from './Banner';
import TrendingProducts from '../shop/TrendingProducts';
import HeroSection from './HeroSection';
import DealsSection from './DealsSection';
import One from './One';
import PromoBanner from './PromoBanner';

const Home = () => {
  return (
    <>
      <Banner />
      <HeroSection />

      {/* ستة أماكن في الرئيسية يمكن التحكم بها عبر الحقل homeIndex (1..6) */}
      <TrendingProducts slot={1} flip={false} />
      <One />
      <TrendingProducts slot={2} flip={false} />
      <TrendingProducts slot={3} flip={true} />

      {/* المنتج الرابع بشكل خاص (مثل الصورة) */}
      <TrendingProducts slot={4} />
      <DealsSection />

      <TrendingProducts slot={5} flip={true} />
      <TrendingProducts slot={6} flip={false} />
      <PromoBanner />
    </>
  );
};

export default Home;
