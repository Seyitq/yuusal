"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
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
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  sku: z.string().min(3, "SKU en az 3 karakter olmalı").max(50),
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı").max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire kullanılabilir").optional().or(z.literal("")),
  shortDesc: z.string().max(300).optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Kategori seçiniz"),
  collectionId: z.string().optional(),
  composition: z.string().optional(),
  careInfo: z.string().optional(),
  dimensions: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  order: z.number().int(),
});

type FormValues = z.infer<typeof formSchema>;

interface Category { id: string; name: string; }
interface Collection { id: string; name: string; }

interface ProductFormProps {
  defaultValues?: Partial<FormValues>;
  images?: UploadedImage[];
  productId?: string;
  categories: Category[];
  collections: Collection[];
}

export function ProductForm({
  defaultValues,
  images: initialImages = [],
  productId,
  categories,
  collections,
}: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const isEditing = Boolean(productId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
      name: "",
      slug: "",
      shortDesc: "",
      description: "",
      categoryId: "",
      collectionId: "",
      composition: "",
      careInfo: "",
      dimensions: "",
      isActive: true,
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
      order: 0,
      ...defaultValues,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      slug: values.slug || undefined,
      collectionId: values.collectionId || null,
      images: images.map((img, i) => ({ ...img, order: i, isPrimary: i === 0 })),
    };

    const url = isEditing ? `/api/admin/products/${productId}` : "/api/admin/products";
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

    toast.success(isEditing ? "Ürün güncellendi." : "Ürün oluşturuldu.");
    router.push("/admin/urunler");
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Görseller */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-ink-900">Görseller</h2>
          <ImageUploader value={images} onChange={setImages} category="products" maxFiles={8} />
        </div>

        <Separator />

        {/* Temel Bilgiler */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink-900">Temel Bilgiler</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU *</FormLabel>
                  <FormControl><Input placeholder="YSL-001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Adı *</FormLabel>
                  <FormControl><Input placeholder="İpek Eşarp" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug <span className="text-ink-400 font-normal">(boş bırakılırsa otomatik oluşturulur)</span></FormLabel>
                <FormControl><Input placeholder="ipek-esarp" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortDesc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kısa Açıklama</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ürünü kısaca tanımlayın (maks. 300 karakter)" rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detaylı Açıklama</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ürün hakkında detaylı bilgi..." rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Kategori & Koleksiyon */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink-900">Sınıflandırma</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin">
                          {categories.find((c) => c.id === field.value)?.name ?? "Kategori seçin"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
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
              name="collectionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Koleksiyon</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Koleksiyon seçin (opsiyonel)">
                          {field.value
                            ? (collections.find((c) => c.id === field.value)?.name ?? "Koleksiyon seçin")
                            : "— Yok —"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">— Yok —</SelectItem>
                      {collections.map((col) => (
                        <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Ürün Detayları */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink-900">Ürün Detayları</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boyutlar</FormLabel>
                  <FormControl><Input placeholder="90x90 cm" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="composition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kumaş/Malzeme</FormLabel>
                  <FormControl><Input placeholder="%100 İpek" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="careInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bakım Talimatları</FormLabel>
                  <FormControl><Input placeholder="Kuru temizleme" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Durum & Sıralama */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink-900">Durum</h2>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* SEO */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink-900">SEO</h2>
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Başlık <span className="text-ink-400 font-normal">(maks. 70 karakter)</span></FormLabel>
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
                <FormLabel>Meta Açıklama <span className="text-ink-400 font-normal">(maks. 160 karakter)</span></FormLabel>
                <FormControl><Textarea rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-3 pt-4">
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
