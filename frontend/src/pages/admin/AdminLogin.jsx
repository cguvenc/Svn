import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, LogIn } from "lucide-react";
import api from "../../api";
import Logo from "../../components/Logo";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin Giriş - SVN Makina";
    if (localStorage.getItem("svn_token")) {
      api.get("/auth/me").then(() => navigate("/admin")).catch(() => {});
    }
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("svn_token", res.data.access_token);
      navigate("/admin");
    } catch (err) {
      toast({ title: "Giriş başarısız", description: "Kullanıcı adı veya şifre hatalı.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-brand rounded-xl px-4 py-3">
            <Logo variant="light" />
          </div>
        </div>
        <h1 className="text-center font-display font-bold text-2xl text-neutral-900 mb-1">
          Yönetim Paneli
        </h1>
        <p className="text-center text-neutral-500 text-sm mb-7">Devam etmek için giriş yapın</p>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <User size={18} className="absolute left-3 top-3 text-neutral-400" />
            <Input
              className="pl-10"
              placeholder="Kullanıcı adı"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-neutral-400" />
            <Input
              className="pl-10"
              type="password"
              placeholder="Şifre"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-6 rounded-lg">
            <LogIn size={18} className="mr-2" /> {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
