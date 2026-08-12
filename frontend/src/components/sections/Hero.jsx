import React from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";
import { useLang } from "../../i18n/LanguageContext";
import { useContent } from "../../context/ContentContext";
import { IMAGES } from "../../mock";

const Hero = () => {
  const { t, lang } = useLang();
  const { settings } = useContent();
  const navigate = useNavigate();

  const title = (lang === "tr" ? settings.hero_title_tr : settings.hero_title_en) || t.hero.title;
  const subtitle = (lang === "tr" ? settings.hero_subtitle_tr : settings.hero_subtitle_en) || t.hero.subtitle;
  const tagline = (lang === "tr" ? settings.hero_tagline_tr : settings.hero_tagline_en) || t.hero.tagline;
  const heroImg = settings.hero_image || IMAGES.hero;

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="SVN Makina iş makineleri teknik servis"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/85 via-neutral-950/75 to-neutral-950/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-32">
        <p className="tagline text-brand-light mb-4 animate-[fadeIn_0.6s_ease]">
          {tagline}
        </p>
        <h1 className="font-display font-extrabold text-white text-4xl md:text-6xl leading-tight mb-6">
          {title}
        </h1>
        <p className="text-neutral-200 text-base md:text-lg max-w-2xl mx-auto mb-9 leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate("/iletisim")}
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-7 py-3.5 rounded-full transition-colors shadow-lg shadow-brand/30"
          >
            <Phone size={18} /> {t.hero.primary}
          </button>
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb457] text-white font-semibold px-7 py-3.5 rounded-full transition-colors shadow-lg"
          >
            <MessageCircle size={18} /> {t.hero.whatsapp}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
