"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const formSchema = z.object({
  title: z.string().max(200).optional().or(z.literal("")),
  subtitle: z.string().max(500).optional().or(z.literal("")),
  ctaText: z.string().max(100).optional().or(z.literal("")),
  ctaLink: z.string().optional().or(z.literal("")),
  desktopImage: z.string().min(1, "Masaüstü görsel zorunludur"),
  mobileImage: z.string().optional().or(z.literal("")),
  order: z.number().int(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface SlideFormProps {
  defaultValues?: Partial<FormValues>;
  slideId?: string;
}

function ImageField({ label, name, value, onChange, required }: {
  label: string;
  name: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", "slides");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json() as { url: string };
      onChange(data.url);
    } else {
      toast.error("Görsel yüklenemedi");
    }
    setUploading(false);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: MAX_SIZE,
    multiple: false,
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-ink-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {value ? (
        <div className="relative rounded-md overflow-hidden border border-taupe-400/30 bg-cream-100">
          <Image src={value} alt={label} width={800} height={400} className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
          >×</button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-bronze bg-bronze/5" : "border-taupe-400/40 hover:border-bronze/50"
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-ink-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Yükleniyor...
            </div>
          ) : (
            <p className="text-sm text-ink-400">{isDragActive ? "Bırakın..." : "Görsel sürükleyin veya tıklayın"}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function SlideForm({ defaultValues, slideId }: SlideFormProps) {
  const router = useRouter();
  const isEditing = Boolean(slideId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      ctaText: "",
      ctaLink: "",
      desktopImage: "",
      mobileImage: "",
      order: 0,
      isActive: true,
      ...defaultValues,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const url = isEditing ? `/api/admin/slides/${slideId}` : "/api/admin/slides";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "İşlem başarısız");
      return;
    }

    toast.success(isEditing ? "Slayt güncellendi." : "Slayt oluşturuldu.");
    router.push("/admin/slider");
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="desktopImage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageField
                  label="Masaüstü Görsel"
                  name="desktopImage"
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobileImage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageField
                  label="Mobil Görsel (opsiyonel)"
                  name="mobileImage"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Başlık</FormLabel>
                <FormControl><Input placeholder="Yeni Koleksiyon" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alt Başlık</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ctaText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buton Metni</FormLabel>
                <FormControl><Input placeholder="Keşfet" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ctaLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buton Linki</FormLabel>
                <FormControl><Input placeholder="/koleksiyon/yeni" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sıra</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="!mt-0 cursor-pointer">Aktif</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting} className="min-w-[120px]">
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Güncelle" : "Oluştur"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={form.formState.isSubmitting}>
            İptal
          </Button>
        </div>
      </form>
    </Form>
  );
}
