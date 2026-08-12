import React, { useEffect, useState } from "react";
import { Mail, Phone, Trash2, Check, Inbox } from "lucide-react";
import api from "../../api";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../hooks/use-toast";

const RequestsTab = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/service-requests");
      setItems(res.data);
    } catch (e) {
      /* handled by interceptor */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await api.patch(`/service-requests/${id}`);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
    await api.delete(`/service-requests/${id}`);
    toast({ title: "Talep silindi" });
    load();
  };

  const fmt = (iso) => {
    try {
      return new Date(iso).toLocaleString("tr-TR");
    } catch {
      return iso;
    }
  };

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-neutral-900 mb-1">Servis Talepleri</h1>
      <p className="text-neutral-500 text-sm mb-6">İletişim formundan gelen talepler.</p>

      {loading ? (
        <p className="text-neutral-500">Yükleniyor...</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-neutral-400 border border-neutral-200">
          <Inbox size={40} className="mx-auto mb-3 opacity-50" />
          Henüz talep yok.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-xl p-5 border ${r.is_read ? "border-neutral-200" : "border-brand/50 shadow-sm"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-neutral-900">{r.name}</h3>
                    {!r.is_read && <Badge className="bg-brand text-white">Yeni</Badge>}
                  </div>
                  {r.subject && <p className="text-sm font-medium text-neutral-700 mb-1">{r.subject}</p>}
                  <p className="text-sm text-neutral-600 whitespace-pre-line">{r.message}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-neutral-500">
                    <a href={`tel:${r.phone}`} className="flex items-center gap-1.5 hover:text-brand">
                      <Phone size={14} /> {r.phone}
                    </a>
                    {r.email && (
                      <a href={`mailto:${r.email}`} className="flex items-center gap-1.5 hover:text-brand">
                        <Mail size={14} /> {r.email}
                      </a>
                    )}
                    <span>{fmt(r.created_at)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {!r.is_read && (
                    <Button size="sm" variant="outline" onClick={() => markRead(r.id)}>
                      <Check size={15} className="mr-1" /> Okundu
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => remove(r.id)}>
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsTab;
