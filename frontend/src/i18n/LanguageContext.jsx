import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CONTENT } from "../mock";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("svn_lang") || "tr");

  useEffect(() => {
    localStorage.setItem("svn_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "tr" ? "en" : "tr"));
  }, []);

  const t = CONTENT[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
};
