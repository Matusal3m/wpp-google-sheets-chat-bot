import wpp from "@wppconnect-team/wppconnect";
import {
    type Student,
    StudentEvaluationQuestionnaire,
} from "./student-evaluation-questionnarie";
import { Questioner, type Question } from "./questioner";

const options = ["Ótimo", "Bom", "Regular", "Ruim"];

const questions: Question[] = [
    {
        command: "Como você avaliaria a assiduidade do aluno?",
        options,
    },
    {
        command: "Como você avaliaria o cumprimento das atividades propostas?",
        options,
    },
];

const questioner = new Questioner(questions);

const student: Student = {
    id: "student-1",
    name: "Matusalém de Sousa",
};

const client = await wpp.create({});

const questionnarie = new StudentEvaluationQuestionnaire(
    client,
    questioner,
    student,
    process.env.TEST_PHONE || "",
);

await questionnarie.execute();
