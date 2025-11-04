import { Questioner } from "../chatbot/questioner";
import { QuestionRepository } from "../repositories/question-repository";
import { StudentEvaluationQuestionnaire } from "../chatbot/student-evaluation-questionnaire";
import type { WhatsappIPC } from "../ipc/whatsapp/whatsapp";

export class ChatBotService {
    private readonly questionsRepo = new QuestionRepository();

    constructor(private readonly wppIpc: WhatsappIPC) {}

    public async startStudentEvaluationQuestionnaire(
        to: string,
        studentName: string,
        questionnaireId: number
    ) {
        const questions = await this.questionsRepo.findByQuestionnaire(
            questionnaireId
        );

        const questioner = new Questioner(questions);

        const evaluationQuestionnaire = new StudentEvaluationQuestionnaire(
            this.wppIpc,
            questioner,
            studentName,
            to
        );

        const { dispose, answeredQuestions } =
            await evaluationQuestionnaire.execute();

        dispose();

        await this.questionsRepo.updateMany("id", answeredQuestions);
    }

    connect(): Promise<{ base64qr: string }> {
        return new Promise((resolve, reject) => {
            this.wppIpc.onQrCode(({ base64qr }) => {
                console.log("ON QRCODE BASE 64 QR");
                resolve({ base64qr });
            });

            this.wppIpc.on("call", ({ ok }) => {
                if (!ok) reject(ok);
            });
        });
    }
}
