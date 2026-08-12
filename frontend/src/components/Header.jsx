import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, Globe, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { useLang } from "../i18n/LanguageContext";
import { useContent } from "../context/ContentContext";
import { Button } from "./ui/button";

const Header = () => {
  const { t, lang, toggle } = useLang();
  const { settings, pages } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const menuPages = (pages || []).filter((p) => p.show_in_menu);
  const pageTitle = (p) => (lang === "tr" ? p.title_tr : p.title_en || p.title_tr);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/teknik-personel", label: t.nav.team },
    { to: "/hizmetler", label: t.nav.services },
    { to: "/sss", label: t.nav.faq },
    { to: "/iletisim", label: t.nav.contact },
  ];

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-brand py-3 ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        <Link to="/" aria-label="SVN Makina">
          <Logo variant="light" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
              isActive("/") ? "text-white bg-black/20" : "text-white/90 hover:text-white hover:bg-black/10"
            }`}
          >
            {t.nav.home}
          </Link>

          {/* Kurumsal dropdown */}
          <div className="relative group">
            <Link
              to="/kurumsal"
              className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                isActive("/kurumsal") || location.pathname.startsWith("/sayfa")
                  ? "text-white bg-black/20"
                  : "text-white/90 hover:text-white hover:bg-black/10"
              }`}
            >
              {t.nav.about} <ChevronDown size={15} />
            </Link>
            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white rounded-lg shadow-xl border border-neutral-100 py-2 min-w-[200px]">
                <Link to="/kurumsal" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-brand/5 hover:text-brand">
                  {t.nav.about}
                </Link>
                {menuPages.map((p) => (
                  <Link key={p.id} to={`/sayfa/${p.slug}`} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-brand/5 hover:text-brand">
                    {pageTitle(p)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                isActive(l.to) ? "text-white bg-black/20" : "text-white/90 hover:text-white hover:bg-black/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-white text-sm font-bold hover:bg-black/15 transition-colors"
            aria-label="Change language"
          >
            <Globe size={16} />
            {lang.toUpperCase()}
          </button>

          <Button
            onClick={() => navigate("/iletisim")}
            className="hidden md:inline-flex bg-neutral-900 hover:bg-black text-white font-semibold rounded-full px-5"
          >
            {t.nav.cta}
          </Button>

          <a
            href={`tel:${settings.phone_raw}`}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 text-white"
            aria-label="Call"
          >
            <Phone size={16} />
          </a>

          <button
            className="lg:hidden text-white p-1"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 px-3 ${
          open ? "max-h-[560px] pt-2 pb-3" : "max-h-0"
        }`}
      >
        <nav className="bg-white rounded-xl shadow-xl p-2 flex flex-col">
          <Link to="/" className={`px-4 py-3 rounded-lg text-sm font-semibold ${isActive("/") ? "bg-brand/10 text-brand" : "text-neutral-800 hover:bg-neutral-50"}`}>
            {t.nav.home}
          </Link>
          <Link to="/kurumsal" className={`px-4 py-3 rounded-lg text-sm font-semibold ${isActive("/kurumsal") ? "bg-brand/10 text-brand" : "text-neutral-800 hover:bg-neutral-50"}`}>
            {t.nav.about}
          </Link>
          {menuPages.map((p) => (
            <Link key={p.id} to={`/sayfa/${p.slug}`} className="px-4 py-2.5 pl-8 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50">
              — {pageTitle(p)}
            </Link>
          ))}
          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-3 rounded-lg text-sm font-semibold ${isActive(l.to) ? "bg-brand/10 text-brand" : "text-neutral-800 hover:bg-neutral-50"}`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/iletisim"
            className="mt-2 px-4 py-3 rounded-lg text-sm font-bold bg-brand text-white text-center"
          >
            {t.nav.cta}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
