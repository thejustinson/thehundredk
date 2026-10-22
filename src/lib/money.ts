export function formatNaira(amountKobo: number, options?: { showKoboIfPresent?: boolean }): string {
  const hasKobo = amountKobo % 100 !== 0;
  const showKobo = options?.showKoboIfPresent ? hasKobo : false;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: showKobo ? 2 : 0,
    maximumFractionDigits: showKobo ? 2 : 0,
  }).format(amountKobo / 100);
}

export function calculateCommissionKobo(amountKobo: number, commissionPercent: number = 20): number {
  return Math.round(amountKobo * (commissionPercent / 100));
}
