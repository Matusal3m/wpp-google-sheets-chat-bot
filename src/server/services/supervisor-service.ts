import { SupervisorRepository } from "../repositories/supervisor-repository";
import type { Supervisor } from "@prisma/client";
import { GenericCRUDService } from "./generic-crud-service";
import { t } from "elysia";

export const TCreateSupervisorInput = t.Object({
    name: t.String(),
    phone: t.String(),
});

export type CreateSupervisorInput = typeof TCreateSupervisorInput.static;
export type UpdateSupervisorInput = Partial<CreateSupervisorInput>;

export class SupervisorService extends GenericCRUDService<
    Supervisor,
    SupervisorRepository
> {
    constructor() {
        super(new SupervisorRepository());
    }

    getByPhone(phoneNumber: string): Promise<Supervisor | null> {
        return this.repository.findByPhone(phoneNumber);
    }
}
