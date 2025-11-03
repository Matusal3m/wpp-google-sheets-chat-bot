import type { GenericCRUDRepository } from "../repositories/base-repository";

type WithoutId<T> = Omit<T, "id">;
type PartialWithoutId<T> = Partial<Omit<T, "id">>;

export abstract class GenericCRUDService<
    T,
    R extends GenericCRUDRepository<T>
> {
    constructor(protected readonly repository: R) {}

    create(data: WithoutId<T>): Promise<T> {
        return this.repository.create(data);
    }

    getAll(): Promise<T[]> {
        return this.repository.findAll();
    }

    async getById(id: number): Promise<T | null> {
        const entity = await this.repository.findById(id);
        if (!entity) {
            throw new Error(`Entity with id ${id} not found`);
        }
        return entity;
    }

    async update(id: number, data: PartialWithoutId<T>): Promise<T> {
        await this.getById(id);
        return this.repository.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.repository.delete(id);
    }
}
