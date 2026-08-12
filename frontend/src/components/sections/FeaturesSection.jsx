import React from "react";
import { useLang } from "../../i18n/LanguageContext";
import { useContent } from "../../context/ContentContext";
import { FEATURE_ICONS } from "../../mock";

const FeaturesSection = () => {
  const { t, lang } = useLang();
  const { settings } = useContent();

  const cards = [
    {
      icon: FEATURE_ICONS.staff,
      title: (lang === "tr" ? settings.feature1_title_tr : settings.feature1_title_en) || t.features.staff.title,
      desc: (lang === "tr" ? settings.feature1_desc_tr : settings.feature1_desc_en) || t.features.staff.desc,
    },
    {
      icon: FEATURE_ICONS.satisfaction,
      title: (lang === "tr" ? settings.feature2_title_tr : settings.feature2_title_en) || t.features.satisfaction.title,
      desc: (lang === "tr" ? settings.feature2_desc_tr : settings.feature2_desc_en) || t.features.satisfaction.desc,
    },
    {
      icon: FEATURE_ICONS.fast,
      title: (lang === "tr" ? settings.feature3_title_tr : settings.feature3_title_en) || t.features.fast.title,
      desc: (lang === "tr" ? settings.feature3_desc_tr : settings.feature3_desc_en) || t.features.fast.desc,
    },
  ];

  return (
    <section className="bg-neutral-950 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid sm:grid-cols-3 gap-6">
        {cards.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="reveal flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/60 transition-colors"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-brand flex items-center justify-center shrink-0">
                <Icon size={26} className="text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-brand-light text-lg mb-1.5">
                  {item.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
