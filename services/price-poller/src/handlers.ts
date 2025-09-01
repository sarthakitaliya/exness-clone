export function toInt(priceFloat: number, decimals: number): number {
  return Math.round(priceFloat * Math.pow(10, decimals));
}

