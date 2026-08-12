import React, { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import api, { resolveImg } from "../api";
import { Label } from "./ui/label";
import { useToast } from "../hooks/use-toast";

// Reusable image uploader for admin. value = stored url; onChange(url).
const ImageUpload = ({ label, value, onChange }) => {
  const inputRef = useRef(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(res.data.url);
      toast({ title: "Resim yüklendi" });
    } catch (err) {
      toast({ title: "Yükleme başarısız", description: "Sadece resim dosyaları (jpg, png, webp).", variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="sm:col-span-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-4 mt-1">
        <div className="w-28 h-20 rounded-lg border border-neutral-200 bg-neutral-100 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <img src={resolveImg(value)} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-neutral-400">Resim yok</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium disabled:opacity-60"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Yükleniyor..." : "Resim Yükle"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
            >
              <X size={13} /> Kaldır
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
