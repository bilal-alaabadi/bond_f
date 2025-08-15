import React from 'react';
import { Link } from 'react-router-dom';
import main from '../assets/MA_Banner_Lotion Var2.png'; // صورة البنر العلوي
import img1 from '../assets/SL_Placement Set_LS-BF.png'; // صورة الرجل الأول
import img2 from '../assets/SL_Placement Set_LS-BF.png'; // صورة الرجل الثاني

const About = () => {
  return (
    <div className="about-section">
      
      {/* البنر العلوي */}
      <div style={{ width: '100%', marginBottom: '50px' }}>
        <img
          src={main}
          alt="Main Banner"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '0'
          }}
        />
      </div>

      {/* القسم الأول */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        marginBottom: '80px',
        padding: '0 20px'
      }}>
        <img src={img1} alt="Cleanliness" style={{ maxWidth: '400px', width: '100%', borderRadius: '8px' }} />
        <div style={{ maxWidth: '400px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
            Cleanliness is next to Manliness
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
            Founded in 2004, Bond Wash has been a long-standing innovator in the male intimate hygiene space.
            Our first-of-their-kind premium washes were developed to assist all types of men in feeling more
            comfortable, clean and confident through specialized care for their most intimate parts.
          </p>
          <Link to="/shop">
            <button style={{
              backgroundColor: '#8B1E2D',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Shop now
            </button>
          </Link>
        </div>
      </div>

      {/* القسم الثاني */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        padding: '0 20px'
      }}>
        <div style={{ maxWidth: '400px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
            The Men’s Intimate Care Expert
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
            Since 2004, Bond Wash has been developing specialty intimate hygiene products just for men.
            We’ve perfected our formula to have the best feeling and most attractively aromatic masculine
            intimate washes that will leave you feeling fresher and more confident than ever.
          </p>
          <Link to="/shop">
            <button style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Shop now
            </button>
          </Link>
        </div>
        <img src={img2} alt="Men Care" style={{ maxWidth: '400px', width: '100%', borderRadius: '8px' }} />
      </div>

    </div>
  );
};

export default About;
