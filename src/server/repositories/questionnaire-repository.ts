import { db } from "@/prisma";
import { GenericCRUDRepository } from "./base-repository";
import type { Questionnaire } from "@prisma/client";

export class QuestionnaireRepository extends GenericCRUDRepository<Questionnaire> {
    constructor() {
        super(db.questionnaire);
    }

    async findByStudentId(studentId: number) {
        return db.questionnaire.findMany({
            where: { studentId },
            include: { Questions: true },
        });
    }
}
