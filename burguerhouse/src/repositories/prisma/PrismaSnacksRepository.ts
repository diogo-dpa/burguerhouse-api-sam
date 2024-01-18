import { prisma } from '../../lib/prisma';
import { IPrismaSnacksRepository } from '../../irepositories/prisma/IPrismaSnacksRepository';
import { SnackCreateModel } from '../../models/snack/SnackCreateModel';
import { SnackPrismaModel } from '../../models/snack/SnackPrismaModel';
import { SnackUpdateModel } from '../../models/snack/SnackUpdateModel';

export class PrismaSnacksRepository implements IPrismaSnacksRepository {
    async getAll(): Promise<SnackPrismaModel[]> {
        const snacks = await prisma.snacks.findMany({
            include: {
                snackItems: {
                    include: {
                        ingredient: true,
                    },
                },
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
                snackItems: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });

        if (!snackFound) return null;

        return { ...snackFound, unitMoneyAmount: Number(snackFound?.unitMoneyAmount) };
    }

    async update(id: string, updateData: SnackUpdateModel): Promise<SnackPrismaModel> {
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
                description: updateData.description,
                unitMoneyAmount: updateData.unitMoneyAmount,
                snackItems: {
                    deleteMany: {},
                    create: updateData.snackItems?.map((snackItem) => ({
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
