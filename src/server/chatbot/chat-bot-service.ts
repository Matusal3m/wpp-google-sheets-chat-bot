import { Questioner } from "./questioner";
import { StudentEvaluationQuestionnaire } from "./student-evaluation-questionnaire";
import type { Whatsapp } from "@wppconnect-team/wppconnect";
import type { GoogleSpreadsheet } from "../services/google-spreadsheet";

export class ChatBotService {
    constructor(
        private readonly wpp: Whatsapp,
        private readonly sheet: GoogleSpreadsheet
    ) {}

    public async startStudentEvaluationQuestionnaire(
        to: string,
        studentName: string
    ) {
        const questions = [
            "ASSIDUIDADE E PONTUALIDADE",
            "CUMPRIMENTO DAS ATIVIDADES PROPOSTAS NO PLANO DE ATIVIDADES DO ESTAGIÁRIO",
            "COMPROMETIMENTO NAS TAREFAS: BUSCOU AUXÍLIO DO(A) SUPERVISOR(A) PARA ESCLARECER DÚVIDAS E DEMONSTROU ATENÇÃO AO CONTEÚDO EXPLICADO",
            "PREPARO TÉCNICO-CIENTÍFICO PARA DESENVOLVER AS ATIVIDADES: DEMONSTRAÇÃO DE TÉCNICA NO DESENVOLVIMENTO DAS ATIVIDADES",
            "INICIATIVA: CAPACIDADE PARA APRESENTAR SUGESTÕES OU RESOLVER OS PROBLEMAS PROPOSTOS",
            "RELACIONAMENTO INTERPESSOAL",
            "ACEITAÇÃO E ADEQUAÇÃO ÀS NORMAS INTERNAS",
        ];
        const options = ["Ótimo", "Bom", "Regular", "Ruim"];

        const questioner = new Questioner(questions, options);

        const evaluationQuestionnaire = new StudentEvaluationQuestionnaire(
            this.wpp,
            questioner,
            studentName,
            to
        );

        const { dispose, answeredQuestions } =
            await evaluationQuestionnaire.execute();

        dispose();

        answeredQuestions
            .toSorted((a, b) => a.questionIndex - b.questionIndex)
            .forEach(async ({ option }) => {
                await this.sheet.addStudent(studentName, option);
            });
    }

    async multipleQuestionnaires(students: string[], phone: string) {
        try {
            for (const student of students) {
                await this.startStudentEvaluationQuestionnaire(phone, student);
            }

            console.info(`All students from ${phone} answered`);
        } catch (error) {
            console.warn(`Could not start questionnaire for ${phone}`);
            console.error(error);
        }
    }
}
