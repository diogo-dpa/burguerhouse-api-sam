import { Prisma } from '@prisma/client';
import { SnackCreateModelWithIngredientIds } from '../../models/snack/SnackCreateModelWithIngredientIds';
import { SnackPrismaModel } from '../../models/snack/SnackPrismaModel';

export interface IPrismaSnacksRepository {
    getAll: () => Promise<SnackPrismaModel[]>;
    getById: (id: string) => Promise<SnackPrismaModel | null>;
    update: (id: string, updateData: Prisma.SnacksUpdateInput) => Promise<SnackPrismaModel>;
    create: (newData: SnackCreateModelWithIngredientIds) => Promise<SnackPrismaModel>;
    delete: (id: string) => Promise<void>;
}
