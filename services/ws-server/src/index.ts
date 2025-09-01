import { WebSocketServer, WebSocket } from "ws";
import { CONFIG, redis } from "@exness/shared";

const wss = new WebSocketServer({ port: CONFIG.ws.port as number });

const clients = new Set<WebSocket>();

wss.on("connection", async (ws: WebSocket) => {
  console.log("New client connected");
  clients.add(ws);

  redis.subscribe(CONFIG.redis.pubSubChannel, (err, count) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log(`Subscribed to ${count} channels.`);
    }
  });

  redis.on("message", (_channel, message) => {
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clients.delete(ws);
  });
});
