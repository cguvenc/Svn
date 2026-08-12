import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api";
import { COMPANY } from "../mock";

const ContentContext = createContext(null);

// Fallback settings so the UI never flashes empty before fetch resolves.
const FALLBACK_SETTINGS = {
  brand: COMPANY.brand,
  phone: COMPANY.phone,
  phone_raw: COMPANY.phoneRaw,
  whatsapp: COMPANY.whatsapp,
  email: COMPANY.email,
  email2: COMPANY.email2,
  address_line: COMPANY.addressLine,
  map_query: COMPANY.mapQuery,
  instagram: "#", facebook: "#", linkedin: "#",
  hero_title_tr: "", hero_title_en: "", hero_subtitle_tr: "", hero_subtitle_en: "",
  about_p1_tr: "", about_p1_en: "", about_p2_tr: "", about_p2_en: "",
  about_points_tr: [], about_points_en: [],
};

export const ContentProvider = ({ children }) => {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [services, setServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [slides, setSlides] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [s, sv, tm, fq, sl, pg] = await Promise.all([
        api.get("/settings"),
        api.get("/services"),
        api.get("/team"),
        api.get("/faqs"),
        api.get("/slides"),
        api.get("/pages"),
      ]);
      if (s.data && s.data.brand) setSettings({ ...FALLBACK_SETTINGS, ...s.data });
      setServices(sv.data || []);
      setTeam(tm.data || []);
      setFaqs(fq.data || []);
      setSlides((sl.data || []).filter((x) => x.active !== false));
      setPages(pg.data || []);
    } catch (e) {
      // keep fallbacks
      console.error("Content load failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ContentContext.Provider value={{ settings, services, team, faqs, slides, pages, loading, reload: load }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
};
