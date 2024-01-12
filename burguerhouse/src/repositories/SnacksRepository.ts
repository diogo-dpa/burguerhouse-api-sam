import { SnacksEntity } from '../entities/SnacksEntity';
import { IBaseRepository } from '../irepositories/IBaseRepository';

export class SnacksRepository implements IBaseRepository<SnacksEntity> {
    async getAll(): Promise<SnacksEntity[]> {
        return Promise.resolve([] as SnacksEntity[]);
    }

    async getById(id: number): Promise<SnacksEntity | null> {
        console.log({ id });
        return Promise.resolve({} as SnacksEntity);
    }

    async update(id: number, updateData: Partial<SnacksEntity>): Promise<SnacksEntity> {
        console.log({ id, updateData });
        return Promise.resolve({} as SnacksEntity);
    }

    async create(newData: SnacksEntity): Promise<SnacksEntity> {
        console.log({ newData });
        return Promise.resolve({} as SnacksEntity);
    }

    async delete(id: number): Promise<void> {
        console.log({ id });
    }
}
