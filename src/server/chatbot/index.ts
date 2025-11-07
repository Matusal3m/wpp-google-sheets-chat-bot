import Elysia, { t } from "elysia";
import { Client } from "./client";

const client = new Client();

const socket = new Elysia()
    .ws("/qrcode", {
        response: t.String(),
        message(ws) {
            client.load(qr => {
                ws.send(qr);
            });
        },
    })
    .ws("/status", {
        response: t.Object({
            up: t.Boolean(),
            isLogged: t.Boolean(),
            isLoadingQrCode: t.Boolean(),
        }),
        idleTimeout: 2,
        async open(ws) {
            console.log("Conection started");

            ws.subscribe("status");
        },
        async message(ws) {
            const isLoadingQrCode = client.isLoadingQrCode();
            const isLogged = await client.isLoggedIn();
            const up = await client.isConnected();

            ws.send({ isLoadingQrCode, isLogged, up });
            ws.publish("status", { isLoadingQrCode, isLogged, up });
        },
    })
    .listen(3001, ({ port }) => {
        console.log(`🔌 Socket listinig at ${port}`);
    });

export type Socket = typeof socket;
