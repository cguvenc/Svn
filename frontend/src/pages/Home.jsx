import React, { useEffect } from "react";
import Hero from "../components/sections/Hero";
import HeroSlider from "../components/sections/HeroSlider";
import AboutSection from "../components/sections/AboutSection";
import ServicesSection from "../components/sections/ServicesSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import FAQSection from "../components/sections/FAQSection";
import useScrollReveal from "../hooks/useScrollReveal";
import { useLang } from "../i18n/LanguageContext";
import { useContent } from "../context/ContentContext";
import { COMPANY } from "../mock";

const Home = () => {
  const { lang } = useLang();
  const { loading, slides } = useContent();
  useScrollReveal([lang, loading]);

  useEffect(() => {
    document.title = `${COMPANY.brand} - Özel Servis, Bakım, Onarım ve Yedek Parça`;
  }, []);

  return (
    <>
      {slides.length > 0 ? <HeroSlider /> : <Hero />}
      <AboutSection />
      <ServicesSection />
      <FeaturesSection />
      <FAQSection />
    </>
  );
};

export default Home;
