"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { X, Upload, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  url: string;
  alt: string;
}

interface ImageUploaderProps {
  value?: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxFiles?: number;
  category?: string;
  className?: string;
}

export function ImageUploader({
  value = [],
  onChange,
  maxFiles = 10,
  category = "products",
  className,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Yükleme başarısız");
    }
    const data = await res.json();
    return { url: data.url, alt: file.name.replace(/\.[^.]+$/, "") };
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxFiles - value.length;
      const filesToUpload = acceptedFiles.slice(0, remaining);

      if (filesToUpload.length === 0) {
        toast.error(`En fazla ${maxFiles} görsel yükleyebilirsiniz.`);
        return;
      }

      setUploading(true);
      try {
        const results = await Promise.all(filesToUpload.map(uploadFile));
        const uploaded = results.filter(Boolean) as UploadedImage[];
        onChange([...value, ...uploaded]);
        toast.success(`${uploaded.length} görsel yüklendi.`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Yükleme hatası");
      } finally {
        setUploading(false);
      }
    },
    [value, maxFiles, onChange, category],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading || value.length >= maxFiles,
  });

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    const arr = [...value];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    onChange(arr);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Yüklü görseller */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {value.map((img, index) => (
            <div key={img.url} className="group relative aspect-square rounded-md overflow-hidden border border-taupe-400/30 bg-cream-100">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="120px"
              />
              <div className="absolute inset-0 bg-ink-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-1 bg-white/90 rounded text-ink-700 hover:bg-white transition-colors"
                    title="Sola taşı"
                  >
                    <GripVertical className="h-3 w-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1 bg-white/90 rounded text-red-600 hover:bg-white transition-colors"
                  title="Kaldır"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              {index === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-bronze/80 text-white py-0.5">
                  Ana görsel
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-bronze bg-bronze/5"
              : "border-taupe-400/50 hover:border-bronze/50 hover:bg-cream-100",
            (uploading || value.length >= maxFiles) && "opacity-50 cursor-not-allowed",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 text-ink-500">
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-bronze" />
                <p className="text-sm">Yükleniyor...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-taupe-400" />
                <p className="text-sm font-medium">
                  {isDragActive ? "Dosyaları bırakın" : "Görsel yüklemek için tıklayın veya sürükleyin"}
                </p>
                <p className="text-xs text-ink-300">
                  JPG, PNG, WebP — maks. 10MB — {value.length}/{maxFiles} görsel
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
