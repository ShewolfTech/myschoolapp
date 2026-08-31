import type { IFeeItem } from "@/models/School";

export function formatUGX(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function groupFeesByTerm(feeStructure: IFeeItem[]): Record<string, IFeeItem[]> {
  const groups: Record<string, IFeeItem[]> = {};
  for (const item of feeStructure) {
    const key = `${item.level} — ${item.term}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}
