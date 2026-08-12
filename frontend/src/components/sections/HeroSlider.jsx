import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Phone, MessageCircle } from "lucide-react";
import { useLang } from "../../i18n/LanguageContext";
import { useContent } from "../../context/ContentContext";
import { resolveImg } from "../../api";

const HeroSlider = () => {
  const { t, lang } = useLang();
  const { slides, settings } = useContent();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const count = slides.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [count, next]);

  if (count === 0) return null;

  return (
    <section className="relative h-[92vh] min-h-[560px] overflow-hidden">
      {slides.map((s, i) => {
        const title = (lang === "tr" ? s.title_tr : s.title_en) || s.title_tr;
        const subtitle = (lang === "tr" ? s.subtitle_tr : s.subtitle_en) || s.subtitle_tr;
        const btn = (lang === "tr" ? s.button_text_tr : s.button_text_en) || s.button_text_tr;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <img src={resolveImg(s.image)} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/85 via-neutral-950/70 to-neutral-950/90" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-4xl mx-auto px-6 text-center w-full">
                <div className={`transition-all duration-700 ${i === index ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
                  <h1 className="font-display font-extrabold text-white text-4xl md:text-6xl leading-tight mb-6">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-neutral-200 text-base md:text-lg max-w-2xl mx-auto mb-9 leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 justify-center">
                    {btn && (
                      <button
                        onClick={() => navigate(s.button_link || "/iletisim")}
                        className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-7 py-3.5 rounded-full transition-colors shadow-lg shadow-brand/30"
                      >
                        <Phone size={18} /> {btn}
                      </button>
                    )}
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
              </div>
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-brand text-white flex items-center justify-center backdrop-blur transition-colors"
            aria-label="Önceki"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-brand text-white flex items-center justify-center backdrop-blur transition-colors"
            aria-label="Sonraki"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-brand" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSlider;
