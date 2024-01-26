import { Prisma } from '@prisma/client';
import { IngredientPrismaModel } from '../../models/ingredient/IngredienPrismaModel';
import { JsonAPIQueryOptions } from '../../utils/jsonapi/typesJsonapi';

export interface IPrismaIngredientRepository {
    getAll: (queryOptions?: JsonAPIQueryOptions) => Promise<IngredientPrismaModel[]>;
    getById: (id: string, queryOptions?: JsonAPIQueryOptions) => Promise<IngredientPrismaModel | null>;
    getByName: (name: string) => Promise<IngredientPrismaModel | null>;
    update: (id: string, updateData: Prisma.IngredientsUpdateInput) => Promise<IngredientPrismaModel>;
    create: (newData: Prisma.IngredientsCreateInput) => Promise<IngredientPrismaModel>;
    delete: (id: string) => Promise<void>;
}
