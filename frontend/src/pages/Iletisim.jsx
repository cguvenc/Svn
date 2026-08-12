import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import PageHero from "../components/PageHero";
import useScrollReveal from "../hooks/useScrollReveal";
import { useLang } from "../i18n/LanguageContext";
import { useContent } from "../context/ContentContext";
import api from "../api";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";

const empty = { name: "", phone: "", email: "", subject: "", message: "" };

const Iletisim = () => {
  const { t, lang } = useLang();
  const { settings } = useContent();
  const { toast } = useToast();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  useScrollReveal([lang]);

  useEffect(() => {
    document.title = `${t.pageTitles.contact} - ${settings.brand}`;
  }, [t, settings.brand]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/service-requests", form);
      setForm(empty);
      toast({ title: t.contact.success });
    } catch (err) {
      toast({ title: "Hata / Error", description: "Lütfen tekrar deneyin.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const info = [
    { icon: MapPin, title: t.contact.hq, value: settings.address_line },
    { icon: Phone, title: t.contact.phone, value: settings.phone, href: `tel:${settings.phone_raw}` },
    { icon: Mail, title: t.contact.email, value: settings.email, href: `mailto:${settings.email}` },
  ];

  return (
    <>
      <PageHero title={t.pageTitles.contact} tagline={t.contact.tagline} crumb={t.nav.contact} />

      <section className="py-20 md:py-28 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-10">
          {/* Info + map */}
          <div className="reveal space-y-4">
            {info.map((c, i) => (
              <div key={i} className="flex gap-4 bg-white p-5 rounded-xl border border-neutral-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center shrink-0">
                  <c.icon size={22} className="text-white" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-neutral-900">{c.title}</h4>
                  {c.href ? (
                    <a href={c.href} className="text-neutral-600 hover:text-brand text-sm">{c.value}</a>
                  ) : (
                    <p className="text-neutral-600 text-sm">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-xl overflow-hidden border border-neutral-100 shadow-sm h-64">
              <iframe
                title="map"
                className="w-full h-full"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.map_query || "Edirne")}&z=13&output=embed`}
              />
            </div>
          </div>

          {/* Form */}
          <div className="reveal bg-white p-7 md:p-9 rounded-2xl border border-neutral-100 shadow-sm">
            <h3 className="font-display font-bold text-2xl text-neutral-900 mb-1">
              {t.contact.formTitle}
            </h3>
            <p className="text-neutral-500 text-sm mb-6">{t.contact.formSubtitle}</p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input name="name" required placeholder={t.contact.fields.name} value={form.name} onChange={onChange} />
                <Input name="phone" required placeholder={t.contact.fields.phone} value={form.phone} onChange={onChange} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input name="email" type="email" placeholder={t.contact.fields.email} value={form.email} onChange={onChange} />
                <Input name="subject" placeholder={t.contact.fields.subject} value={form.subject} onChange={onChange} />
              </div>
              <Textarea name="message" required rows={5} placeholder={t.contact.fields.message} value={form.message} onChange={onChange} />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-brand hover:bg-brand-dark text-white font-semibold rounded-full py-6"
              >
                <Send size={18} className="mr-2" /> {t.contact.submit}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Iletisim;
