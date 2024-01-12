import { MenusEntity } from '../entities/MenusEntity';
import { IBaseRepository } from '../irepositories/IBaseRepository';

export class MenusRepository implements IBaseRepository<MenusEntity> {
    async getAll(): Promise<MenusEntity[]> {
        return Promise.resolve([] as MenusEntity[]);
    }

    async getById(id: number): Promise<MenusEntity | null> {
        console.log({ id });
        return Promise.resolve({} as MenusEntity);
    }

    async update(id: number, updateData: Partial<MenusEntity>): Promise<MenusEntity> {
        console.log({ id, updateData });
        return Promise.resolve({} as MenusEntity);
    }

    async create(newData: MenusEntity): Promise<MenusEntity> {
        console.log({ newData });
        return Promise.resolve({} as MenusEntity);
    }

    async delete(id: number): Promise<void> {
        console.log({ id });
    }
}
