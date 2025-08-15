import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const TrendingProducts = ({ index = 0, flip = false }) => {
  const {
    data: { products = [] } = {},
    error,
    isLoading,
  } = useFetchAllProductsQuery({ category: '', page: 1, limit: 50 });

  if (isLoading) return <div className="text-center py-12 text-gray-600">جاري التحميل...</div>;
  if (error) return <div className="text-center py-12 text-red-500">حدث خطأ أثناء جلب البيانات.</div>;

  // ترتيب من الأحدث إلى الأقدم
  const sorted = [...products].sort(
    (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
  );

  const product = sorted[index];
  if (!product) return null;

  // شبكة الأعمدة: ثابتة 496px للصورة، والباقي للنص
  const gridCols = flip ? 'md:grid-cols-[1fr_496px]' : 'md:grid-cols-[496px_1fr]';

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="relative overflow-hidden rounded-2xl bg-white shadow-sm  ring-black/5">
          <div className={`grid grid-cols-1 ${gridCols} gap-8 md:gap-16 items-center`}>
            {/* الصورة (يسار افتراضيًا، يمين إذا flip) */}
            <div className={flip ? 'order-2 md:order-2' : 'order-1 md:order-1'}>
              <Link to={`/shop/${product._id}`} className="block">
                <div className="w-full aspect-[4/5] overflow-hidden md:w-[496px] md:h-[618px] md:aspect-auto">
                  <img
                    src={product.image?.[0] || 'https://via.placeholder.com/900x1200'}
                    alt={product?.name || ''}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/900x1200';
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* الاسم + الوصف + Shop Now (محاذاة يسار دائمًا) */}
            <div
              className={`${flip ? 'order-1 md:order-1' : 'order-2 md:order-2'} flex flex-col items-start text-left md:pl-6 lg:pl-10`}
              dir="ltr"
            >
              {product?.name && (
                <h3 className="uppercase text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-wide text-gray-900 mb-6">
                  {product.name}
                </h3>
              )}

              {product?.description && (
                <p className="text-gray-600 text-base md:text-lg leading-8 whitespace-pre-line mb-8 max-w-[620px]">
                  {product.description}
                </p>
              )}

              <Link
                to={`/shop/${product._id}`}
                className="inline-flex items-center justify-center rounded-md bg-[#9B2D1F] px-7 py-4 text-white text-sm md:text-base font-semibold shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B2D1F]"
                aria-label={product?.name ? `Open ${product.name}` : 'Open product'}
              >
                Shop Now
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default TrendingProducts;
