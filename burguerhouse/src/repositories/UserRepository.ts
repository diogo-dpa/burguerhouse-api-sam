import { UserEntity } from '../entities/UserEntity';
import { IBaseRepository } from '../irepositories/IBaseRepository';

export class UserRepository implements IBaseRepository<UserEntity> {
    async getAll(): Promise<UserEntity[]> {
        return Promise.resolve([] as UserEntity[]);
    }

    async getById(id: number): Promise<UserEntity | null> {
        console.log({ id });
        return Promise.resolve({} as UserEntity);
    }

    async update(id: number, updateData: Partial<UserEntity>): Promise<UserEntity> {
        console.log({ id, updateData });
        return Promise.resolve({} as UserEntity);
    }

    async create(newData: UserEntity): Promise<UserEntity> {
        console.log({ newData });
        return Promise.resolve({} as UserEntity);
    }

    async delete(id: number): Promise<void> {
        console.log({ id });
    }
}
