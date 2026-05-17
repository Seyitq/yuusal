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

const formSchema = z.object({
  name: z.string().min(2, "Koleksiyon adı en az 2 karakter olmalı").max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire").optional().or(z.literal("")),
  description: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface CollectionFormProps {
  defaultValues?: Partial<FormValues>;
  collectionId?: string;
}

export function CollectionForm({ defaultValues, collectionId }: CollectionFormProps) {
  const router = useRouter();
  const isEditing = Boolean(collectionId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      metaTitle: "",
      metaDescription: "",
      isActive: true,
      isFeatured: false,
      ...defaultValues,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload = { ...values, slug: values.slug || undefined };

    const url = isEditing
      ? `/api/admin/collections/${collectionId}`
      : "/api/admin/collections";
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

    toast.success(isEditing ? "Koleksiyon güncellendi." : "Koleksiyon oluşturuldu.");
    router.push("/admin/koleksiyonlar");
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Koleksiyon Adı *</FormLabel>
                <FormControl><Input placeholder="İpek Serisi" {...field} /></FormControl>
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
                <FormControl><Input placeholder="ipek-serisi" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl><Textarea rows={3} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="flex flex-wrap gap-6">
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
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">Öne Çıkan</FormLabel>
              </FormItem>
            )}
          />
        </div>

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
