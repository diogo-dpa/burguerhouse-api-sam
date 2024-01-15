import { Ingredients, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { IPrismaIngredientsRepository } from '../../irepositories/prisma/IPrismaIngredientsRepository';

export class PrismaIngredientsRepository implements IPrismaIngredientsRepository {
    async getAll(): Promise<Ingredients[]> {
        return await prisma.ingredients.findMany();
    }

    async getById(id: string): Promise<Ingredients | null> {
        const userFound = await prisma.ingredients.findUnique({
            where: {
                id,
            },
        });

        return userFound;
    }

    async update(id: string, updateData: Prisma.IngredientsUpdateInput): Promise<Ingredients> {
        const updatedUser = await prisma.ingredients.update({
            where: {
                id,
            },
            data: { ...updateData },
        });

        return updatedUser;
    }

    async create(newData: Prisma.IngredientsCreateInput): Promise<Ingredients> {
        const createdUser = await prisma.ingredients.create({
            data: {
                ...newData,
            },
        });

        return createdUser;
    }

    async delete(id: string): Promise<void> {
        await prisma.ingredients.delete({
            where: {
                id,
            },
        });
    }
}
