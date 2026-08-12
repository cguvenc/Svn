import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import api from "../../api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import ImageUpload from "../../components/ImageUpload";
import { useToast } from "../../hooks/use-toast";

const Section = ({ title, desc, children }) => (
  <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-5">
    <h2 className="font-display font-semibold text-lg text-neutral-900">{title}</h2>
    {desc && <p className="text-sm text-neutral-500 mb-4">{desc}</p>}
    <div className={`grid sm:grid-cols-2 gap-4 ${desc ? "" : "mt-4"}`}>{children}</div>
  </div>
);

const Field = ({ label, k, form, setForm, full, textarea }) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <Label>{label}</Label>
    {textarea ? (
      <Textarea rows={3} value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
    ) : (
      <Input value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
    )}
  </div>
);

const ImageField = ({ label, k, form, setForm }) => (
  <div className="sm:col-span-2">
    <Label>{label}</Label>
    <div className="flex gap-3 items-start">
      <Input value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder="https://..." />
      {form[k] && <img src={form[k]} alt="" className="w-20 h-14 object-cover rounded border border-neutral-200" />}
    </div>
  </div>
);

const SettingsTab = () => {
  const { toast } = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/settings").then((r) => setForm(r.data));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        about_points_tr: typeof form.about_points_tr === "string"
          ? form.about_points_tr.split("\n").filter(Boolean) : form.about_points_tr,
        about_points_en: typeof form.about_points_en === "string"
          ? form.about_points_en.split("\n").filter(Boolean) : form.about_points_en,
      };
      await api.put("/settings", payload);
      toast({ title: "Ayarlar kaydedildi. Sitede görmek için sayfayı yenileyin." });
    } catch {
      toast({ title: "Hata oluştu", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <p className="text-neutral-500">Yükleniyor...</p>;

  const pointsTr = Array.isArray(form.about_points_tr) ? form.about_points_tr.join("\n") : form.about_points_tr;
  const pointsEn = Array.isArray(form.about_points_en) ? form.about_points_en.join("\n") : form.about_points_en;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900">Site Ayarları</h1>
          <p className="text-neutral-500 text-sm">Tüm metinler, görseller ve iletişim bilgileri.</p>
        </div>
        <Button onClick={save} disabled={saving} className="bg-brand hover:bg-brand-dark text-white">
          <Save size={18} className="mr-1" /> {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>

      {/* Maintenance */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-lg text-neutral-900">Bakım Modu</h2>
            <p className="text-sm text-neutral-500">Açıkken ziyaretçiler bakım sayfası görür (panel çalışmaya devam eder).</p>
          </div>
          <Switch checked={!!form.maintenance_mode} onCheckedChange={(v) => setForm({ ...form, maintenance_mode: v })} />
        </div>
        {form.maintenance_mode && (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Bakım Mesajı (TR)" k="maintenance_msg_tr" form={form} setForm={setForm} textarea />
            <Field label="Bakım Mesajı (EN)" k="maintenance_msg_en" form={form} setForm={setForm} textarea />
          </div>
        )}
      </div>

      <Section title="Genel & İletişim">
        <Field label="Marka Adı" k="brand" form={form} setForm={setForm} />
        <Field label="Telefon (görünen)" k="phone" form={form} setForm={setForm} />
        <Field label="Telefon (link, tel:)" k="phone_raw" form={form} setForm={setForm} />
        <Field label="WhatsApp (90555...)" k="whatsapp" form={form} setForm={setForm} />
        <Field label="E-posta" k="email" form={form} setForm={setForm} />
        <Field label="E-posta 2" k="email2" form={form} setForm={setForm} />
        <Field label="Adres" k="address_line" form={form} setForm={setForm} full />
        <Field label="Harita Arama (Google Maps)" k="map_query" form={form} setForm={setForm} full />
        <Field label="Instagram URL" k="instagram" form={form} setForm={setForm} />
        <Field label="Facebook URL" k="facebook" form={form} setForm={setForm} />
        <Field label="LinkedIn URL" k="linkedin" form={form} setForm={setForm} />
      </Section>

      <Section title="Görseller">
        <ImageUpload label="Hero (üst) Arka Plan Görseli" value={form.hero_image} onChange={(url) => setForm({ ...form, hero_image: url })} />
        <ImageUpload label="Hakkımızda Görseli" value={form.about_image} onChange={(url) => setForm({ ...form, about_image: url })} />
      </Section>

      <Section title="Ana Sayfa - Hero">
        <Field label="Üst Etiket (TR)" k="hero_tagline_tr" form={form} setForm={setForm} />
        <Field label="Üst Etiket (EN)" k="hero_tagline_en" form={form} setForm={setForm} />
        <Field label="Başlık (TR)" k="hero_title_tr" form={form} setForm={setForm} />
        <Field label="Başlık (EN)" k="hero_title_en" form={form} setForm={setForm} />
        <Field label="Alt Metin (TR)" k="hero_subtitle_tr" form={form} setForm={setForm} full textarea />
        <Field label="Alt Metin (EN)" k="hero_subtitle_en" form={form} setForm={setForm} full textarea />
      </Section>

      <Section title="Hakkımızda">
        <Field label="Üst Etiket (TR)" k="about_tagline_tr" form={form} setForm={setForm} />
        <Field label="Üst Etiket (EN)" k="about_tagline_en" form={form} setForm={setForm} />
        <Field label="Başlık (TR)" k="about_title_tr" form={form} setForm={setForm} />
        <Field label="Başlık (EN)" k="about_title_en" form={form} setForm={setForm} />
        <Field label="Paragraf 1 (TR)" k="about_p1_tr" form={form} setForm={setForm} full textarea />
        <Field label="Paragraf 1 (EN)" k="about_p1_en" form={form} setForm={setForm} full textarea />
        <Field label="Paragraf 2 (TR)" k="about_p2_tr" form={form} setForm={setForm} full textarea />
        <Field label="Paragraf 2 (EN)" k="about_p2_en" form={form} setForm={setForm} full textarea />
        <div className="sm:col-span-2">
          <Label>Maddeler (TR) — her satır bir madde</Label>
          <Textarea rows={5} value={pointsTr || ""} onChange={(e) => setForm({ ...form, about_points_tr: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <Label>Maddeler (EN) — one item per line</Label>
          <Textarea rows={5} value={pointsEn || ""} onChange={(e) => setForm({ ...form, about_points_en: e.target.value })} />
        </div>
      </Section>

      <Section title="Bölüm Başlıkları (Hizmetler & S.S.S)">
        <Field label="Hizmetler Etiketi (TR)" k="services_tagline_tr" form={form} setForm={setForm} />
        <Field label="Hizmetler Etiketi (EN)" k="services_tagline_en" form={form} setForm={setForm} />
        <Field label="Hizmetler Başlığı (TR)" k="services_title_tr" form={form} setForm={setForm} />
        <Field label="Hizmetler Başlığı (EN)" k="services_title_en" form={form} setForm={setForm} />
        <Field label="S.S.S Etiketi (TR)" k="faq_tagline_tr" form={form} setForm={setForm} />
        <Field label="S.S.S Etiketi (EN)" k="faq_tagline_en" form={form} setForm={setForm} />
        <Field label="S.S.S Başlığı (TR)" k="faq_title_tr" form={form} setForm={setForm} />
        <Field label="S.S.S Başlığı (EN)" k="faq_title_en" form={form} setForm={setForm} />
      </Section>

      <Section title="Özellik Kartları (3 adet)">
        <Field label="1. Kart Başlık (TR)" k="feature1_title_tr" form={form} setForm={setForm} />
        <Field label="1. Kart Başlık (EN)" k="feature1_title_en" form={form} setForm={setForm} />
        <Field label="1. Kart Açıklama (TR)" k="feature1_desc_tr" form={form} setForm={setForm} full textarea />
        <Field label="1. Kart Açıklama (EN)" k="feature1_desc_en" form={form} setForm={setForm} full textarea />
        <Field label="2. Kart Başlık (TR)" k="feature2_title_tr" form={form} setForm={setForm} />
        <Field label="2. Kart Başlık (EN)" k="feature2_title_en" form={form} setForm={setForm} />
        <Field label="2. Kart Açıklama (TR)" k="feature2_desc_tr" form={form} setForm={setForm} full textarea />
        <Field label="2. Kart Açıklama (EN)" k="feature2_desc_en" form={form} setForm={setForm} full textarea />
        <Field label="3. Kart Başlık (TR)" k="feature3_title_tr" form={form} setForm={setForm} />
        <Field label="3. Kart Başlık (EN)" k="feature3_title_en" form={form} setForm={setForm} />
        <Field label="3. Kart Açıklama (TR)" k="feature3_desc_tr" form={form} setForm={setForm} full textarea />
        <Field label="3. Kart Açıklama (EN)" k="feature3_desc_en" form={form} setForm={setForm} full textarea />
      </Section>

      <Section title="Footer">
        <Field label="Footer Açıklama (TR)" k="footer_about_tr" form={form} setForm={setForm} full textarea />
        <Field label="Footer Açıklama (EN)" k="footer_about_en" form={form} setForm={setForm} full textarea />
      </Section>
    </div>
  );
};

export default SettingsTab;
