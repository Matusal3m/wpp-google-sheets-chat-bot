import { type Message, Whatsapp } from "@wppconnect-team/wppconnect";
import {
    InvalidOptionException,
    NoMoreQuestionsException,
    type Questioner,
} from "./questioner";
import type { Student } from "@prisma/client";

export class StudentEvaluationQuestionnaire {
    private wasInitialized = false;
    private initialMessageTimestamp = 0;

    constructor(
        private readonly wpp: Whatsapp,
        private questioner: Questioner,
        private student: Student
    ) {}

    async execute() {
        const initialMessage = await this.wpp.sendText(
            this.student.supervisorPhoneNumber,
            `Avaliação para ${this.student.name.toUpperCase()}\n` +
                `Envie qualquer mensagem para iniciar o questionário.`
        );
        this.initialMessageTimestamp = initialMessage.timestamp;

        const { dispose } = this.wpp.onMessage(this.handleMessage.bind(this));

        this.questioner.onFinish = responses => {
            dispose();
            this.questioner.save(responses);
        };
    }

    private async handleMessage(message: Message) {
        if (!this.isValidMessage(message)) return;

        try {
            if (this.wasInitialized) {
                await this.questioner.handleWaitingResponse(message.content);
            }

            const question = await this.questioner.nextQuestion();

            await this.wpp.sendText(
                this.student.supervisorPhoneNumber,
                question.inText
            );

            this.wasInitialized = true;
        } catch (error: any) {
            if (error instanceof NoMoreQuestionsException) {
                console.warn(
                    `The is no more questions available on ${this.student.name} questionnarie.`
                );
                return;
            }

            if (error instanceof InvalidOptionException) {
                console.warn(
                    `A invalid option "${message.content}" was sent on ${this.student.name} questionnarie.`
                );
                return;
            }

            console.error(error);
        }
    }

    private isValidMessage(message: Message) {
        if (message.isGroupMsg) return;
        if (!message.id.includes(this.student.supervisorPhoneNumber)) return;
        if (message.timestamp < this.initialMessageTimestamp) return;

        return true;
    }
}
