import { Prisma, Order } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { IPrismaOrderRepository } from '../../irepositories/prisma/IPrismaOrderRepository';

export class PrismaOrderRepository implements IPrismaOrderRepository {
    async getAll(): Promise<Order[]> {
        return await prisma.order.findMany({
            include: {
                orderItems: true,
            },
        });
    }

    async getById(id: string): Promise<Order | null> {
        const userFound = await prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                orderItems: true,
            },
        });

        return userFound;
    }

    async create(newData: Prisma.OrderCreateInput): Promise<Order> {
        const createdUser = await prisma.order.create({
            data: {
                ...newData,
            },
            include: {
                orderItems: true,
            },
        });

        return createdUser;
    }
}
