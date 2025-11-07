import { create, Whatsapp } from "@wppconnect-team/wppconnect";
import { ChatBotService } from "../services/chat-bot-service";
import type { ScrapQrcode } from "@wppconnect-team/wppconnect/dist/api/model/qrcode";
import { GoogleSpreadsheet } from "../services/google-spreadsheet";

type QrCodeCallback = (qrcode: string) => any;

let wpp: Whatsapp | undefined;
let sheet: GoogleSpreadsheet;

export class Client {
    private loadingQrCode = false;

    destroy() {
        wpp = undefined;
    }

    async close() {
        await wpp?.close();
    }

    async load(onQrCode?: QrCodeCallback) {
        if (!onQrCode) {
            if (!wpp || !sheet)
                throw new ClientNotInitialized("Connect with wpp connect.");

            return new ChatBotService(wpp, sheet);
        }

        if (wpp?.isLoggedIn()) return new ChatBotService(wpp, sheet!);

        if (wpp && !wpp?.isLoggedIn()) {
            await this.tryGetQrCode(onQrCode);
            return new ChatBotService(wpp, sheet!);
        }

        this.loadingQrCode = true;
        wpp = await create({
            autoClose: 0,
            disableWelcome: true,
            logQR: false,
            catchQR: qr => {
                onQrCode(qr);
            },
        });

        this.loadingQrCode = false;
        await wpp.start();

        sheet = await GoogleSpreadsheet.init(process.env.SHEET_ID!);
        return new ChatBotService(wpp, sheet);
    }

    async isLoggedIn() {
        return !!(await wpp?.isLoggedIn());
    }

    async isConnected() {
        return !!(await wpp?.isConnected());
    }

    isLoadingQrCode() {
        return this.loadingQrCode;
    }

    private async tryGetQrCode(onQrCode: QrCodeCallback) {
        let login: ScrapQrcode | undefined;
        let qrcode: string | undefined;
        this.loadingQrCode = true;
        for (let attempt = 1; attempt <= 5; attempt++) {
            login = await wpp?.getQrCode();
            qrcode = login?.base64Image;

            if (qrcode) {
                onQrCode(qrcode);
                this.loadingQrCode = false;
                return;
            }

            console.warn(
                `Tentativa ${attempt}/5: QR code não obtido. Tentando novamente...`
            );
            await new Promise(res => setTimeout(res, 1000));
        }
        this.loadingQrCode = false;

        throw new Error("Falha ao obter o QR code após 5 tentativas.");
    }
}

class ClientNotInitialized extends Error {}
