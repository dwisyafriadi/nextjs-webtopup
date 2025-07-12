// lib/utils/format.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatPhoneNumber(phone: string): string {
  // Remove non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Format as 0812-3456-7890
  if (cleaned.startsWith("0")) {
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  return phone;
}
