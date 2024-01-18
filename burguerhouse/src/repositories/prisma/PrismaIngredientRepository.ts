import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { IPrismaIngredientRepository } from '../../irepositories/prisma/IPrismaIngredientRepository';
import { IngredientPrismaModel } from '../../models/ingredient/IngredienPrismaModel';

export class PrismaIngredientRepository implements IPrismaIngredientRepository {
    async getAll(): Promise<IngredientPrismaModel[]> {
        const ingredients = await prisma.ingredients.findMany();
        return ingredients.map((ingredient) => ({
            ...ingredient,
            unitMoneyAmount: Number(ingredient.unitMoneyAmount),
        }));
    }

    async getById(id: string): Promise<IngredientPrismaModel | null> {
        const ingredient = await prisma.ingredients.findUnique({
            where: {
                id,
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
