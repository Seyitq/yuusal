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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import dynamic from "next/dynamic";

// ImageUploader client-only
const ImageUploader = dynamic(
  () => import("@/components/admin/image-uploader").then((m) => m.ImageUploader),
  { ssr: false }
);

const formSchema = z.object({
  title: z.string().min(2, "Başlık en az 2 karakter olmalı").max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire").optional().or(z.literal("")),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  content: z.string().min(1, "İçerik zorunludur"),
  coverImage: z.string().optional().or(z.literal("")),
  isPublished: z.boolean(),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  defaultValues?: Partial<FormValues>;
  postId?: string;
}

export function BlogForm({ defaultValues, postId }: BlogFormProps) {
  const router = useRouter();
  const isEditing = Boolean(postId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      isPublished: false,
      metaTitle: "",
      metaDescription: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      slug: values.slug || undefined,
      tags: [],
    };

    const url = isEditing ? `/api/admin/blog/${postId}` : "/api/admin/blog";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "İşlem başarısız");
      return;
    }

    toast.success(isEditing ? "Yazı güncellendi." : "Yazı oluşturuldu.");
    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Kapak görseli */}
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapak Görseli</FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value ? [{ url: field.value, alt: form.watch("title") || "" }] : []}
                  onChange={(imgs) => field.onChange(imgs[0]?.url ?? "")}
                  maxFiles={1}
                  category="blog"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Başlık *</FormLabel>
                <FormControl><Input placeholder="Yazı başlığı" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug <span className="text-ink-400 font-normal">(opsiyonel)</span></FormLabel>
                <FormControl><Input placeholder="yazi-basligi" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 pt-6">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">Yayında</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Özet</FormLabel>
              <FormControl><Textarea rows={2} placeholder="Kısa açıklama..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İçerik *</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Yazı içeriğini buraya girin..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink-900">SEO</h2>
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Başlık</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Açıklama</FormLabel>
                <FormControl><Textarea rows={2} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
