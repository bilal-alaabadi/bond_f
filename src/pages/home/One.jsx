import React from 'react';
import img1 from '../../assets/SL_Model Set_AR Var1.png';
import img2 from '../../assets/SL_Model Set_AR Var2.png';

const One = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 m-0 p-0">
        <div className="h-[380px] md:h-[640px]">
          <img
            src={img1}
            alt=""
            className="block w-full h-full object-cover"
          />
        </div>
        <div className="h-[380px] md:h-[640px]">
          <img
            src={img2}
            alt=""
            className="block w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default One;
