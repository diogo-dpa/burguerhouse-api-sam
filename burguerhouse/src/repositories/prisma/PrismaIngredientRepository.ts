import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { IPrismaIngredientRepository } from '../../irepositories/prisma/IPrismaIngredientRepository';
import { IngredientPrismaModel } from '../../models/ingredient/IngredienPrismaModel';
import { JsonAPIQueryOptions } from '../../utils/jsonapi/typesJsonapi';

export class PrismaIngredientRepository implements IPrismaIngredientRepository {
    async getAll(queryOptions?: JsonAPIQueryOptions): Promise<IngredientPrismaModel[]> {
        const { sort, include } = queryOptions ?? {};
        const ingredients = await prisma.ingredients.findMany({
            orderBy: [...(sort ?? [])],
            include: {
                ...(include ?? {}),
            },
        });
        return ingredients.map((ingredient) => ({
            ...ingredient,
            unitMoneyAmount: Number(ingredient.unitMoneyAmount),
        }));
    }

    async getById(id: string, queryOptions?: JsonAPIQueryOptions): Promise<IngredientPrismaModel | null> {
        const { include } = queryOptions ?? {};
        const ingredient = await prisma.ingredients.findUnique({
            where: {
                id,
            },
            include: {
                ...(include ?? {}),
            },
        });

        if (!ingredient) return null;

        return { ...ingredient, unitMoneyAmount: Number(ingredient.unitMoneyAmount) };
    }

    async getByName(name: string): Promise<IngredientPrismaModel | null> {
        const ingredient = await prisma.ingredients.findUnique({
            where: {
                name,
            },
        });

        if (!ingredient) return null;

        return { ...ingredient, unitMoneyAmount: Number(ingredient.unitMoneyAmount) };
    }

    async update(id: string, updateData: Prisma.IngredientsUpdateInput): Promise<IngredientPrismaModel> {
        const updatedIngredient = await prisma.ingredients.update({
            where: {
                id,
            },
            data: { ...updateData },
        });

        return { ...updatedIngredient, unitMoneyAmount: Number(updatedIngredient.unitMoneyAmount) };
    }

    async create(newData: Prisma.IngredientsCreateInput): Promise<IngredientPrismaModel> {
        const createdingredient = await prisma.ingredients.create({
            data: {
                ...newData,
            },
        });

        return { ...createdingredient, unitMoneyAmount: Number(createdingredient.unitMoneyAmount) };
    }

    async delete(id: string): Promise<void> {
        await prisma.ingredients.delete({
            where: {
                id,
            },
        });
    }
}
