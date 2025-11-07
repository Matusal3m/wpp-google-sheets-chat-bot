import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { Client } from "./chatbot";
import index from "@/app/index.html";

const app = express();
app.use(express.json());
5585987196621;
Bun.serve({
    port: 3000,
    routes: {
        "/*": index,
        "/startChat": {
            async POST(req) {
                const body = (await req.json()) as any;
                let { phone, students } = body;
                const bot = await client.load();
                await bot.multipleQuestionnaires(students, phone);
                return new Response();
            },
        },
    },
});

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: { origin: "*" },
});

const client = new Client();
const statusConnections = new Set<any>();

client.onStatusChange(status => {
    for (const socket of statusConnections) {
        socket.emit("status:update", status);
    }
});

io.on("connection", socket => {
    console.log(`📡 New client connected: ${socket.id}`);

    socket.on("qrcode:listen", async () => {
        await client.load(qr => {
            socket.emit("qrcode:update", qr);
        });
    });

    statusConnections.add(socket);

    socket.on("disconnect", () => {
        console.log(`❌ Disconnected: ${socket.id}`);
        statusConnections.delete(socket);
    });
});

app.post("/startChat", async (req, res) => {});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
