// src/pages/shop/ProductCards.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { LangContext } from "../../LangContext";

const ProductCards = ({ products }) => {
  const dispatch = useDispatch();
  const [addedItems, setAddedItems] = useState({});
  const { country } = useSelector((state) => state.cart);
  const lang = useContext(LangContext);

  // Helper: pick localized field with fallback
  const tField = (obj, base) => {
    if (!obj) return "";
    if (lang === "ar") return obj[`${base}_ar`] ?? obj[base] ?? "";
    return obj[`${base}_en`] ?? obj[base] ?? "";
  };

  const currency = country === "الإمارات" ? "AED" : "OMR";
  const rate = country === "الإمارات" ? 9.5 : 1;

  const priceFor = (p) => {
    if (!p) return 0;
    if (typeof p.price === "object" && p.price !== null) {
      return (p.price["500 جرام"] || 0) * rate;
    }
    return (p.regularPrice || p.price || 0) * rate;
  };

  const handleAdd = (product) => {
    const original = product.regularPrice || product.price || 0;
    dispatch(addToCart({ ...product, price: original }));
    setAddedItems((s) => ({ ...s, [product._id]: true }));
    setTimeout(() => setAddedItems((s) => ({ ...s, [product._id]: false })), 900);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => {
        const price = priceFor(p);
        const rawOld = p?.oldPrice ? p.oldPrice * rate : null;
        const hasDiscount = Number.isFinite(rawOld) && rawOld > price;
        const outOfStock = p?.stock === 0 || p?.inStock === false || p?.available === false;

        const name = tField(p, "name");
        const category = tField(p, "category");

        return (
          <div key={p._id} className="relative flex h-full flex-col overflow-hidden rounded-md bg-white">
            {outOfStock && (
              <div className="absolute left-5 top-3 z-10 rounded-md bg-white px-3 py-1 text-xs font-semibold shadow-sm">
                {lang === "ar" ? "غير متوفر" : "Sold out"}
              </div>
            )}

            {/* Image */}
            <Link to={`/shop/${p._id}`} className="block">
              <div className="w-full h-72 bg-white flex items-center justify-center">
                <img
                  src={p.image?.[0] || "https://via.placeholder.com/600"}
                  alt={name || "Product image"}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/600";
                  }}
                />
              </div>
            </Link>

            <div className="flex flex-1 flex-col px-3 pb-4">
              <h4 className="mt-2 text-center text-[13px] font-semibold uppercase leading-snug tracking-wide text-gray-900 line-clamp-2">
                {name || (lang === "ar" ? "اسم المنتج" : "Product Name")}
              </h4>

              <p className="mt-1 text-center text-[11px] uppercase tracking-widest text-gray-500">
                {category || (lang === "ar" ? "الفئة" : "Category")}
              </p>

              <div className="mt-2 text-center">
                <div className="text-[18px] font-semibold text-gray-900">
                  {price.toFixed(2)} {currency}
                </div>
                {hasDiscount && (
                  <div className="text-xs text-gray-500 line-through">
                    {rawOld.toFixed(2)} {currency}
                  </div>
                )}
              </div>

              {outOfStock ? (
                <button
                  disabled
                  className="mt-3 w-full rounded-md border-2 border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
                >
                  {lang === "ar" ? "غير متوفر" : "Sold out"}
                </button>
              ) : (
                <button
                  onClick={() => handleAdd(p)}
                  className={`mt-3 w-full rounded-md border-2 px-4 py-3 text-sm font-medium transition ${
                    addedItems[p._id]
                      ? "bg-green-500 text-white border-green-500"
                      : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  {addedItems[p._id] ? (lang === "ar" ? "تمت الإضافة" : "Added") : (lang === "ar" ? "أضف إلى السلة" : "Add to cart")}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCards;
