import { db } from "@/prisma";
import { BaseRepository } from "./base-repository";
import type { Question } from "@prisma/client";

export class QuestionRepository extends BaseRepository<Question> {
    constructor() {
        super(db.question);
    }

    async findByQuestionnaire(questionnaireId: number) {
        return db.question.findMany({ where: { questionnaireId } });
    }
}
