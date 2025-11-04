import { create, Whatsapp } from "@wppconnect-team/wppconnect";
import { ChatBotService } from "../services/chat-bot-service";

export class Client {
    private wpp: Whatsapp | null = null;

    destroy() {
        this.wpp = null;
    }

    async load(onQrCode: (qrcode: string) => any) {
        if (this.wpp) return new ChatBotService(this.wpp);

        this.wpp = await create({
            autoClose: 20000,
            disableWelcome: true,
            catchQR: qr => {
                console.log({ qr });
                onQrCode(qr);
            },
        });

        await this.wpp.start();

        return new ChatBotService(this.wpp);
    }

    isLoaded() {
        return !!this.wpp;
    }
}
