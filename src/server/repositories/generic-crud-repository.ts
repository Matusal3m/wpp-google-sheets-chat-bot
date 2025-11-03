type WithoutId<T> = Omit<T, "id">;
type PartialWithoutId<T> = Partial<Omit<T, "id">>;

export abstract class GenericCRUDRepository<T extends Record<string, any>> {
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

    updateMany(identifier: string, data: T[]): Promise<T[]> {
        const promises = [];
        for (const datum of data) {
            const hasIdentifier = identifier in datum;
            if (hasIdentifier) continue;
            const where: any = {};
            where[identifier] = datum[identifier];
            delete datum[identifier];
            promises.push(this.model.update({ data: datum, where }));
        }
        return Promise.all(promises);
    }

    delete(id: number): Promise<T> {
        return this.model.delete({ where: { id } });
    }
}
