import wpp from "@wppconnect-team/wppconnect";
import {
    type Question,
    type Student,
    StudentEvaluationQuestionnaire,
} from "./student-evaluation-questionnarie";

const client = await wpp.create({});

const student: Student = {
    id: "student-1",
    name: "Matusalém de Sousa",
};

const questions: Question[] = [
    {
        command: "Primeira pergunta do questionário",
        options: ["recebido", "não recebido (mentira)", "quero a pŕoxima"],
    },
    {
        command: "Segunda pergunta do questionário",
        options: ["recebido", "não recebido (mentira)", "quero a pŕoxima"],
    },
    {
        command: "Terceira pergunta do questionário",
        options: ["recebido", "não recebido (mentira)", "quero a pŕoxima"],
    },
    {
        command: "Quarta pergunta do questionário",
        options: ["recebido", "não recebido (mentira)", "quero a pŕoxima"],
    },
];

console.log("QUESTIONNARIE INSTACIANTED");

const questionnarie = new StudentEvaluationQuestionnaire(
    client,
    questions,
    student,
    process.env.TEST_PHONE || "",
);

await questionnarie.execute();
