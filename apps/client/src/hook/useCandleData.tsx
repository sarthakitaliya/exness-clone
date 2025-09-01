import api from "@/lib/api";
import { CandlestickData } from "lightweight-charts";
import { useEffect, useState } from "react";


export function useCandleData({
    asset,
    interval
}: {
    asset: string;
    interval: string;
}) {
    const [candleData, setCandleData] = useState<CandlestickData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get("/candles", {
                    params: {
                        asset,
                        ts: interval
                    }
                });
                setCandleData(response.data.candles);
            } catch (error) {
                console.error("Error fetching candle data:", error);
            }finally{
                setLoading(false);
            }
        };

        fetchData();
    }, [asset, interval]);

    return { candleData, loading };
}