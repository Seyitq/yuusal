"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-2">
        <p className="font-sans text-sm text-ink-300">
          Teşekkürler! Bültenimize başarıyla abone oldunuz.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta adresiniz"
        required
        className="flex-1 bg-transparent border border-ink-700 text-cream-100 placeholder-ink-500 px-4 py-3 text-sm font-sans focus:outline-none focus:border-ink-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-cream-100 text-ink-900 font-sans text-xs uppercase tracking-widest px-8 py-3 hover:bg-cream-200 transition-colors disabled:opacity-50"
      >
        {loading ? "..." : "Abone Ol"}
      </button>
      {error && (
        <p className="text-xs text-red-400 font-sans mt-1 sm:col-span-2">{error}</p>
      )}
    </form>
  );
}