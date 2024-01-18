import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { IPrismaSnacksRepository } from '../../irepositories/prisma/IPrismaSnacksRepository';
import { SnackCreateModel } from '../../models/snack/SnackCreateModel';
import { SnackPrismaModel } from '../../models/snack/SnackPrismaModel';

export class PrismaSnacksRepository implements IPrismaSnacksRepository {
    async getAll(): Promise<SnackPrismaModel[]> {
        const snacks = await prisma.snacks.findMany({
            include: {
                snackItems: true,
            },
        });

        return snacks.map((snack) => ({ ...snack, unitMoneyAmount: Number(snack.unitMoneyAmount) }));
    }

    async getById(id: string): Promise<SnackPrismaModel | null> {
        const snackFound = await prisma.snacks.findUnique({
            where: {
                id,
            },
            include: {
                snackItems: true,
            },
        });

        if (!snackFound) return null;

        return { ...snackFound, unitMoneyAmount: Number(snackFound?.unitMoneyAmount) };
    }

    async update(id: string, updateData: Prisma.SnacksUpdateInput): Promise<SnackPrismaModel> {
        const updatedSnack = await prisma.snacks.update({
            include: {
                snackItems: {
                    include: {
                        ingredient: true,
                    },
                },
            },
            where: {
                id,
            },
            data: {
                ...updateData,
            },
        });

        return { ...updatedSnack, unitMoneyAmount: Number(updatedSnack.unitMoneyAmount) };
    }

    async create(newData: SnackCreateModel): Promise<SnackPrismaModel> {
        const createdSnack = await prisma.snacks.create({
            include: {
                snackItems: {
                    include: {
                        ingredient: true,
                    },
                },
            },
            data: {
                name: newData.name,
                description: newData.description,
                unitMoneyAmount: newData.unitMoneyAmount,
                snackItems: {
                    create: newData.snackItems?.map((snackItem) => ({
                        ingredientAmount: snackItem.ingredientAmount,
                        ingredient: {
                            connect: {
                                id: snackItem.ingredientId,
                            },
                        },
                    })),
                },
            },
        });

        return { ...createdSnack, unitMoneyAmount: Number(createdSnack.unitMoneyAmount) };
    }

    async delete(id: string): Promise<void> {
        await prisma.snacks.delete({
            where: {
                id,
            },
        });
    }
}
