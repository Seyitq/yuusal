"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Bir hata oluştu");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mesaj gönderilemedi.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="font-serif text-2xl text-ink-900 mb-3">Teşekkürler</p>
        <p className="font-sans text-sm text-ink-500">
          Mesajınız alındı. En kısa sürede dönüş yapacağız.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-sans text-xs uppercase tracking-widest text-ink-500 mb-2">
          Adınız *
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full border border-cream-300 bg-cream-50 px-4 py-3 font-sans text-sm text-ink-900 focus:outline-none focus:border-ink-700 transition-colors"
        />
      </div>
      <div>
        <label className="block font-sans text-xs uppercase tracking-widest text-ink-500 mb-2">
          E-posta *
        </label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full border border-cream-300 bg-cream-50 px-4 py-3 font-sans text-sm text-ink-900 focus:outline-none focus:border-ink-700 transition-colors"
        />
      </div>
      <div>
        <label className="block font-sans text-xs uppercase tracking-widest text-ink-500 mb-2">
          Telefon
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full border border-cream-300 bg-cream-50 px-4 py-3 font-sans text-sm text-ink-900 focus:outline-none focus:border-ink-700 transition-colors"
        />
      </div>
      <div>
        <label className="block font-sans text-xs uppercase tracking-widest text-ink-500 mb-2">
          Mesajınız *
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="w-full border border-cream-300 bg-cream-50 px-4 py-3 font-sans text-sm text-ink-900 focus:outline-none focus:border-ink-700 transition-colors resize-none"
        />
      </div>
      {error && <p className="font-sans text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ink-900 text-cream-50 font-sans text-xs uppercase tracking-widest py-4 hover:bg-ink-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
