let lastPrices: Record<string, number> = {};

export const computeBidAsk = (symbol: string, tradePrice: number) => {
  const spread = 0.01;
  const decimals = 2;
  const scale = Math.pow(10, decimals);

  const ask = Math.round(tradePrice * (1 + spread / 2) * scale);
  const bid = Math.round(tradePrice * (1 - spread / 2) * scale);

  const prev = lastPrices[symbol] ?? tradePrice;
  const direction =
    tradePrice > prev ? "up" : tradePrice < prev ? "down" : "flat";

  lastPrices[symbol] = tradePrice;

  return {
    type: "bid-ask",
    symbol,
    mid: tradePrice,
    bid,
    ask,
    direction,
  };
};
