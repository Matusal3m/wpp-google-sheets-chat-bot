import { StudentRepository } from "../repositories/student-repository";
import type { Student } from "@prisma/client";
import { GenericCRUDService } from "./generic-crud-service";
import { t } from "elysia";

export const TCreateStudentInput = t.Object({
    name: t.String(),
    supervisorId: t.Number(),
});

export type CreateStudentInput = typeof TCreateStudentInput.static;
export type UpdateStudentInput = Partial<CreateStudentInput>;

export class StudentService extends GenericCRUDService<
    Student,
    StudentRepository
> {
    constructor() {
        super(new StudentRepository());
    }

    getAllFull() {
        return this.repository.findAllFull();
    }

    getFullById(id: number) {
        return this.repository.findFullById(id);
    }
}
