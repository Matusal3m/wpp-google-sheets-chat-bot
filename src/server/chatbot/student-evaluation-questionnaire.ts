import { type Message } from "@wppconnect-team/wppconnect";
import {
    InvalidOptionException,
    NoMoreQuestionsException,
    type AnsweredQuestion,
    type Questioner,
} from "./questioner";
import type { WhatsappIPC } from "../ipc/whatsapp/whatsapp";

type EvaluationQuestionnaireResponse = {
    dispose: () => void;
    answeredQuestions: AnsweredQuestion[];
};

export class StudentEvaluationQuestionnaire {
    private wasInitialized = false;
    private initialMessageTimestamp = 0;

    constructor(
        private readonly wpp: WhatsappIPC,
        private readonly questioner: Questioner,
        private readonly studentName: string,
        private readonly to: string
    ) {}

    execute(): Promise<EvaluationQuestionnaireResponse> {
        return new Promise(async resolve => {
            const initialMessage = await this.wpp.call(
                "sendText",
                this.to,
                `Avaliação para ${this.studentName.toUpperCase()}\n` +
                    `Envie qualquer mensagem para iniciar o questionário.`
            );
            this.initialMessageTimestamp = initialMessage.timestamp;

            const { dispose } = await this.wpp.call(
                "onMessage",
                this.handleMessage.bind(this)
            );

            this.questioner.onFinish = answeredQuestions => {
                resolve({ dispose, answeredQuestions });
            };
        });
    }

    private async handleMessage(message: Message) {
        if (!this.isValidMessage(message)) return;

        try {
            if (this.wasInitialized) {
                await this.questioner.handleWaitingResponse(message.content);
            }

            const question = await this.questioner.nextQuestion();

            await this.wpp.call("sendText", this.to, question.inText);

            this.wasInitialized = true;
        } catch (error: any) {
            if (error instanceof NoMoreQuestionsException) {
                console.warn(
                    `The is no more questions available on ${this.studentName} questionnarie.`
                );
                return;
            }

            if (error instanceof InvalidOptionException) {
                console.warn(
                    `A invalid option "${message.content}" was sent on ${this.studentName} questionnarie.`
                );
                return;
            }

            console.error(error);
        }
    }

    private isValidMessage(message: Message) {
        if (message.isGroupMsg) return;
        if (!message.id.includes(this.to)) return;
        if (message.timestamp < this.initialMessageTimestamp) return;

        return true;
    }
}
