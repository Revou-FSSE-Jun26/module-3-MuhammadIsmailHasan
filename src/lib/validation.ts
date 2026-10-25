export const PHONE_HINT = "Enter a valid phone number (8-15 digits, may start with +).";

export function sanitizePhone(value: string) {
  return value.replace(/[^\d+\s-]/g, "");
}

export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return /^\+?[\d\s-]+$/.test(value) && digits.length >= 8 && digits.length <= 15;
}
