import React, { useEffect } from "react";
import { Phone, Mail } from "lucide-react";
import PageHero from "../components/PageHero";
import useScrollReveal from "../hooks/useScrollReveal";
import { useLang } from "../i18n/LanguageContext";
import { useContent } from "../context/ContentContext";
import { resolveImg } from "../api";
import { COMPANY } from "../mock";

const TeknikPersonel = () => {
  const { t, lang } = useLang();
  const { team, loading } = useContent();
  useScrollReveal([lang, loading, team.length]);

  useEffect(() => {
    document.title = `${t.pageTitles.team} - ${COMPANY.brand}`;
  }, [t]);

  return (
    <>
      <PageHero title={t.pageTitles.team} tagline={t.team.tagline} crumb={t.nav.team} />

      <section className="py-20 md:py-28 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 reveal">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-neutral-900 mb-4">
              {t.team.title}
            </h2>
            <p className="text-neutral-600 leading-relaxed">{t.team.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((m, i) => (
              <div
                key={m.id}
                className="svc-card reveal bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative bg-gradient-to-b from-neutral-100 to-white pt-8 flex justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-brand/20 shadow-lg">
                    <img src={resolveImg(m.avatar)} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-display font-bold text-xl text-neutral-900">{m.name}</h3>
                  <p className="text-brand font-semibold text-sm mt-1 mb-5">
                    {lang === "tr" ? m.title_tr : m.title_en || m.title_tr}
                  </p>

                  <div className="space-y-2.5 text-sm">
                    <a
                      href={`tel:${m.phone_raw}`}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-brand hover:bg-brand-dark text-white font-semibold transition-colors"
                    >
                      <Phone size={16} /> {m.phone}
                    </a>
                    <a
                      href={`mailto:${m.email}`}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white font-semibold transition-colors"
                    >
                      <Mail size={16} /> {t.team.mailBtn}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TeknikPersonel;
