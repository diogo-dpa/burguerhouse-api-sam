import { Prisma, Snacks } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { IPrismaSnacksRepository } from '../../irepositories/prisma/IPrismaSnacksRepository';

export class PrismaSnacksRepository implements IPrismaSnacksRepository {
    async getAll(): Promise<Snacks[]> {
        return await prisma.snacks.findMany({
            include: {
                snackItems: true,
            },
        });
    }

    async getById(id: string): Promise<Snacks | null> {
        const userFound = await prisma.snacks.findUnique({
            where: {
                id,
            },
            include: {
                snackItems: true,
            },
        });

        return userFound;
    }

    async update(id: string, updateData: Prisma.SnacksUpdateInput): Promise<Snacks> {
        const updatedUser = await prisma.snacks.update({
            where: {
                id,
            },
            data: { ...updateData },
            include: {
                snackItems: true,
            },
        });

        return updatedUser;
    }

    async create(newData: Prisma.SnacksCreateInput): Promise<Snacks> {
        const createdUser = await prisma.snacks.create({
            data: {
                ...newData,
            },
            include: {
                snackItems: true,
            },
        });

        return createdUser;
    }

    async delete(id: string): Promise<void> {
        await prisma.snacks.delete({
            where: {
                id,
            },
        });
    }
}
