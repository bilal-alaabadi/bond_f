// src/LangContext.jsx
import React, { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import productsApi from "./redux/features/products/productsApi";

export const LangContext = createContext("en");

// استخدمه في App.jsx:  import { LangProvider } from "./LangContext";
export const LangProvider = ({ children }) => {
  const lang = useSelector((s) => s?.locale?.lang || "en");
  const dispatch = useDispatch();

  // اضبط اتجاه <html> واللغة
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  // عند تغيير اللغة: أبطل كاش القوائم (وبإمكانك إبطال تفاصيل المنتج أيضًا)
  useEffect(() => {
    dispatch(productsApi.util.invalidateTags(["ProductList"]));
    // لو تبغى تجبر صفحات التفاصيل تعيد الجلب:
    // dispatch(productsApi.util.invalidateTags([{ type: "Product" }]));
  }, [lang, dispatch]);

  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
};
