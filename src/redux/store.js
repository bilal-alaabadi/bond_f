import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./features/cart/cartSlice";
import authApi from "./features/auth/authApi";
import authReducer from "./features/auth/authSlice";
import productsApi from "./features/products/productsApi";
import reviewApi from "./features/reviews/reviewsApi";
import statsApi from "./features/stats/statsApi";
import orderApi from "./features/orders/orderApi";

// اللغة
import localeReducer from "./features/locale/localeSlice";

// استعادة اللغة من localStorage (افتراضي "en")
const savedLang =
  typeof window !== "undefined" ? localStorage.getItem("lang") : null;

const preloadedState = {
  locale: { lang: savedLang || "en" },
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    locale: localeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productsApi.middleware,
      reviewApi.middleware,
      statsApi.middleware,
      orderApi.middleware
    ),
  preloadedState,
});

// احفظ اللغة تلقائيًا عند تغييرها
if (typeof window !== "undefined") {
  store.subscribe(() => {
    const lang = store.getState().locale.lang;
    localStorage.setItem("lang", lang);
  });
}
