// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import main from '../assets/MA_Banner_Lotion Var2.png';
import img1 from '../assets/PS_130mL_VG.png';
import img2 from '../assets/PS_200mL_AR.png';

const About = () => {
  const lang = useSelector((s) => s.locale.lang);

  const t = {
    en: {
      bannerAlt: 'Main Banner',
      sec1Title: 'Cleanliness is next to Manliness',
      sec1Body:
        'Founded in 2004, Bond Wash has been a long-standing innovator in the male intimate hygiene space. Our first-of-their-kind premium washes were developed to assist all types of men in feeling more comfortable, clean and confident through specialized care for their most intimate parts.',
      sec2Title: 'The Men’s Intimate Care Expert',
      sec2Body:
        'Since 2004, Bond Wash has been developing specialty intimate hygiene products just for men. We’ve perfected our formula to have the best feeling and most attractively aromatic masculine intimate washes that will leave you feeling fresher and more confident than ever.',
      shopNow: 'Shop now',
      img1Alt: 'Cleanliness',
      img2Alt: 'Men Care',
    },
    ar: {
      bannerAlt: 'لافتة رئيسية',
      sec1Title: 'النظافة قرينة الرجولة',
      sec1Body:
        'منذ عام 2004، تعد Bond Wash من أوائل المبتكرين في مجال العناية الحميمة للرجال. طوّرنا غسولات فاخرة وفريدة لمساعدة مختلف الرجال على الشعور براحة أكبر ونظافة وثقة من خلال عناية متخصصة لأكثر المناطق حساسية.',
      sec2Title: 'خبير العناية الحميمة للرجال',
      sec2Body:
        'منذ 2004، نطوّر في Bond Wash منتجات عناية حميمة متخصصة للرجال فقط. قمنا بصقل تركيبتنا لتمنح أفضل إحساس ورائحة ذكورية جذابة، لتتركك أكثر انتعاشًا وثقة من أي وقت مضى.',
      shopNow: 'تسوّق الآن',
      img1Alt: 'النظافة',
      img2Alt: 'عناية الرجال',
    },
  }[lang || 'en'];

  const isAR = lang === 'ar';

  return (
    <div className="about-section pb-10 pt-10" dir={isAR ? 'rtl' : 'ltr'} style={{ textAlign: isAR ? 'right' : 'left' }}>
      {/* البنر العلوي */}
      <div style={{ width: '100%', marginBottom: '50px' }}>
        <img
          src={main}
          alt={t.bannerAlt}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 0 }}
        />
      </div>

      {/* القسم الأول */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '80px',
          padding: '0 20px',
        }}
      >
        <img
          src={img1}
          alt={t.img1Alt}
          style={{ maxWidth: '400px', width: '100%', borderRadius: '8px' }}
        />
        <div style={{ maxWidth: '400px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>{t.sec1Title}</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '20px' }}>{t.sec1Body}</p>
          <Link to="/shop">
            <button
              style={{
                backgroundColor: '#8B1E2D',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {t.shopNow}
            </button>
          </Link>
        </div>
      </div>

      {/* القسم الثاني */}
      <div
        style={{
          display: 'flex',
          flexWrap: isAR ? 'wrap' : 'wrap-reverse', // عكس الترتيب في العربي ليكون النص يسار الصورة
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          padding: '0 20px',
        }}
      >
        <div style={{ maxWidth: '400px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>{t.sec2Title}</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '20px' }}>{t.sec2Body}</p>
          <Link to="/shop">
            <button
              style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {t.shopNow}
            </button>
          </Link>
        </div>
        <img
          src={img2}
          alt={t.img2Alt}
          style={{ maxWidth: '400px', width: '100%', borderRadius: '8px' }}
        />
      </div>
    </div>
  );
};

export default About;
