import { createSlice } from "@reduxjs/toolkit";

const initialState = { lang: "en" }; // default English

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLang: (state, action) => {
      state.lang = action.payload; // "en" | "ar"
    },
    toggleLang: (state) => {
      state.lang = state.lang === "en" ? "ar" : "en";
    },
  },
});

export const { setLang, toggleLang } = localeSlice.actions;
export default localeSlice.reducer;
