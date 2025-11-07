import { db } from "@/prisma";
import { GenericCRUDRepository } from "./generic-crud-repository";
import type { Supervisor } from "@prisma/client";

export class SupervisorRepository extends GenericCRUDRepository<Supervisor> {
    constructor() {
        super(db.supervisor);
    }

    async findByPhone(phone: string): Promise<Supervisor | null> {
        return db.supervisor.findUnique({ where: { phone } });
    }
}
