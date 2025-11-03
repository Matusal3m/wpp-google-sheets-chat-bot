import { db } from "@/prisma";
import { GenericCRUDRepository } from "./generic-crud-repository";
import type { Question } from "@prisma/client";

export class QuestionRepository extends GenericCRUDRepository<Question> {
    constructor() {
        super(db.question);
    }

    async findByQuestionnaire(questionnaireId: number) {
        return db.question.findMany({ where: { questionnaireId } });
    }
}
