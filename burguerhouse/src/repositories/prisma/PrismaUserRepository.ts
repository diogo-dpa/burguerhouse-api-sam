import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { IPrismaUserRepository } from '../../irepositories/prisma/IPrismaUserRepository';
import { UserPrismaModel } from '../../models/user/UserPrismaModel';

export class PrismaUserRepository implements IPrismaUserRepository {
    async getAll(): Promise<UserPrismaModel[]> {
        return await prisma.user.findMany();
    }

    async getById(id: string): Promise<UserPrismaModel | null> {
        const userFound = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        return userFound;
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
