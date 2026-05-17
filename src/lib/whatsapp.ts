/**
 * WhatsApp wa.me URL'i üretir.
 * Telefon numarası formatı: 905XXXXXXXXX (sadece rakamlar, + yok)
 */
export function buildWhatsAppUrl(params: {
  phoneNumber: string;
  template: string;
  variables?: Record<string, string>;
}): string {
  const { phoneNumber, template, variables = {} } = params;

  let message = template;
  for (const [key, value] of Object.entries(variables)) {
    message = message.replaceAll(`{${key}}`, value);
  }

  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
