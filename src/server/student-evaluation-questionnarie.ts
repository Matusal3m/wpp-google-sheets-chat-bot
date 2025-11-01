import { type Message, Whatsapp } from "@wppconnect-team/wppconnect";

export interface Question {
    command: string;
    options: string[];
}

export type Student = {
    id: number | string;
    name: string;
};

export class StudentEvaluationQuestionnaire {
    private hasSendInitialMessage = false;
    private wasFinished = false;

    constructor(
        private readonly wpp: Whatsapp,
        private questions: Question[],
        private student: Student,
        private to: string,
    ) {}

    async execute() {
        if (!this.hasSendInitialMessage) {
            this.wpp.sendText(
                this.to,
                `Avaliação para ${this.student.name.toUpperCase()}\n` +
                    `Envie qualquer mensagem para iniciar o questionário.`,
            );

            this.hasSendInitialMessage = true;
        }

        this.wpp.onMessage(this.handleMessage.bind(this));
    }

    async handleMessage(message: Message) {
        if (this.wasFinished) return;
        if (message.isGroupMsg) return;
        if (!message.id.includes(this.to)) return;

        this.sendQuestion();
    }

    async sendQuestion() {
        const question = this.questions.shift();

        if (!question) {
            this.wasFinished = true;

            await this.wpp.sendText(
                this.to,
                `Avaliação para ${this.student.name} finalizada!\n` +
                    `Obrigado pela colaboração!`,
            );

            return;
        }

        console.log(`[CHATBOT SYSTEM LOG] QUESTION: ${question.command}`);

        await this.wpp.sendText(this.to, question.command);

        console.log(`[CHATBOT SYSTEM LOG] QUESTION SENT: ${question.command}`);
    }
}
