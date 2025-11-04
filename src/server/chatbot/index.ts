import Elysia, { t } from "elysia";
import { Client } from "./client";

const client = new Client();

const socket = new Elysia()
    .ws("/connect", {
        response: t.String(),
        async message(ws) {
            const bot = await client.load(qr => ws.send(qr));
        },
    })
    .ws("/status", {
        response: t.Object({ up: t.Boolean() }),
        message(ws) {
            ws.send({ up: client.isLoaded() });
        },
    })
    .listen(3001, ({ port }) => {
        console.log(`🔌 Socket listinig at ${port}`);
    });

export type Socket = typeof socket;
