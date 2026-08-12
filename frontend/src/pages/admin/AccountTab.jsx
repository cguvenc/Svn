import React, { useEffect, useState } from "react";
import { Save, Plus, Trash2, User } from "lucide-react";
import api from "../../api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";

const AccountTab = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  const [me, setMe] = useState("");
  const [admins, setAdmins] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "" });

  const loadAdmins = async () => {
    try {
      const [meRes, list] = await Promise.all([api.get("/auth/me"), api.get("/admins")]);
      setMe(meRes.data.username);
      setAdmins(list.data);
    } catch { /* interceptor handles */ }
  };
  useEffect(() => { loadAdmins(); }, []);

  const savePassword = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm) {
      toast({ title: "Yeni şifreler eşleşmiyor", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await api.post("/auth/change-password", {
        current_password: form.current_password,
        new_password: form.new_password,
      });
      toast({ title: "Şifre başarıyla değiştirildi" });
      setForm({ current_password: "", new_password: "", confirm: "" });
    } catch (err) {
      toast({ title: err?.response?.data?.detail || "Bir hata oluştu", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admins", newUser);
      toast({ title: "Kullanıcı eklendi" });
      setNewUser({ username: "", password: "" });
      loadAdmins();
    } catch (err) {
      toast({ title: err?.response?.data?.detail || "Eklenemedi", variant: "destructive" });
    }
  };

  const removeUser = async (username) => {
    if (!window.confirm(`${username} kullanıcısını silmek istiyor musunuz?`)) return;
    try {
      await api.delete(`/admins/${username}`);
      toast({ title: "Kullanıcı silindi" });
      loadAdmins();
    } catch (err) {
      toast({ title: err?.response?.data?.detail || "Silinemedi", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-neutral-900 mb-1">Hesap / Şifre</h1>
        <p className="text-neutral-500 text-sm">Şifrenizi değiştirin ve yönetici hesaplarını yönetin.</p>
      </div>

      {/* Password change */}
      <form onSubmit={savePassword} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900">Şifre Değiştir</h2>
        <div>
          <Label>Mevcut Şifre</Label>
          <Input type="password" value={form.current_password} onChange={(e) => setForm({ ...form, current_password: e.target.value })} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Yeni Şifre</Label>
            <Input type="password" value={form.new_password} onChange={(e) => setForm({ ...form, new_password: e.target.value })} required />
          </div>
          <div>
            <Label>Yeni Şifre (Tekrar)</Label>
            <Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
          </div>
        </div>
        <Button type="submit" disabled={saving} className="bg-brand hover:bg-brand-dark text-white">
          <Save size={18} className="mr-1" /> {saving ? "Kaydediliyor..." : "Şifreyi Değiştir"}
        </Button>
      </form>

      {/* User management */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900">Yönetici Hesapları</h2>
        <div className="space-y-2">
          {admins.map((a) => (
            <div key={a.username} className="flex items-center justify-between bg-neutral-50 rounded-lg px-4 py-2.5">
              <span className="flex items-center gap-2 text-neutral-800 font-medium">
                <User size={16} className="text-brand" /> {a.username}
                {a.username === me && <span className="text-xs text-neutral-400">(siz)</span>}
              </span>
              {a.username !== me && (
                <button onClick={() => removeUser(a.username)} className="text-red-600 hover:bg-red-50 rounded p-1.5">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={addUser} className="grid sm:grid-cols-3 gap-3 items-end border-t border-neutral-100 pt-4">
          <div>
            <Label>Yeni Kullanıcı Adı</Label>
            <Input value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
          </div>
          <div>
            <Label>Şifre</Label>
            <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
          </div>
          <Button type="submit" className="bg-neutral-900 hover:bg-black text-white">
            <Plus size={18} className="mr-1" /> Ekle
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AccountTab;
