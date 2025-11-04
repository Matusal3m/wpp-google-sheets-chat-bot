import { create } from "@wppconnect-team/wppconnect";
import { BaseChild } from "../base-child";

// Códigos de cores ANSI
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
};

class WhatsappChild extends BaseChild {
    client;

    execute() {
        console.log(
            colors.green + "[WhatsappChild PROCESS EXECUTED]" + colors.reset
        );
        console.log(
            colors.cyan +
                "📱 WhatsApp Child Process iniciado com sucesso!" +
                colors.reset
        );

        this.on("call", async ({ acessor, callId, params = [] }) => {
            console.log(
                colors.yellow +
                    `🔄 Chamada recebida - Acessor: ${acessor}, CallID: ${callId}` +
                    colors.reset
            );
            console.log(
                colors.blue +
                    `📞 Parâmetros recebidos: ${JSON.stringify(params)}` +
                    colors.reset
            );

            await this.ensureClient(callId);

            if (!this.hasAcessor(acessor, callId)) {
                console.log(
                    colors.red +
                        `❌ Acessor ${acessor} não encontrado no cliente` +
                        colors.reset
                );
                return;
            }

            try {
                const attr = this.client[acessor];
                console.log(
                    colors.magenta +
                        `🔍 Acessor ${acessor} encontrado no cliente` +
                        colors.reset
                );

                if (typeof attr === "function") {
                    console.log(
                        colors.cyan +
                            `⚡ Executando função ${acessor}...` +
                            colors.reset
                    );
                    const result = await attr(...params);
                    console.log(
                        colors.green +
                            `✅ Função ${acessor} executada com sucesso` +
                            colors.reset
                    );
                    this.emit("call", { result, ok: true, callId });
                    return;
                }

                console.log(
                    colors.blue +
                        `📊 Retornando atributo ${acessor}: ${JSON.stringify(
                            attr
                        )}` +
                        colors.reset
                );
                this.emit("call", { result: attr, ok: true, callId });
            } catch (error) {
                console.log(
                    colors.red +
                        `💥 Erro ao executar ${acessor}: ${error.message}` +
                        colors.reset
                );
                console.error(
                    colors.red + "Stack trace do erro:",
                    error + colors.reset
                );

                process.send({
                    ok: false,
                    message: "On getting and/or calling attribute",
                    callId,
                    error: error.message,
                });
            }
        });
    }

    hasAcessor(acessor, callId) {
        console.log(
            colors.blue +
                `🔎 Verificando se acessor ${acessor} existe no cliente...` +
                colors.reset
        );

        if (acessor in this.client) {
            console.log(
                colors.green +
                    `✅ Acessor ${acessor} encontrado!` +
                    colors.reset
            );
            return true;
        }

        console.log(
            colors.red +
                `❌ Acessor ${acessor} NÃO encontrado no cliente` +
                colors.reset
        );
        this.emit("call", {
            message: `Acessor ${acessor} does not exists in client`,
            ok: false,
            callId,
        });
        return false;
    }

    async ensureClient(callId) {
        try {
            if (this.client) {
                console.log(
                    colors.green +
                        "✅ Cliente WhatsApp já está inicializado" +
                        colors.reset
                );
                return;
            }

            console.log(
                colors.yellow +
                    "🚀 Inicializando cliente WhatsApp..." +
                    colors.reset
            );
            console.log(
                colors.blue + "📱 Configurando WPPConnect..." + colors.reset
            );

            this.client = await create({
                logQR: false,
                autoClose: 0,
                disableWelcome: true,
                waitForLogin: false,
                catchQR: qr => {
                    console.log(
                        colors.cyan +
                            "📱 QR Code recebido - Emitindo evento..." +
                            colors.reset
                    );
                    this.emit("qrCode", { qr });
                },
            });

            console.log(
                colors.green +
                    "✅ Cliente WPPConnect criado com sucesso" +
                    colors.reset
            );
            console.log(
                colors.yellow + "▶️ Iniciando cliente..." + colors.reset
            );

            await this.client.start();

            console.log(
                colors.green +
                    "🎉 Cliente WhatsApp iniciado com sucesso!" +
                    colors.reset
            );
            console.log(
                colors.cyan +
                    "🤖 WhatsApp Child está pronto para receber chamadas" +
                    colors.reset
            );
        } catch (error) {
            console.log(
                colors.red +
                    "💥 ERRO CRÍTICO ao inicializar cliente WhatsApp" +
                    colors.reset
            );
            console.error(
                colors.red + "Detalhes do erro:",
                error + colors.reset
            );

            this.emit("call", {
                ok: false,
                message:
                    "Error creating instance of wpp connect. Process exited.",
                callId,
                error: error.message,
            });

            console.log(
                colors.red +
                    "🛑 Processo será finalizado devido ao erro crítico" +
                    colors.reset
            );
            process.exit(1);
        }
    }
}

console.log(
    colors.magenta + "==================================" + colors.reset
);
console.log(
    colors.magenta + "🚀 INICIANDO WHATSAPP CHILD PROCESS" + colors.reset
);
console.log(
    colors.magenta + "==================================" + colors.reset
);

const whatsappChild = new WhatsappChild();

console.log(
    colors.blue + "🔧 Instância do WhatsAppChild criada" + colors.reset
);
console.log(colors.yellow + "▶️ Executando WhatsAppChild..." + colors.reset);

whatsappChild.execute();

console.log(
    colors.green + "✅ WhatsAppChild executado com sucesso" + colors.reset
);
