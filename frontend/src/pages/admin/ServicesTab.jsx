import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../../components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import ImageUpload from "../../components/ImageUpload";
import { resolveImg } from "../../api";
import { useToast } from "../../hooks/use-toast";

const ICON_OPTIONS = [
  { value: "technical", label: "Teknik Servis (anahtar)" },
  { value: "pricing", label: "Fiyatlar (gösterge)" },
  { value: "parts", label: "Yedek Parça (dişli)" },
  { value: "maintenance", label: "Bakım (kalkan)" },
  { value: "rental", label: "Kiralama (kamyon)" },
  { value: "sale", label: "Satış (sepet)" },
];

const emptyItem = {
  order: 0, icon_key: "technical", image_url: "",
  title_tr: "", title_en: "", desc_tr: "", desc_en: "",
};

const ServicesTab = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem);

  const load = async () => setItems((await api.get("/services")).data);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...emptyItem, order: items.length + 1 }); setOpen(true); };
  const openEdit = (it) => { setEditing(it); setForm(it); setOpen(true); };

  const save = async () => {
    if (!form.title_tr) { toast({ title: "Başlık (TR) zorunlu", variant: "destructive" }); return; }
    try {
      if (editing) await api.put(`/services/${editing.id}`, form);
      else await api.post("/services", form);
      toast({ title: "Kaydedildi" });
      setOpen(false); load();
    } catch { toast({ title: "Hata oluştu", variant: "destructive" }); }
  };

  const remove = async (id) => {
    if (!window.confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    await api.delete(`/services/${id}`); toast({ title: "Silindi" }); load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900">Hizmetler</h1>
          <p className="text-neutral-500 text-sm">Ana sayfada gösterilen hizmet kartları.</p>
        </div>
        <Button onClick={openNew} className="bg-brand hover:bg-brand-dark text-white"><Plus size={18} className="mr-1" /> Yeni Hizmet</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="h-32 bg-neutral-200 relative">
              {it.image_url && <img src={resolveImg(it.image_url)} alt="" className="w-full h-full object-cover" />}
              <span className="absolute top-2 left-2 bg-brand text-white text-xs px-2 py-0.5 rounded">#{it.order}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900">{it.title_tr}</h3>
              <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{it.desc_tr}</p>
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
          <DialogHeader><DialogTitle>{editing ? "Hizmeti Düzenle" : "Yeni Hizmet"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Sıra</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
              <div>
                <Label>İkon</Label>
                <Select value={form.icon_key} onValueChange={(v) => setForm({ ...form, icon_key: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ICON_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <ImageUpload label="Görsel" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
            <div><Label>Başlık (TR)</Label><Input value={form.title_tr} onChange={set("title_tr")} /></div>
            <div><Label>Başlık (EN)</Label><Input value={form.title_en} onChange={set("title_en")} /></div>
            <div><Label>Açıklama (TR)</Label><Textarea rows={3} value={form.desc_tr} onChange={set("desc_tr")} /></div>
            <div><Label>Açıklama (EN)</Label><Textarea rows={3} value={form.desc_en} onChange={set("desc_en")} /></div>
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

export default ServicesTab;
