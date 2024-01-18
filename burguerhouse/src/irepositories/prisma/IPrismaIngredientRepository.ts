import { Prisma } from '@prisma/client';
import { IngredientPrismaModel } from '../../models/ingredient/IngredienPrismaModel';

export interface IPrismaIngredientRepository {
    getAll: () => Promise<IngredientPrismaModel[]>;
    getById: (id: string) => Promise<IngredientPrismaModel | null>;
    update: (id: string, updateData: Prisma.IngredientsUpdateInput) => Promise<IngredientPrismaModel>;
    create: (newData: Prisma.IngredientsCreateInput) => Promise<IngredientPrismaModel>;
    delete: (id: string) => Promise<void>;
}
