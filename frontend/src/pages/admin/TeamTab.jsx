import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../../components/ui/dialog";
import ImageUpload from "../../components/ImageUpload";
import { resolveImg } from "../../api";
import { useToast } from "../../hooks/use-toast";

const emptyItem = {
  order: 0, name: "", title_tr: "", title_en: "",
  phone: "", phone_raw: "", email: "", avatar: "",
};

const TeamTab = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem);

  const load = async () => setItems((await api.get("/team")).data);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...emptyItem, order: items.length + 1 }); setOpen(true); };
  const openEdit = (it) => { setEditing(it); setForm(it); setOpen(true); };

  const autoAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E30613&color=fff&size=320&bold=true&font-size=0.4`;

  const save = async () => {
    if (!form.name) { toast({ title: "İsim zorunlu", variant: "destructive" }); return; }
    const payload = { ...form, avatar: form.avatar || autoAvatar(form.name) };
    try {
      if (editing) await api.put(`/team/${editing.id}`, payload);
      else await api.post("/team", payload);
      toast({ title: "Kaydedildi" });
      setOpen(false); load();
    } catch { toast({ title: "Hata oluştu", variant: "destructive" }); }
  };

  const remove = async (id) => {
    if (!window.confirm("Bu personeli silmek istediğinize emin misiniz?")) return;
    await api.delete(`/team/${id}`); toast({ title: "Silindi" }); load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900">Teknik Personel</h1>
          <p className="text-neutral-500 text-sm">Teknik personel sayfasındaki ekip üyeleri.</p>
        </div>
        <Button onClick={openNew} className="bg-brand hover:bg-brand-dark text-white"><Plus size={18} className="mr-1" /> Yeni Personel</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-xl border border-neutral-200 p-5 text-center">
            <img src={resolveImg(it.avatar)} alt={it.name} className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-brand/20" />
            <h3 className="font-semibold text-neutral-900 mt-3">{it.name}</h3>
            <p className="text-brand text-sm font-medium">{it.title_tr}</p>
            <p className="text-xs text-neutral-500 mt-1">{it.phone}</p>
            <p className="text-xs text-neutral-500">{it.email}</p>
            <div className="flex gap-2 mt-3 justify-center">
              <Button size="sm" variant="outline" onClick={() => openEdit(it)}><Pencil size={14} className="mr-1" /> Düzenle</Button>
              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => remove(it.id)}><Trash2 size={14} /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Personeli Düzenle" : "Yeni Personel"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Sıra</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
              <div className="col-span-2"><Label>Ad Soyad</Label><Input value={form.name} onChange={set("name")} /></div>
            </div>
            <div><Label>Ünvan (TR)</Label><Input value={form.title_tr} onChange={set("title_tr")} /></div>
            <div><Label>Ünvan (EN)</Label><Input value={form.title_en} onChange={set("title_en")} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Telefon (görünen)</Label><Input value={form.phone} onChange={set("phone")} placeholder="+90 555 ..." /></div>
              <div><Label>Telefon (link)</Label><Input value={form.phone_raw} onChange={set("phone_raw")} placeholder="+90555..." /></div>
            </div>
            <div><Label>E-posta</Label><Input value={form.email} onChange={set("email")} /></div>
            <ImageUpload label="Fotoğraf (boş bırakılırsa isimden otomatik oluşturulur)" value={form.avatar} onChange={(url) => setForm({ ...form, avatar: url })} />
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

export default TeamTab;
