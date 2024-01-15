import { Prisma, Ingredients } from '@prisma/client';

export interface IPrismaIngredientsRepository {
    getAll: () => Promise<Ingredients[]>;
    getById: (id: string) => Promise<Ingredients | null>;
    update: (id: string, updateData: Prisma.IngredientsUpdateInput) => Promise<Ingredients>;
    create: (newData: Prisma.IngredientsCreateInput) => Promise<Ingredients>;
    delete: (id: string) => Promise<void>;
}
