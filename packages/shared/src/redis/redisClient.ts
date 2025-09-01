import Redis from "ioredis";
import { CONFIG } from "../config/config";

export const redis = new Redis(CONFIG.redis.redisUrl!);

export async function publish(channel: string, message: string) {
  await redis.publish(channel, message);
}
