import { db } from "@/prisma";
import { BaseRepository } from "./base-repository";
import type { Supervisor } from "@prisma/client";

export class SupervisorRepository extends BaseRepository<Supervisor> {
    constructor() {
        super(db.supervisor);
    }

    async findByPhone(phone: string): Promise<Supervisor | null> {
        return db.supervisor.findUnique({ where: { phoneNumber: phone } });
    }
}
