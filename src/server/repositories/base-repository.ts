type WithoutId<T> = Omit<T, "id">;
type PartialWithoutId<T> = Partial<Omit<T, "id">>;

export abstract class BaseRepository<T> {
    constructor(protected readonly model: any) {}

    create(data: WithoutId<T>): Promise<T> {
        return this.model.create({ data });
    }

    findAll(): Promise<T[]> {
        return this.model.findMany();
    }

    findById(id: number): Promise<T | null> {
        return this.model.findUnique({ where: { id } });
    }

    update(id: number, data: PartialWithoutId<T>): Promise<T> {
        return this.model.update({ where: { id }, data });
    }

    delete(id: number): Promise<T> {
        return this.model.delete({ where: { id } });
    }
}
