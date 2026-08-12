import React, { useEffect } from "react";
import PageHero from "../components/PageHero";
import FAQSection from "../components/sections/FAQSection";
import useScrollReveal from "../hooks/useScrollReveal";
import { useLang } from "../i18n/LanguageContext";
import { useContent } from "../context/ContentContext";
import { COMPANY } from "../mock";

const SSS = () => {
  const { t, lang } = useLang();
  const { loading } = useContent();
  useScrollReveal([lang, loading]);

  useEffect(() => {
    document.title = `${t.pageTitles.faq} - ${COMPANY.brand}`;
  }, [t]);

  return (
    <>
      <PageHero title={t.pageTitles.faq} tagline={t.faq.tagline} crumb={t.nav.faq} />
      <FAQSection />
    </>
  );
};

export default SSS;
