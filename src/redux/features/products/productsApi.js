// src/redux/features/products/productsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

/**
 * ملاحظات هامة:
 * - كل الاستعلامات تدعم تمرير وسيطة اللغة `lang` وستُلحق تلقائياً بـ query string.
 * - fetchProductById/fetchRelatedProducts يدعمان تمريل "id" كسلسلة فقط أو كائن { id, lang } للتوافق.
 * - نحاول توحيد الصور لتكون دائمًا مصفوفة Array لتفادي الأعطال في الواجهة.
 * - نُعيد reviews مع منتج واحد إن كانت موجودة من الـ API.
 */

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Product", "ProductList"],
  endpoints: (builder) => ({
    /* ======================== جميع المنتجات ======================== */
    fetchAllProducts: builder.query({
      // يدعم args اختياري مع قيم افتراضية
      query: (args = {}) => {
        const {
          category,
          minPrice,
          maxPrice,
          search,
          homeIndex,
          sort = "createdAt:desc",
          page = 1,
          limit = 10,
          lang = "en",
        } = args;

        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sort,
          lang,
        });

        if (category && category !== "All") params.set("category", category);
        if (minPrice) params.set("minPrice", String(minPrice));
        if (maxPrice) params.set("maxPrice", String(maxPrice));
        if (search) params.set("search", String(search));
        if (homeIndex !== undefined && homeIndex !== null && homeIndex !== "")
          params.set("homeIndex", String(homeIndex));

        return `/?${params.toString()}`;
      },
      transformResponse: (response) => {
  const list = Array.isArray(response?.products) ? response.products : [];

  const normalized = list.map((p) => {
    const name =
      p?.name ??
      p?.name_ar ??
      p?.name_en ??
      ""; // أولوية: name ثم العربي ثم الإنجليزي

    const description =
      p?.description ??
      p?.description_ar ??
      p?.description_en ??
      "";

    const category =
      p?.category ??
      p?.category_ar ??
      p?.category_en ??
      "";

    const image = Array.isArray(p?.image) ? p.image : p?.image ? [p.image] : [];

    return {
      ...p,
      name,
      description,
      category,
      image,
      size: p?.size ?? "",
      homeIndex: p?.homeIndex ?? "",
      oldPrice: p?.oldPrice ?? "",
    };
  });

  return {
    products: normalized,
    totalPages: response?.totalPages ?? 1,
    totalProducts: response?.totalProducts ?? normalized.length,
  };
},

      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: "Product", id: _id })),
              "ProductList",
            ]
          : ["ProductList"],
    }),

    /* ======================== منتج واحد ======================== */
    /* ======================== منتج واحد ======================== */
fetchProductById: builder.query({
  // يدعم: fetchProductById(id) أو fetchProductById({ id, lang })
  query: (arg) => {
    let id;
    let lang = "en";
    if (typeof arg === "string" || typeof arg === "number") {
      id = arg;
    } else if (arg && typeof arg === "object") {
      id = arg.id;
      lang = arg.lang || "en";
    }
    return {
      url: `/product/${id}`,
      params: { lang },
    };
  },
  transformResponse: (response) => {
    const product = response?.product ?? response ?? {};
    return {
      _id: product._id,
      // الحقول الأساسية
      name: product.name,
      category: product.category,
      size: product.size || "",
      price: product.price,
      oldPrice: product.oldPrice || "",
      description: product.description,
      image: Array.isArray(product.image)
        ? product.image
        : product.image
        ? [product.image]
        : [],
      author: product.author,
      homeIndex: product.homeIndex ?? "",
      // ✅ نضيف الحقول الثنائية (حتى تظهر في التعديل)
      name_en: product.name_en || "",
      name_ar: product.name_ar || "",
      description_en: product.description_en || "",
      description_ar: product.description_ar || "",
      category_en: product.category_en || "",
      category_ar: product.category_ar || "",
      // المراجعات
      reviews: Array.isArray(response?.reviews) ? response.reviews : [],
    };
  },
  providesTags: (result, error, arg) => {
    const id = typeof arg === "object" ? arg.id : arg;
    return [{ type: "Product", id }];
  },
}),


    /* ======================== منتجات مرتبطة ======================== */
    fetchRelatedProducts: builder.query({
      // يدعم: fetchRelatedProducts(id) أو fetchRelatedProducts({ id, lang })
      query: (arg) => {
        let id;
        let lang = "en";
        if (typeof arg === "string" || typeof arg === "number") {
          id = arg;
        } else if (arg && typeof arg === "object") {
          id = arg.id;
          lang = arg.lang || "en";
        }
        return {
          url: `/related/${id}`,
          params: { lang },
        };
      },
      transformResponse: (response) => {
        const list = Array.isArray(response) ? response : Array.isArray(response?.products) ? response.products : [];
        return list.map((p) => ({
          ...p,
          image: Array.isArray(p?.image) ? p.image : p?.image ? [p.image] : [],
        }));
      },
      providesTags: (result, error, arg) => {
        const id = typeof arg === "object" ? arg.id : arg;
        return [{ type: "Product", id }, "ProductList"];
      },
    }),

    /* ======================== إنشاء منتج ======================== */
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["ProductList"],
    }),

    /* ======================== تحديث منتج ======================== */
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update-product/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    /* ======================== حذف منتج ======================== */
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    /* ======================== بحث المنتجات ======================== */
    searchProducts: builder.query({
      query: ({ q, lang = "en" }) => `/search?q=${encodeURIComponent(q)}&lang=${lang}`,
      transformResponse: (response) => {
        const list = Array.isArray(response) ? response : [];
        return list.map((product) => ({
          ...product,
          image: Array.isArray(product?.image) ? product.image : product?.image ? [product.image] : [],
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Product", id: _id })),
              "ProductList",
            ]
          : ["ProductList"],
    }),

    /* ======================== الأكثر مبيعًا ======================== */
    fetchBestSellingProducts: builder.query({
      query: ({ limit = 4, lang = "en" } = {}) =>
        `/best-selling?limit=${encodeURIComponent(limit)}&lang=${encodeURIComponent(lang)}`,
      transformResponse: (response) => {
        const list = Array.isArray(response) ? response : Array.isArray(response?.products) ? response.products : [];
        return list.map((p) => ({
          ...p,
          image: Array.isArray(p?.image) ? p.image : p?.image ? [p.image] : [],
        }));
      },
      providesTags: ["ProductList"],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useLazyFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useLazyFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useFetchBestSellingProductsQuery,
} = productsApi;

export default productsApi;
