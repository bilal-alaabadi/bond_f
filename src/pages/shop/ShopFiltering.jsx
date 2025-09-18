// src/pages/shop/ShopFiltering.jsx
import React, { useContext } from "react";
import { LangContext } from "../../LangContext";

// قاموس عرض أسماء التصنيفات حسب اللغة.
// IMPORTANT: المفاتيح (left side) تبقى بالإنجليزي لأنها تُرسل للـ API.
const CATEGORY_LABELS = {
  All: { en: "All", ar: "الكل" },
  "Men’s Washes": { en: "Men’s Washes", ar: "غسولات الرجال" },
  "Women’s Washes": { en: "Women’s Washes", ar: "غسولات النساء" },
  "Liquid Bath Soap": { en: "Liquid Bath Soap", ar: "جل الاستحمام المعطر" },
  Deodorant: { en: "Deodorant", ar: "مزيل العرق" },
  "Body Wet Wipes": { en: "Body Wet Wipes", ar: "مناديل مبللة للجسم" },
  "Body Powder": { en: "Body Powder", ar: "بودرة الجسم" },
  "Body Moisturizer": { en: "Body Moisturizer", ar: "مرطب الجسم" },
};

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters }) => {
  const lang = useContext(LangContext);

  const t = (enKey) => {
    const item = CATEGORY_LABELS[enKey];
    if (!item) return enKey; // fallback لو تصنيف جديد غير مضاف بالقاموس
    return lang === "ar" ? item.ar : item.en;
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold">
          {lang === "ar" ? "عوامل التصفية" : "Filters"}
        </h3>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">{lang === "ar" ? "الفئة" : "Category"}</h4>
        <hr className="border-gray-200" />
        <div className="space-y-2">
          {filters.categories.map((categoryKey) => (
            <label key={categoryKey} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={categoryKey}                           // القيمة تبقى EN
                checked={filtersState.category === categoryKey}
                onChange={(e) =>
                  setFiltersState({
                    ...filtersState,
                    category: e.target.value,                 // نُخزن EN في الحالة
                  })
                }
                className="h-4 w-4"
              />
              <span className="text-sm">{t(categoryKey)}</span> {/* نعرض حسب اللغة */}
            </label>
          ))}
        </div>
      </div>

      {/* Clear */}
      <button
        onClick={clearFilters}
        className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
      >
        <i className="ri-refresh-line" />
        {lang === "ar" ? "مسح كل الفلاتر" : "Clear all filters"}
      </button>
    </div>
  );
};

export default ShopFiltering;
