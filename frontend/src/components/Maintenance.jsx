import React from "react";
import { Wrench } from "lucide-react";
import Logo from "./Logo";
import { useLang } from "../i18n/LanguageContext";
import { useContent } from "../context/ContentContext";

const Maintenance = () => {
  const { lang } = useLang();
  const { settings } = useContent();
  const msg =
    (lang === "tr" ? settings.maintenance_msg_tr : settings.maintenance_msg_en) ||
    "Sitemiz kısa süreliğine bakımdadır.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-center px-6">
      <div className="bg-brand rounded-xl px-4 py-3 mb-8">
        <Logo variant="light" />
      </div>
      <div className="w-20 h-20 rounded-full bg-brand/15 flex items-center justify-center mb-6">
        <Wrench size={38} className="text-brand" />
      </div>
      <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">
        {lang === "tr" ? "Bakım Çalışması" : "Under Maintenance"}
      </h1>
      <p className="text-neutral-400 max-w-md">{msg}</p>
      <div className="mt-8 flex flex-col items-center gap-1 text-sm text-neutral-500">
        {settings.phone && <a href={`tel:${settings.phone_raw}`} className="hover:text-brand">{settings.phone}</a>}
        {settings.email && <a href={`mailto:${settings.email}`} className="hover:text-brand">{settings.email}</a>}
      </div>
    </div>
  );
};

export default Maintenance;
