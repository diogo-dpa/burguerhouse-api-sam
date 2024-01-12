import { IngredientsEntity } from '../entities/IngredientsEntity';
import { IBaseRepository } from '../irepositories/IBaseRepository';

export class IngredientsRepository implements IBaseRepository<IngredientsEntity> {
    async getAll(): Promise<IngredientsEntity[]> {
        return Promise.resolve([] as IngredientsEntity[]);
    }

    async getById(id: number): Promise<IngredientsEntity | null> {
        console.log({ id });
        return Promise.resolve({} as IngredientsEntity);
    }

    async update(id: number, updateData: Partial<IngredientsEntity>): Promise<IngredientsEntity> {
        console.log({ id, updateData });
        return Promise.resolve({} as IngredientsEntity);
    }

    async create(newData: IngredientsEntity): Promise<IngredientsEntity> {
        console.log({ newData });
        return Promise.resolve({} as IngredientsEntity);
    }

    async delete(id: number): Promise<void> {
        console.log({ id });
    }
}
