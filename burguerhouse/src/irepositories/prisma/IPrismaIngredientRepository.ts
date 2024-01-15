import { Prisma, Ingredients } from '@prisma/client';

export interface IPrismaIngredientRepository {
    getAll: () => Promise<Ingredients[]>;
    getById: (id: string) => Promise<Ingredients | null>;
    update: (id: string, updateData: Prisma.IngredientsUpdateInput) => Promise<Ingredients>;
    create: (newData: Prisma.IngredientsCreateInput) => Promise<Ingredients>;
    delete: (id: string) => Promise<void>;
}
