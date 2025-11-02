import { db } from "@/prisma";
import { BaseRepository } from "./base-repository";
import type { Student } from "@prisma/client";

export class StudentRepository extends BaseRepository<Student> {
    constructor() {
        super(db.student);
    }

    async findFullById(id: number) {
        return db.student.findFirst({
            where: { id },
            include: {
                Questionnaire: {
                    include: {
                        Questions: {
                            select: {
                                response: true,
                            },
                        },
                    },
                },
                Supervisor: true,
            },
            omit: { supervisorId: true },
        });
    }

    findAllFull() {
        return db.student.findMany({
            include: {
                Questionnaire: {
                    include: {
                        Questions: {
                            select: {
                                response: true,
                            },
                        },
                    },
                },
                Supervisor: true,
            },
            omit: { supervisorId: true },
        });
    }
}
