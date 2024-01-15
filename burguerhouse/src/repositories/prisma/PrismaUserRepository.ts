import { Prisma, User } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { IPrismaUserRepository } from '../../irepositories/prisma/IPrismaUserRepository';

export class PrismaUserRepository implements IPrismaUserRepository {
    async getAll(): Promise<User[]> {
        return await prisma.user.findMany();
    }

    async getById(id: string): Promise<User | null> {
        const userFound = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        return userFound;
    }

    async update(id: string, updateData: Prisma.UserUpdateInput): Promise<User> {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: { ...updateData },
        });

        return updatedUser;
    }

    async create(newData: Prisma.UserCreateInput): Promise<User> {
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
