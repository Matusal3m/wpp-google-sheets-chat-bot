import { db } from "@/prisma";
import { GenericCRUDRepository } from "./generic-crud-repository";
import type { Student } from "@prisma/client";

export class StudentRepository extends GenericCRUDRepository<Student> {
    constructor() {
        super(db.student);
    }

    async findFullById(id: number) {
        return db.student.findFirst({
            where: { id },
            include: {
                supervisor: true,
                company: true,
            },
            omit: { enrollmentNumber: true, companyId: true },
        });
    }

    findAllFull() {
        return db.student.findMany({
            include: {
                supervisor: true,
                company: true,
            },
            omit: { enrollmentNumber: true, companyId: true },
        });
    }
}
