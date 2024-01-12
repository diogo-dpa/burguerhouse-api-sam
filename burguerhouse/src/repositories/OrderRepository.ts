import { OrderEntity } from '../entities/OrderEntity';
import { IBaseRepository } from '../irepositories/IBaseRepository';

export class OrderRepository implements IBaseRepository<OrderEntity> {
    async getAll(): Promise<OrderEntity[]> {
        return Promise.resolve([] as OrderEntity[]);
    }

    async getById(id: number): Promise<OrderEntity | null> {
        console.log({ id });
        return Promise.resolve({} as OrderEntity);
    }

    async update(id: number, updateData: Partial<OrderEntity>): Promise<OrderEntity> {
        console.log({ id, updateData });
        return Promise.resolve({} as OrderEntity);
    }

    async create(newData: OrderEntity): Promise<OrderEntity> {
        console.log({ newData });
        return Promise.resolve({} as OrderEntity);
    }

    async delete(id: number): Promise<void> {
        console.log({ id });
    }
}
