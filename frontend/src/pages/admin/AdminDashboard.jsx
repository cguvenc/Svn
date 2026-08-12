import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Inbox, Wrench, Users, HelpCircle, Settings, LogOut, ExternalLink, KeyRound, Menu, X, Images, FileText } from "lucide-react";
import api from "../../api";
import Logo from "../../components/Logo";
import RequestsTab from "./RequestsTab";
import ServicesTab from "./ServicesTab";
import TeamTab from "./TeamTab";
import FaqsTab from "./FaqsTab";
import SettingsTab from "./SettingsTab";
import AccountTab from "./AccountTab";
import SlidesTab from "./SlidesTab";
import PagesTab from "./PagesTab";

const TABS = [
  { key: "requests", label: "Servis Talepleri", icon: Inbox },
  { key: "slides", label: "Ana Sayfa Slider", icon: Images },
  { key: "services", label: "Hizmetler", icon: Wrench },
  { key: "team", label: "Teknik Personel", icon: Users },
  { key: "pages", label: "Kurumsal Sayfalar", icon: FileText },
  { key: "faqs", label: "S.S.S", icon: HelpCircle },
  { key: "settings", label: "Site Ayarları", icon: Settings },
  { key: "account", label: "Hesap / Şifre", icon: KeyRound },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("requests");
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Yönetim Paneli - SVN Makina";
    api
      .get("/auth/me")
      .then(() => setReady(true))
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("svn_token");
    navigate("/admin/login");
  };

  const selectTab = (key) => {
    setTab(key);
    setMenuOpen(false);
  };

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-neutral-500">Yükleniyor...</div>;
  }

  const activeLabel = TABS.find((x) => x.key === tab)?.label;

  const Sidebar = (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="bg-brand inline-block rounded-lg px-3 py-2">
          <Logo variant="light" />
        </div>
        <button className="lg:hidden text-white" onClick={() => setMenuOpen(false)} aria-label="Kapat">
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {TABS.map((tItem) => (
          <button
            key={tItem.key}
            onClick={() => selectTab(tItem.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              tab === tItem.key ? "bg-brand text-white" : "text-neutral-300 hover:bg-white/5"
            }`}
          >
            <tItem.icon size={18} /> {tItem.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
        >
          <ExternalLink size={18} /> Siteyi Görüntüle
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
        >
          <LogOut size={18} /> Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-neutral-950 text-white flex-col fixed h-full z-30">
        {Sidebar}
      </aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-neutral-950 text-white">
            {Sidebar}
          </aside>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-20 bg-neutral-950 text-white flex items-center justify-between px-4 py-3">
        <button onClick={() => setMenuOpen(true)} aria-label="Menü">
          <Menu size={24} />
        </button>
        <span className="font-display font-semibold">{activeLabel}</span>
        <div className="w-6" />
      </div>

      {/* Content */}
      <main className="lg:ml-64 p-4 md:p-8">
        {tab === "requests" && <RequestsTab />}
        {tab === "slides" && <SlidesTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "team" && <TeamTab />}
        {tab === "pages" && <PagesTab />}
        {tab === "faqs" && <FaqsTab />}
        {tab === "settings" && <SettingsTab />}
        {tab === "account" && <AccountTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;
