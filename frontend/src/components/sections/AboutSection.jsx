import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useLang } from "../../i18n/LanguageContext";
import { useContent } from "../../context/ContentContext";
import { resolveImg } from "../../api";
import { IMAGES } from "../../mock";

const AboutSection = () => {
  const { t, lang } = useLang();
  const { settings } = useContent();
  const p1 = (lang === "tr" ? settings.about_p1_tr : settings.about_p1_en) || t.about.p1;
  const p2 = (lang === "tr" ? settings.about_p2_tr : settings.about_p2_en) || t.about.p2;
  const tagline = (lang === "tr" ? settings.about_tagline_tr : settings.about_tagline_en) || t.about.tagline;
  const title = (lang === "tr" ? settings.about_title_tr : settings.about_title_en) || t.about.title;
  const aboutImg = resolveImg(settings.about_image) || IMAGES.about;
  const points = ((lang === "tr" ? settings.about_points_tr : settings.about_points_en) || []);
  const list = points.length ? points : t.about.points;
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="reveal">
          <p className="tagline mb-3">{tagline}</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-neutral-900 mb-6">
            {title}
          </h2>
          <p className="text-neutral-600 leading-relaxed mb-4">{p1}</p>
          <p className="text-neutral-600 leading-relaxed mb-7">{p2}</p>
          <ul className="space-y-3">
            {list.map((p, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-brand shrink-0" />
                <span className="text-neutral-800 font-medium">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal relative">
          <div className="absolute -inset-2 bg-brand/10 rounded-3xl rotate-2" />
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={aboutImg}
              alt="SVN Makina teleskopik yükleyici"
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
