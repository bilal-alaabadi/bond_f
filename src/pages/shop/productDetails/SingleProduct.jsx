// ========================= SingleProduct.jsx (EN only) =========================
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, error, isLoading } = useFetchProductByIdQuery(id);
  const { country } = useSelector((s) => s.cart);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const [qty, setQty] = useState(1);           // <-- quantity field (rectangle)
  const [adding, setAdding] = useState(false);

  const product = data || {};
  const images = Array.isArray(product.image) ? product.image : product.image ? [product.image] : [];
  const reviews = product?.reviews || [];

  const currency = country === 'الإمارات' ? 'AED' : 'OMR';
  const rate = country === 'الإمارات' ? 9.5 : 1;

  const outOfStock = product?.inStock === false || product?.stock === 0;

  useEffect(() => {
    setImageScale(1.05);
    const t = setTimeout(() => setImageScale(1), 250);
    return () => clearTimeout(t);
  }, [currentImageIndex]);

  const basePrice = useMemo(() => {
    if (typeof product?.price === 'object' && product?.price !== null) {
      const vals = Object.values(product.price).filter((v) => typeof v === 'number');
      if (vals.length) return Math.min(...vals);
    }
    return product?.regularPrice || product?.price || 0;
  }, [product]);

  const price = (basePrice || 0) * rate;
  const oldPrice = product?.oldPrice ? product.oldPrice * rate : null;
  const discountPct = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const handleAdd = () => {
    if (outOfStock) return;
    const safeQty = Number.isFinite(+qty) && +qty > 0 ? Math.floor(+qty) : 1;
    setAdding(true);
    // add the chosen quantity
    dispatch(
      addToCart({
        ...product,
        price: basePrice,     // keep base currency in store
        quantity: safeQty,    // pass selected quantity to cart
      })
    );
    setTimeout(() => setAdding(false), 800);
  };

  if (isLoading) return <p className="section__container">Loading…</p>;
  if (error) return <p className="section__container text-red-600">Failed to load product.</p>;

  return (
    <>
      {/* Breadcrumb */}
      <section className="section__container ">

      </section>

      {/* Content */}
      <section className="section__container mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Images */}
          <div className="md:w-1/2 w-full">
            <div className="relative overflow-hidden rounded-md">
              {oldPrice && (
                <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  SALE {discountPct}%
                </div>
              )}
              <img
                src={images[currentImageIndex] || 'https://via.placeholder.com/800x800?text=No+Image'}
                alt={product?.name || 'product'}
                className="w-full h-auto transition-transform duration-300"
                style={{ transform: `scale(${imageScale})` }}
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x800?text=Image'; }}
              />
            </div>

            {/* Thumbnails — show ALL images */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`border rounded overflow-hidden aspect-square ${idx === currentImageIndex ? 'ring-2 ring-[#3D4B2E]' : 'hover:opacity-80'}`}
                    title={`Image ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Image'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md:w-1/2 w-full">
            <h1 className="text-2xl font-semibold mb-2">{product?.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-xl text-[#3D4B2E] font-semibold">
                {price.toFixed(2)} {currency}
              </span>
              {oldPrice && <s className="text-gray-500">{oldPrice.toFixed(2)} {currency}</s>}
            </div>

            {/* Meta */}
            <div className="mb-3">
              <span className="block font-bold text-gray-800">Category</span>
              <span className="text-gray-600">{product?.category || '—'}</span>
            </div>

            <div className="mb-6">
              <span className="block font-bold text-gray-800">Description</span>
              <p className="text-gray-700 leading-relaxed">{product?.description || '—'}</p>
            </div>

            {/* Quantity rectangle (connected to cart add) */}
           {/* Quantity rectangle */}
<div className="mb-4">
  <span className="block font-bold text-gray-800 mb-2">Quantity</span>
  <div className="flex items-center border rounded-md w-32 h-11 overflow-hidden">
    <button
      type="button"
      onClick={() => setQty((q) => Math.max(1, Number(q) - 1))}
      className="flex-1 h-full grid place-items-center text-lg hover:bg-gray-100"
    >
      −
    </button>
    <div className="w-10 text-center text-base select-none">{qty}</div>
    <button
      type="button"
      onClick={() => setQty((q) => Number(q) + 1)}
      className="flex-1 h-full grid place-items-center text-lg hover:bg-gray-100"
    >
      +
    </button>
  </div>
</div>


            {/* Single action — Add to Cart only */}
            {outOfStock ? (
              <button type="button" disabled className="w-full h-12 mt-2 rounded-md bg-gray-200 text-gray-600 cursor-not-allowed">
                Sold Out
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full h-12 mt-2 rounded-md text-white transition-all ${adding ? 'bg-green-600' : 'bg-[#7A2432] '}`}
              >
                {adding ? 'Added!' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section__container mt-8">
        <ReviewsCard productReviews={reviews} />
      </section>
    </>
  );
};

export default SingleProduct;
