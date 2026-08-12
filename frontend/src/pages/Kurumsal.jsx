import React, { useEffect } from "react";
import PageHero from "../components/PageHero";
import AboutSection from "../components/sections/AboutSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import useScrollReveal from "../hooks/useScrollReveal";
import { useLang } from "../i18n/LanguageContext";
import { COMPANY } from "../mock";

const Kurumsal = () => {
  const { t, lang } = useLang();
  useScrollReveal([lang]);

  useEffect(() => {
    document.title = `${t.pageTitles.about} - ${COMPANY.brand}`;
  }, [t]);

  return (
    <>
      <PageHero title={t.pageTitles.about} tagline={t.about.tagline} crumb={t.nav.about} />
      <AboutSection />
      <FeaturesSection />
    </>
  );
};

export default Kurumsal;
