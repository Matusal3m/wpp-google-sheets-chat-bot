import type { Whatsapp } from "@wppconnect-team/wppconnect";
import { randomUUID } from "crypto";
import { BaseIPC, type EventMap } from "../base-ipc";

type WppCaller = <T extends keyof Whatsapp>(
    acessor: T,
    ...params: Whatsapp[T] extends (...args: any[]) => any
        ? Parameters<Whatsapp[T]>
        : []
) => Promise<
    Whatsapp[T] extends (...args: any[]) => any
        ? ReturnType<Whatsapp[T]>
        : Whatsapp[T]
>;

type CallResponse =
    | {
          message: string;
          ok: false;
          callId: string;
      }
    | {
          result: any;
          ok: true;
          callId: string;
      };

type WhatsappEvents = {
    qrCode: { base64qr: string };
    call: CallResponse;
};

export class WhatsappIPC extends BaseIPC<WhatsappEvents> {
    constructor() {
        super("whatsapp", "whatsapp-client.js");
    }

    onQrCode(callback: (message: { base64qr: string }) => any) {
        this.on("qrCode", message => {
            console.log("[QRCODE EVENT]");

            callback(message);
        });
    }

    call: WppCaller = (acessor: string, ...params: any[]) =>
        new Promise((resolve, reject) => {
            const callId = randomUUID();

            const listener = (message: CallResponse) => {
                if (message.callId !== callId) return;
                if (message.ok) {
                    resolve(message.result);
                    return;
                }
                reject(new Error(message.message));
            };

            this.once("call", listener);
            this.send({ acessor, params, callId });
        });
}
