import { create } from "@wppconnect-team/wppconnect";
import { ChatBotService } from "../services/chat-bot-service";

export class Client {
    private service: ChatBotService | null = null;

    destroy() {
        this.service = null;
    }

    async load(onQrCode: (qrcode: string) => any) {
        if (this.service) return this.service;

        const wpp = await create({
            autoClose: 0,
            disableWelcome: true,
            waitForLogin: false,
            catchQR: qr => {
                console.log({ qr });
                onQrCode(qr);
            },
        });

        await wpp.start();

        this.service = new ChatBotService(wpp);

        return this.service;
    }

    isLoaded() {
        return !!this.service;
    }
}
