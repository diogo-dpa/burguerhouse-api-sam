import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { IPrismaUserRepository } from '../../irepositories/prisma/IPrismaUserRepository';
import { UserPrismaModel } from '../../models/user/UserPrismaModel';
import { OrderPrismaModel } from '../../models/order/OrderPrismaModel';
import { JsonAPIQueryOptions } from '../../utils/jsonapi/typesJsonapi';

export class PrismaUserRepository implements IPrismaUserRepository {
    async getAll(queryOptions?: JsonAPIQueryOptions): Promise<UserPrismaModel[]> {
        const { sort, include } = queryOptions ?? {};
        const allUsers = await prisma.user.findMany({
            orderBy: [...(sort ?? [])],
            include: {
                ...(include ?? {}),
            },
        });

        return allUsers.map((user) => ({
            ...user,
            orders:
                (user?.orders?.map((order) => ({
                    ...order,
                    totalPrice: Number(order.totalPrice),
                })) as OrderPrismaModel[]) ?? [],
        }));
    }

    async getById(id: string, queryOptions?: JsonAPIQueryOptions): Promise<UserPrismaModel | null> {
        const { include } = queryOptions ?? {};

        const userFound = await prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                ...(include ?? {}),
            },
        });

        if (!userFound) return null;

        return {
            ...userFound,
            orders:
                (userFound?.orders?.map((order) => ({
                    ...order,
                    totalPrice: Number(order.totalPrice),
                })) as OrderPrismaModel[]) ?? [],
        };
    }

    async getByEmail(email: string): Promise<UserPrismaModel | null> {
        const userFound = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!userFound) return null;

        return {
            ...userFound,
        };
    }

    async update(id: string, updateData: Prisma.UserUpdateInput): Promise<UserPrismaModel> {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: { ...updateData },
        });

        return updatedUser;
    }

    async create(newData: Prisma.UserCreateInput): Promise<UserPrismaModel> {
        const createdUser = await prisma.user.create({
            data: {
                ...newData,
            },
        });

        return createdUser;
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: {
                id,
            },
        });
    }
}
