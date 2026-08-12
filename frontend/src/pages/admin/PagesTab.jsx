import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import api from "../../api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import ImageUpload from "../../components/ImageUpload";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../../components/ui/dialog";
import { useToast } from "../../hooks/use-toast";

const emptyItem = {
  order: 0, slug: "", title_tr: "", title_en: "",
  content_tr: "", content_en: "", image: "", show_in_menu: true,
};

const slugify = (s) =>
  s.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const PagesTab = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem);

  const load = async () => setItems((await api.get("/pages")).data);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...emptyItem, order: items.length + 1 }); setOpen(true); };
  const openEdit = (it) => { setEditing(it); setForm(it); setOpen(true); };

  const save = async () => {
    const payload = { ...form, slug: form.slug || slugify(form.title_tr) };
    if (!payload.title_tr || !payload.slug) { toast({ title: "Başlık (TR) zorunlu", variant: "destructive" }); return; }
    try {
      if (editing) await api.put(`/pages/${editing.id}`, payload);
      else await api.post("/pages", payload);
      toast({ title: "Kaydedildi. Sitede görmek için sayfayı yenileyin." });
      setOpen(false); load();
    } catch { toast({ title: "Hata oluştu", variant: "destructive" }); }
  };

  const remove = async (id) => {
    if (!window.confirm("Bu sayfayı silmek istediğinize emin misiniz?")) return;
    await api.delete(`/pages/${id}`); toast({ title: "Silindi" }); load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900">Kurumsal Sayfalar</h1>
          <p className="text-neutral-500 text-sm">Hakkımızda gibi özel sayfalar ekleyin (menüde "Kurumsal" altında görünür).</p>
        </div>
        <Button onClick={openNew} className="bg-brand hover:bg-brand-dark text-white"><Plus size={18} className="mr-1" /> Yeni Sayfa</Button>
      </div>

      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-xl border border-neutral-200 p-5 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs text-brand font-bold">#{it.order}</span>
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                {it.title_tr}
                <a href={`/sayfa/${it.slug}`} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-brand"><ExternalLink size={14} /></a>
              </h3>
              <p className="text-xs text-neutral-400">/sayfa/{it.slug} {it.show_in_menu ? "· menüde" : "· gizli"}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => openEdit(it)}><Pencil size={14} className="mr-1" /> Düzenle</Button>
              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => remove(it.id)}><Trash2 size={14} /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Sayfayı Düzenle" : "Yeni Sayfa"}</DialogTitle></DialogHeader>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Başlık (TR)</Label><Input value={form.title_tr} onChange={set("title_tr")} /></div>
            <div><Label>Başlık (EN)</Label><Input value={form.title_en} onChange={set("title_en")} /></div>
            <div><Label>URL (slug)</Label><Input value={form.slug} onChange={set("slug")} placeholder="otomatik" /></div>
            <div><Label>Sıra</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
            <ImageUpload label="Kapak Görseli (opsiyonel)" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
            <div className="sm:col-span-2"><Label>İçerik (TR)</Label><Textarea rows={6} value={form.content_tr} onChange={set("content_tr")} /></div>
            <div className="sm:col-span-2"><Label>İçerik (EN)</Label><Textarea rows={6} value={form.content_en} onChange={set("content_en")} /></div>
            <div className="flex items-center gap-2"><Switch checked={!!form.show_in_menu} onCheckedChange={(v) => setForm({ ...form, show_in_menu: v })} /><Label className="mb-0">Menüde göster</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
            <Button onClick={save} className="bg-brand hover:bg-brand-dark text-white">Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PagesTab;
