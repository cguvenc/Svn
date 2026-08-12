import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";
import Logo from "./Logo";
import { useLang } from "../i18n/LanguageContext";
import { useContent } from "../context/ContentContext";

const Footer = () => {
  const { t, lang } = useLang();
  const { settings } = useContent();
  const footerAbout = (lang === "tr" ? settings.footer_about_tr : settings.footer_about_en) || t.footer.about;

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/kurumsal", label: t.nav.about },
    { to: "/teknik-personel", label: t.nav.team },
    { to: "/hizmetler", label: t.nav.services },
    { to: "/sss", label: t.nav.faq },
    { to: "/iletisim", label: t.nav.contact },
  ];

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="bg-white/5 inline-block rounded-lg px-3 py-2">
            <Logo variant="light" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">{footerAbout}</p>
          <div className="flex gap-2 mt-4">
            {[
              { icon: Instagram, url: settings.instagram },
              { icon: Facebook, url: settings.facebook },
              { icon: Linkedin, url: settings.linkedin },
            ].map((s, i) => (
              <a
                key={i}
                href={s.url}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand flex items-center justify-center transition-colors"
                aria-label="social"
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold mb-4">{t.footer.quickLinks}</h4>
          <ul className="space-y-2.5 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-neutral-400 hover:text-brand transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-white font-display font-semibold mb-4">{t.footer.contact}</h4>
          <ul className="space-y-3.5 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} className="text-brand shrink-0 mt-0.5" />
              <span className="text-neutral-400">{settings.address_line}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="text-brand shrink-0 mt-0.5" />
              <a href={`tel:${settings.phone_raw}`} className="text-neutral-400 hover:text-brand">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-brand shrink-0 mt-0.5" />
              <a href={`mailto:${settings.email}`} className="text-neutral-400 hover:text-brand">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} {settings.brand}. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
