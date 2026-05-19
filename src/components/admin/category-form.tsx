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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";

const formSchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalı").max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire").optional().or(z.literal("")),
  description: z.string().optional(),
  parentId: z.string().optional(),
  imageUrl: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  order: z.number().int(),
  isActive: z.boolean(),
  showInMenu: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface Category { id: string; name: string; }

interface CategoryFormProps {
  defaultValues?: Partial<FormValues>;
  categoryId?: string;
  parentCategories: Category[];
}

export function CategoryForm({ defaultValues, categoryId, parentCategories }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = Boolean(categoryId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: "",
      imageUrl: "",
      metaTitle: "",
      metaDescription: "",
      order: 0,
      isActive: true,
      showInMenu: true,
      ...defaultValues,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      slug: values.slug || undefined,
      parentId: values.parentId || null,
      imageUrl: values.imageUrl || null,
    };

    const url = isEditing
      ? `/api/admin/categories/${categoryId}`
      : "/api/admin/categories";
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

    toast.success(isEditing ? "Kategori güncellendi." : "Kategori oluşturuldu.");
    router.push("/admin/kategoriler");
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
                <FormLabel>Kategori Adı *</FormLabel>
                <FormControl><Input placeholder="Eşarplar" {...field} /></FormControl>
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
                <FormControl><Input placeholder="esarplar" {...field} /></FormControl>
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

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Üst Kategori <span className="text-ink-400 font-normal">(opsiyonel)</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Ana kategori">
                      {field.value
                        ? (parentCategories.find((c) => c.id === field.value)?.name ?? "Ana kategori")
                        : "— Ana Kategori —"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">— Ana Kategori —</SelectItem>
                  {parentCategories
                    .filter((c) => c.id !== categoryId)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Görseli</FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value ? [{ url: field.value, alt: form.getValues("name") }] : []}
                  onChange={(imgs) => field.onChange(imgs[0]?.url ?? "")}
                  maxFiles={1}
                  category="categories"
                />
              </FormControl>
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
            name="showInMenu"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">Menüde Göster</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormLabel className="!mt-0 whitespace-nowrap">Sıra:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-20"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
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
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          >
            İptal
          </Button>
        </div>
      </form>
    </Form>
  );
}
