import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { ContentProvider, useContent } from "./context/ContentContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import Maintenance from "./components/Maintenance";
import { Toaster } from "./components/ui/toaster";
import Home from "./pages/Home";
import Kurumsal from "./pages/Kurumsal";
import TeknikPersonel from "./pages/TeknikPersonel";
import Hizmetler from "./pages/Hizmetler";
import SSS from "./pages/SSS";
import Iletisim from "./pages/Iletisim";
import PageView from "./pages/PageView";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PublicLayout = ({ children }) => {
  const { settings, loading } = useContent();
  if (!loading && settings.maintenance_mode) {
    return <Maintenance />;
  }
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <ContentProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Admin (no public chrome) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Public */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/kurumsal" element={<PublicLayout><Kurumsal /></PublicLayout>} />
              <Route path="/teknik-personel" element={<PublicLayout><TeknikPersonel /></PublicLayout>} />
              <Route path="/hizmetler" element={<PublicLayout><Hizmetler /></PublicLayout>} />
              <Route path="/sss" element={<PublicLayout><SSS /></PublicLayout>} />
              <Route path="/iletisim" element={<PublicLayout><Iletisim /></PublicLayout>} />
              <Route path="/sayfa/:slug" element={<PublicLayout><PageView /></PublicLayout>} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </ContentProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;
