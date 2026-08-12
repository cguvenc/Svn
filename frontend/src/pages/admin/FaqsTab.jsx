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
import { useToast } from "../../hooks/use-toast";

const emptyItem = { order: 0, q_tr: "", q_en: "", a_tr: "", a_en: "" };

const FaqsTab = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem);

  const load = async () => setItems((await api.get("/faqs")).data);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...emptyItem, order: items.length + 1 }); setOpen(true); };
  const openEdit = (it) => { setEditing(it); setForm(it); setOpen(true); };

  const save = async () => {
    if (!form.q_tr) { toast({ title: "Soru (TR) zorunlu", variant: "destructive" }); return; }
    try {
      if (editing) await api.put(`/faqs/${editing.id}`, form);
      else await api.post("/faqs", form);
      toast({ title: "Kaydedildi" });
      setOpen(false); load();
    } catch { toast({ title: "Hata oluştu", variant: "destructive" }); }
  };

  const remove = async (id) => {
    if (!window.confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    await api.delete(`/faqs/${id}`); toast({ title: "Silindi" }); load();
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900">Sıkça Sorulan Sorular</h1>
          <p className="text-neutral-500 text-sm">S.S.S bölümündeki sorular.</p>
        </div>
        <Button onClick={openNew} className="bg-brand hover:bg-brand-dark text-white"><Plus size={18} className="mr-1" /> Yeni Soru</Button>
      </div>

      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-xl border border-neutral-200 p-5 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs text-brand font-bold">#{it.order}</span>
              <h3 className="font-semibold text-neutral-900">{it.q_tr}</h3>
              <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{it.a_tr}</p>
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
          <DialogHeader><DialogTitle>{editing ? "Soruyu Düzenle" : "Yeni Soru"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Sıra</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
            <div><Label>Soru (TR)</Label><Input value={form.q_tr} onChange={set("q_tr")} /></div>
            <div><Label>Soru (EN)</Label><Input value={form.q_en} onChange={set("q_en")} /></div>
            <div><Label>Cevap (TR)</Label><Textarea rows={3} value={form.a_tr} onChange={set("a_tr")} /></div>
            <div><Label>Cevap (EN)</Label><Textarea rows={3} value={form.a_en} onChange={set("a_en")} /></div>
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

export default FaqsTab;
