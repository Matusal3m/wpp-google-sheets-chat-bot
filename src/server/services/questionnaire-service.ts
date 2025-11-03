import { db } from "@/prisma";
import { t } from "elysia";
import type { Questionnaire } from "@prisma/client";
import { StudentRepository } from "../repositories/student-repository";
import { QuestionnaireRepository } from "../repositories/questionnaire-repository";
import { GenericCRUDService } from "./generic-crud-service";

export const TCreateQuestionInput = t.Object({
    command: t.String(),
    options: t.Optional(t.ArrayString()),
});

export type CreateQuestionInput = typeof TCreateQuestionInput.static;

export const TCreateQuestionnaireInput = t.Object({
    studentId: t.Number(),
    defaultOptions: t.ArrayString(),
    questions: t.Array(TCreateQuestionInput),
});

export type CreateQuestionnaireInput = typeof TCreateQuestionnaireInput.static;

export class QuestionnaireService extends GenericCRUDService<
    Questionnaire,
    QuestionnaireRepository
> {
    private readonly studentRepo: StudentRepository;

    constructor() {
        super(new QuestionnaireRepository());
        this.studentRepo = new StudentRepository();
    }

    override async create(data: CreateQuestionnaireInput) {
        const { studentId, defaultOptions, questions } = data;

        const student = await this.studentRepo.findById(studentId);
        if (!student) {
            throw new Error(`Student with id ${studentId} not found`);
        }

        const questionnaire = await db.$transaction(async tx => {
            const createdQuestionnaire = await tx.questionnaire.create({
                data: {
                    studentId,
                    defaultOptions,
                },
            });

            if (questions.length > 0) {
                await tx.question.createMany({
                    data: questions.map(question => ({
                        questionnaireId: createdQuestionnaire.id,
                        command: question.command,
                        options: question.options ?? defaultOptions,
                    })),
                });
            }

            return createdQuestionnaire;
        });

        return questionnaire;
    }
}
