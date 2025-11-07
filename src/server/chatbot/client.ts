import { create, Whatsapp } from "@wppconnect-team/wppconnect";
import { ChatBotService } from "./chat-bot-service";
import type { ScrapQrcode } from "@wppconnect-team/wppconnect/dist/api/model/qrcode";
import { GoogleSpreadsheet } from "../services/google-spreadsheet";

type QrCodeCallback = (qrcode: string) => any;

type StatusCallback = (status: ChatBotStatus) => any;

type ChatBotStatus = {
    up: boolean;
    isLogged: boolean;
    isLoadingQrCode: boolean;
};

let wpp: Whatsapp | undefined;
let sheet: GoogleSpreadsheet;

export class Client {
    private onStatusChangeCb: StatusCallback | null = null;

    private status: ChatBotStatus = {
        up: false,
        isLogged: false,
        isLoadingQrCode: false,
    };

    constructor() {
        if (wpp) this.updateStatus({ up: true });
    }

    destroy() {
        wpp = undefined;
    }

    close() {
        return wpp?.close();
    }

    load(onQrCode?: QrCodeCallback) {
        if (!onQrCode) return this.loadWithoutQrCallback();
        console.count("Times");

        if (wpp?.isLoggedIn()) return this.handleAlreadyLogged();
        if (wpp) return this.handleNotLogged(onQrCode);

        return this.initializeClient(onQrCode);
    }

    public onStatusChange(cb: (status: ChatBotStatus) => any) {
        this.onStatusChangeCb = cb;
    }

    getStatus() {
        return this.status;
    }

    private updateStatus(newStatus: Partial<ChatBotStatus>) {
        console.log({ currentStatus: this.status, newStatus });

        this.status = { ...this.status, ...newStatus };

        if (this.onStatusChangeCb) {
            this.onStatusChangeCb(this.status);
        }
    }

    private async loadWithoutQrCallback() {
        if (!wpp || !sheet)
            throw new ClientNotInitialized("Connect with wpp connect.");

        this.updateStatus({
            isLogged: true,
            isLoadingQrCode: false,
        });

        return new ChatBotService(wpp, sheet);
    }

    private async handleAlreadyLogged() {
        if (!wpp || !sheet)
            throw new ClientNotInitialized("Connect with wpp connect.");

        this.updateStatus({
            isLogged: true,
            isLoadingQrCode: false,
        });
        return new ChatBotService(wpp, sheet!);
    }

    private async handleNotLogged(onQrCode: QrCodeCallback) {
        if (!wpp || !sheet)
            throw new ClientNotInitialized("Connect with wpp connect.");

        this.updateStatus({
            isLogged: false,
            isLoadingQrCode: true,
        });

        await this.tryGetQrCode(onQrCode);

        this.updateStatus({
            isLogged: true,
            isLoadingQrCode: false,
        });

        return new ChatBotService(wpp, sheet!);
    }

    private async initializeClient(onQrCode: QrCodeCallback) {
        this.updateStatus({
            isLogged: false,
            isLoadingQrCode: true,
            up: false,
        });

        wpp = await create({
            autoClose: 0,
            disableWelcome: true,

            catchQR: qr => {
                onQrCode(qr);
            },
        });

        await wpp.start();

        try {
            sheet = await GoogleSpreadsheet.init();
        } catch (error) {
            console.error(error);
        }

        this.updateStatus({
            isLogged: true,
            isLoadingQrCode: false,
            up: true,
        });

        return new ChatBotService(wpp, sheet);
    }

    private async tryGetQrCode(onQrCode: QrCodeCallback) {
        let login: ScrapQrcode | undefined;
        let qrcode: string | undefined;
        this.updateStatus({ isLoadingQrCode: true });
        for (let attempt = 1; attempt <= 5; attempt++) {
            login = await wpp?.getQrCode();
            qrcode = login?.base64Image;

            if (qrcode) {
                onQrCode(qrcode);
                return;
            }

            console.warn(
                `Tentativa ${attempt}/5: QR code não obtido. Tentando novamente...`
            );
            await new Promise(res => setTimeout(res, 1000));
        }
        this.updateStatus({ isLoadingQrCode: false });

        throw new Error("Falha ao obter o QR code após 5 tentativas.");
    }
}

class ClientNotInitialized extends Error {}
