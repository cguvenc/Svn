import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Wrench } from "lucide-react";
import { useLang } from "../../i18n/LanguageContext";
import { useContent } from "../../context/ContentContext";
import { resolveImg } from "../../api";
import { SERVICE_ICONS } from "../../mock";

const ServicesSection = ({ limit }) => {
  const { t, lang } = useLang();
  const { services, settings } = useContent();
  const navigate = useNavigate();
  const items = limit ? services.slice(0, limit) : services;
  const tagline = (lang === "tr" ? settings.services_tagline_tr : settings.services_tagline_en) || t.services.tagline;
  const title = (lang === "tr" ? settings.services_title_tr : settings.services_title_en) || t.services.title;

  return (
    <section className="py-20 md:py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14 reveal">
          <p className="tagline mb-3">{tagline}</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-neutral-900">
            {title}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map((item, i) => {
            const Icon = SERVICE_ICONS[item.icon_key] || Wrench;
            const title = lang === "tr" ? item.title_tr : item.title_en || item.title_tr;
            const desc = lang === "tr" ? item.desc_tr : item.desc_en || item.desc_tr;
            return (
              <div
                key={item.id}
                className="svc-card reveal bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm cursor-pointer group"
                style={{ transitionDelay: `${i * 60}ms` }}
                onClick={() => navigate("/iletisim")}
              >
                <div className="relative h-52 overflow-hidden bg-neutral-200">
                  {item.image_url && (
                    <img
                      src={resolveImg(item.image_url)}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-11 h-11 rounded-xl bg-brand flex items-center justify-center shadow-lg">
                    <Icon size={22} className="text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-5 line-clamp-3">
                    {desc}
                  </p>
                  <span className="inline-flex items-center gap-2 text-brand font-semibold text-sm group-hover:gap-3 transition-all">
                    <span className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center">
                      <ArrowRight size={15} />
                    </span>
                    {t.services.detail}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
