import { PricePoller } from "./poller";

async function startBinancePoller() {
  try {
    new PricePoller().start();
  } catch (error) {
    console.error("Error starting Binance price poller:", error);
  }
}

startBinancePoller();
