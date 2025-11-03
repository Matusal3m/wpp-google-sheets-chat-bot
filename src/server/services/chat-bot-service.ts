import type { Whatsapp } from "@wppconnect-team/wppconnect";
import { Questioner } from "../chatbot/questioner";
import { QuestionRepository } from "../repositories/question-repository";
import { StudentEvaluationQuestionnaire } from "../chatbot/student-evaluation-questionnaire";

export class ChatBotService {
    private readonly questionsRepo = new QuestionRepository();

    constructor(private readonly wpp: Whatsapp) {}

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
            this.wpp,
            questioner,
            studentName,
            to
        );

        const { dispose, answeredQuestions } =
            await evaluationQuestionnaire.execute();

        dispose();

        await this.questionsRepo.updateMany("id", answeredQuestions);
    }
}
