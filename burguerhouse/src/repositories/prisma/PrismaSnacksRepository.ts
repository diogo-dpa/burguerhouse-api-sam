import { prisma } from '../../lib/prisma';
import { IPrismaSnacksRepository } from '../../irepositories/prisma/IPrismaSnacksRepository';
import { SnackCreateModel } from '../../models/snack/SnackCreateModel';
import { SnackPrismaModel } from '../../models/snack/SnackPrismaModel';
import { SnackUpdateModel } from '../../models/snack/SnackUpdateModel';
import { JsonAPIQueryOptions } from '../../utils/jsonapi/typesJsonapi';

export class PrismaSnacksRepository implements IPrismaSnacksRepository {
    private defaultInclude = { snackItems: true };

    async getAll(queryOptions?: JsonAPIQueryOptions): Promise<SnackPrismaModel[]> {
        const { sort, include } = queryOptions ?? {};

        const snacks = await prisma.snacks.findMany({
            orderBy: [...(sort ?? [])],
            include: {
                ...(include ?? this.defaultInclude),
            },
        });

        return snacks.map((snack) => ({
            ...snack,
            unitMoneyAmount: Number(snack.unitMoneyAmount),
        })) as SnackPrismaModel[];
    }

    async getById(id: string, queryOptions?: JsonAPIQueryOptions): Promise<SnackPrismaModel | null> {
        const { include } = queryOptions ?? {};

        const snackFound = await prisma.snacks.findUnique({
            where: {
                id,
            },
            include: {
                ...(include ?? this.defaultInclude),
            },
        });

        if (!snackFound) return null;

        return { ...snackFound, unitMoneyAmount: Number(snackFound?.unitMoneyAmount) } as SnackPrismaModel;
    }

    async getByName(name: string): Promise<SnackPrismaModel | null> {
        const snackFound = await prisma.snacks.findUnique({
            where: {
                name,
            },
        });

        if (!snackFound) return null;

        return { ...snackFound, unitMoneyAmount: Number(snackFound?.unitMoneyAmount) } as SnackPrismaModel;
    }

    async update(id: string, updateData: SnackUpdateModel): Promise<SnackPrismaModel> {
        const updatedSnack = await prisma.snacks.update({
            include: {
                ...this.defaultInclude,
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
                ...this.defaultInclude,
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
