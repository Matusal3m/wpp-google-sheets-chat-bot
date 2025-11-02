import { db } from "@/prisma";
import { BaseRepository } from "./base-repository";
import type { Student } from "@prisma/client";

export class StudentRepository extends BaseRepository<Student> {
    constructor() {
        super(db.student);
    }

    async findBySupervisorPhone(phone: string): Promise<Student[]> {
        return db.student.findMany({
            where: { supervisorPhoneNumber: phone },
        });
    }

    async findWithQuestionnaires(id: number) {
        return db.student.findUnique({
            where: { id },
            include: { Questionnaires: true },
        });
    }
}
