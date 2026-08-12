import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { resolveImg } from "../api";
import { IMAGES } from "../mock";

// Reusable inner-page banner with breadcrumb.
const PageHero = ({ title, tagline, crumb }) => {
  const { settings } = useContent();
  const bg = resolveImg(settings.hero_image) || IMAGES.hero;
  return (
    <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
      <div className="absolute inset-0">
        <img src={bg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-neutral-950/85" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
        {tagline && <p className="tagline text-brand-light mb-3">{tagline}</p>}
        <h1 className="font-display font-extrabold text-white text-3xl md:text-5xl mb-4">
          {title}
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-neutral-300">
          <Link to="/" className="hover:text-brand-light transition-colors">
            Anasayfa / Home
          </Link>
          <ChevronRight size={16} />
          <span className="text-brand-light font-medium">{crumb || title}</span>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
