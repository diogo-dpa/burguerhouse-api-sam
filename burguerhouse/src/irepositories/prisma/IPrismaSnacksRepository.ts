import { Prisma } from '@prisma/client';
import { SnackCreateModel } from '../../models/snack/SnackCreateModel';
import { SnackPrismaModel } from '../../models/snack/SnackPrismaModel';

export interface IPrismaSnacksRepository {
    getAll: () => Promise<SnackPrismaModel[]>;
    getById: (id: string) => Promise<SnackPrismaModel | null>;
    update: (id: string, updateData: Prisma.SnacksUpdateInput) => Promise<SnackPrismaModel>;
    create: (newData: SnackCreateModel) => Promise<SnackPrismaModel>;
    delete: (id: string) => Promise<void>;
}
