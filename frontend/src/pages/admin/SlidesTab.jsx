import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api, { resolveImg } from "../../api";
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
  order: 0, image: "", title_tr: "", title_en: "", subtitle_tr: "", subtitle_en: "",
  button_text_tr: "", button_text_en: "", button_link: "/iletisim", active: true,
};

const SlidesTab = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem);

  const load = async () => setItems((await api.get("/slides")).data);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...emptyItem, order: items.length + 1 }); setOpen(true); };
  const openEdit = (it) => { setEditing(it); setForm(it); setOpen(true); };

  const save = async () => {
    if (!form.image) { toast({ title: "Lütfen bir görsel yükleyin", variant: "destructive" }); return; }
    try {
      if (editing) await api.put(`/slides/${editing.id}`, form);
      else await api.post("/slides", form);
      toast({ title: "Kaydedildi" });
      setOpen(false); load();
    } catch { toast({ title: "Hata oluştu", variant: "destructive" }); }
  };

  const remove = async (id) => {
    if (!window.confirm("Bu slaytı silmek istediğinize emin misiniz?")) return;
    await api.delete(`/slides/${id}`); toast({ title: "Silindi" }); load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900">Ana Sayfa Slider</h1>
          <p className="text-neutral-500 text-sm">Ana sayfanın en üstünde dönen slaytlar.</p>
        </div>
        <Button onClick={openNew} className="bg-brand hover:bg-brand-dark text-white"><Plus size={18} className="mr-1" /> Yeni Slayt</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="h-36 bg-neutral-200 relative">
              {it.image && <img src={resolveImg(it.image)} alt="" className="w-full h-full object-cover" />}
              <span className="absolute top-2 left-2 bg-brand text-white text-xs px-2 py-0.5 rounded">#{it.order}</span>
              {!it.active && <span className="absolute top-2 right-2 bg-neutral-800 text-white text-xs px-2 py-0.5 rounded">Pasif</span>}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900">{it.title_tr}</h3>
              <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{it.subtitle_tr}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(it)}><Pencil size={14} className="mr-1" /> Düzenle</Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => remove(it.id)}><Trash2 size={14} /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Slaytı Düzenle" : "Yeni Slayt"}</DialogTitle></DialogHeader>
          <div className="grid sm:grid-cols-2 gap-3">
            <ImageUpload label="Slayt Görseli" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
            <div><Label>Sıra</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
            <div className="flex items-end gap-2 pb-1"><Switch checked={!!form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} /><Label className="mb-0">Aktif</Label></div>
            <div><Label>Başlık (TR)</Label><Input value={form.title_tr} onChange={set("title_tr")} /></div>
            <div><Label>Başlık (EN)</Label><Input value={form.title_en} onChange={set("title_en")} /></div>
            <div className="sm:col-span-2"><Label>Alt Metin (TR)</Label><Textarea rows={2} value={form.subtitle_tr} onChange={set("subtitle_tr")} /></div>
            <div className="sm:col-span-2"><Label>Alt Metin (EN)</Label><Textarea rows={2} value={form.subtitle_en} onChange={set("subtitle_en")} /></div>
            <div><Label>Buton Yazısı (TR)</Label><Input value={form.button_text_tr} onChange={set("button_text_tr")} /></div>
            <div><Label>Buton Yazısı (EN)</Label><Input value={form.button_text_en} onChange={set("button_text_en")} /></div>
            <div className="sm:col-span-2"><Label>Buton Linki</Label><Input value={form.button_link} onChange={set("button_link")} placeholder="/iletisim" /></div>
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

export default SlidesTab;
