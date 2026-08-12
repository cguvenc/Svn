import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import useScrollReveal from "../hooks/useScrollReveal";
import { useLang } from "../i18n/LanguageContext";
import { useContent } from "../context/ContentContext";
import { resolveImg } from "../api";

const PageView = () => {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const { pages, settings, loading } = useContent();
  useScrollReveal([lang, loading, slug]);

  const page = pages.find((p) => p.slug === slug);

  useEffect(() => {
    if (page) {
      document.title = `${lang === "tr" ? page.title_tr : page.title_en || page.title_tr} - ${settings.brand}`;
    }
  }, [page, lang, settings.brand]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-neutral-400 pt-24">Yükleniyor...</div>;
  }

  if (!page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-24">
        <h1 className="font-display font-bold text-3xl text-neutral-900 mb-2">404</h1>
        <p className="text-neutral-500">{lang === "tr" ? "Sayfa bulunamadı." : "Page not found."}</p>
      </div>
    );
  }

  const title = lang === "tr" ? page.title_tr : page.title_en || page.title_tr;
  const content = lang === "tr" ? page.content_tr : page.content_en || page.content_tr;

  return (
    <>
      <PageHero title={title} crumb={title} />
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {page.image && (
            <div className="reveal rounded-2xl overflow-hidden shadow-lg mb-10">
              <img src={resolveImg(page.image)} alt={title} className="w-full h-[320px] object-cover" />
            </div>
          )}
          <div className="reveal prose max-w-none">
            {(content || "").split("\n").map((para, i) =>
              para.trim() ? (
                <p key={i} className="text-neutral-600 leading-relaxed mb-4">{para}</p>
              ) : null
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PageView;
