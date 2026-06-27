import type { LipAttribute, LipFinish } from "../../types/catalog.js";

const EXCLUDED_KEYWORDS = [
  "گونه",
  "پاک کننده",
  "پاک‌کننده",
  "ریموور",
  "remover",
  "براش",
  "قلم مو",
  "brush",
  "تراش",
  "sharpen",
  "ماسک",
  "mask",
  "اسکراب",
  "scrub",
  "فندک",
  "آینه",
  "قاب",
  "کیف",
  "ساک",
  "جاکلیدی",
  "جا کلیدی",
  "جاسوییچی",
  "جا سوییچی",
  "سوییچ",
  "نگهدارنده",
  "استند",
  "ماکت",
  "عروسک",
  "گیره",
  "دفتر",
  "خودکار",
  "روان نویس",
  "روان‌نویس",
  "ماگ",
  "لیوان",
  "استیکر",
  "برچسب",
  "پیکسل",
  "جامدادی",
  "چراغ",
  "پاوربانک",
  "کابل",
  "شارژر",
  "هندزفری",
  "گردنبند",
  "کوسن",
  "بالشت",
] as const;

const TYPE_WORDS = [
  "حرارتی",
  "جامد",
  "مایع",
  "مدادی",
  "کرمی",
  "بالم",
  "تتو",
  "جیر",
  "براق",
  "مات",
  "ساتن",
  "مخملی",
  "ضد آب",
  "ضدآب",
  "لیکویید",
  "لیپ‌استیک",
] as const;

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsAny(text: string, keywords: readonly string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function isLipProduct(title: string | null | undefined): boolean {
  const normalized = (title ?? "").trim().toLowerCase();
  if (!normalized) return false;

  const head = normalized.split(/\s+/).slice(0, 2).join(" ");
  if (!(head.includes("رژ") || normalized.includes("lipstick"))) return false;

  return !containsAny(normalized, EXCLUDED_KEYWORDS);
}

export function inferFinish(text: string | null | undefined): LipFinish | null {
  const normalized = (text ?? "").toLowerCase();
  const has = (...keywords: string[]) => containsAny(normalized, keywords);

  if (has("مات", "matte")) return "matte";
  if (has("مخمل", "velvet")) return "velvet";
  if (has("براق", "برّاق", "گلاس", "gloss")) return "gloss";
  if (has("ساتن", "satin")) return "satin";
  if (has("متالیک", "metallic")) return "metallic";
  if (has("اکلیل", "گلیتر", "glitter")) return "glitter";
  if (has("شاین", "شیمر", "درخشان", "shimmer")) return "shimmer";
  if (has("شفاف", "sheer")) return "sheer";
  if (has("ماندگار", "بادوام", "لانگ", "long")) return "stain";
  return null;
}

export function inferAttributes(text: string | null | undefined): LipAttribute[] {
  const normalized = (text ?? "").toLowerCase();
  const has = (...keywords: string[]) => containsAny(normalized, keywords);
  const attributes: LipAttribute[] = [];

  if (has("ضد آب", "ضدآب", "waterproof")) attributes.push("waterproof");
  if (has("ماندگار", "بادوام", "لانگ", "long")) attributes.push("longWear");
  if (has("پاک نشدنی", "پاک‌نشدنی", "transfer")) attributes.push("transferProof");
  if (has("آبرسان", "مرطوب", "hydra", "moistur")) attributes.push("hydrating");
  if (has("وگان", "vegan")) attributes.push("vegan");
  if (has("بدون آزار", "cruelty")) attributes.push("crueltyFree");

  return attributes;
}

export function extractStyle(title: string | null | undefined): string | null {
  const text = title ?? "";
  for (const word of TYPE_WORDS) {
    if (text.includes(word)) return word.replace("ضد آب", "ضدآب");
  }
  return null;
}

export function extractLongevity(title: string | null | undefined): string | null {
  const normalized = String(title ?? "").replace(/[۰-۹]/g, (digit) =>
    String(PERSIAN_DIGITS.indexOf(digit)),
  );
  const match = normalized.match(/(\d{1,3})\s*ساعت/);
  if (!match) return null;

  const hours = Number(match[1]);
  if (hours >= 96) return "۹۶ ساعت";
  if (hours >= 24) return "۲۴ ساعت";
  if (hours >= 12) return "۱۲ ساعت";
  return "۸ ساعت";
}

export function cleanName(title: string | null | undefined, brand: string): string {
  let text = ` ${title ?? ""} `;
  text = text.replace(/رژ\s*لب/g, " ");

  for (const word of TYPE_WORDS) {
    text = text.replace(new RegExp(escapeRegex(word), "g"), " ");
  }

  for (const word of ["مجموعه", "عددی", "بسته", "پک", "تایی", "اورجینال", "اصل"]) {
    text = text.replace(new RegExp(escapeRegex(word), "g"), " ");
  }

  text = text.replace(/(شماره|مدل|کد|سری)/g, " ");
  if (brand) text = text.replace(new RegExp(escapeRegex(brand), "ig"), " ");
  text = text.replace(/\s+/g, " ").trim();
  return text || (title ?? "").trim();
}

export interface ParsedShadeCode {
  name: string;
  code: string | null;
}

export function splitShadeCode(name: string | null | undefined): ParsedShadeCode {
  const tokens = (name ?? "").split(/\s+/).filter(Boolean);
  const codes: string[] = [];
  const rest: string[] = [];

  for (const token of tokens) {
    if (token === "رنگ") continue;
    if (/[0-9۰-۹]/.test(token) || /^[A-Z]{1,5}$/.test(token)) codes.push(token);
    else rest.push(token);
  }

  return {
    name: rest.join(" ").trim(),
    code: codes.join(" ").trim() || null,
  };
}
