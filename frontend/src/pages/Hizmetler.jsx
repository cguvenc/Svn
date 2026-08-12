import React, { useEffect } from "react";
import PageHero from "../components/PageHero";
import ServicesSection from "../components/sections/ServicesSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import useScrollReveal from "../hooks/useScrollReveal";
import { useLang } from "../i18n/LanguageContext";
import { useContent } from "../context/ContentContext";
import { COMPANY } from "../mock";

const Hizmetler = () => {
  const { t, lang } = useLang();
  const { loading } = useContent();
  useScrollReveal([lang, loading]);

  useEffect(() => {
    document.title = `${t.pageTitles.services} - ${COMPANY.brand}`;
  }, [t]);

  return (
    <>
      <PageHero title={t.pageTitles.services} tagline={t.services.tagline} crumb={t.nav.services} />
      <ServicesSection />
      <FeaturesSection />
    </>
  );
};

export default Hizmetler;
