import Elysia, { t } from "elysia";
import { ChatBotService } from "../services/chat-bot-service";
import { WhatsappIPC } from "../ipc/whatsapp/whatsapp";

const ipc = new WhatsappIPC();
const chatBotService = new ChatBotService(ipc);

export const chatbot = new Elysia()
    .ws("/health", {
        response: t.Boolean(),
        async message(ws) {
            const processIsConnected = ipc.connected();
            console.log({ processIsConnected });
            ws.send(processIsConnected);
        },
    })
    .ws("/qr", {
        async message(ws) {
            const result = await chatBotService.connect();
            ws.send({ result });
        },
    });
