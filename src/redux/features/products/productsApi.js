import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Product", "ProductList"],
  endpoints: (builder) => ({
    // جلب جميع المنتجات مع إمكانية التصفية
    fetchAllProducts: builder.query({
      query: ({
        category,
        minPrice,
        maxPrice,
        search,
        homeIndex,          // <-- دعم تمرير موضع الرئيسية
        sort = "createdAt:desc",
        page = 1,
        limit = 10,
      }) => {
        const params = {
          page: String(page),
          limit: String(limit),
          sort,
        };

        if (category && category !== "All") params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (search) params.search = search;
        if (homeIndex !== undefined && homeIndex !== null && homeIndex !== "")
          params.homeIndex = String(homeIndex);

        const queryParams = new URLSearchParams(params).toString();
        return `/?${queryParams}`;
      },
      transformResponse: (response) => ({
        products: response?.products ?? [],
        totalPages: response?.totalPages ?? 1,
        totalProducts: response?.totalProducts ?? 0,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: "Product", id: _id })),
              "ProductList",
            ]
          : ["ProductList"],
    }),

    // جلب منتج بالمعرّف (يتضمن homeIndex)
    fetchProductById: builder.query({
      query: (id) => `/product/${id}`,
      transformResponse: (response) => {
        if (!response?.product) {
          throw new Error("المنتج غير موجود");
        }
        const { product } = response;
        return {
          _id: product._id,
          name: product.name,
          category: product.category,
          size: product.size || "",
          price: product.price,
          oldPrice: product.oldPrice || "",
          description: product.description,
          image: Array.isArray(product.image) ? product.image : [product.image],
          author: product.author,
          homeIndex: product.homeIndex ?? "", // <-- إدراج موضع الرئيسية
        };
      },
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // جلب المنتجات المرتبطة
    fetchRelatedProducts: builder.query({
      query: (id) => `/related/${id}`,
      providesTags: (result, error, id) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    // إضافة منتج جديد (يدعم homeIndex)
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct, // يجب أن يحتوي على homeIndex إذا تم اختياره
      }),
      invalidatesTags: ["ProductList"],
    }),

    // تحديث المنتج (يدعم FormData و homeIndex)
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update-product/${id}`,
        method: "PATCH",
        body, // FormData يحتوي على الحقول + homeIndex إن وجد
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    // حذف المنتج
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

    // البحث عن المنتجات
    searchProducts: builder.query({
      query: (searchTerm) => `/search?q=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response) => {
        const list = Array.isArray(response) ? response : [];
        return list.map((product) => ({
          ...product,
          image: Array.isArray(product.image) ? product.image : [product.image],
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

    // الأكثر مبيعًا
    fetchBestSellingProducts: builder.query({
      query: (limit = 4) => `/best-selling?limit=${limit}`,
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
