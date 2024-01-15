import { Prisma, Snacks } from '@prisma/client';

export interface IPrismaSnacksRepository {
    getAll: () => Promise<Snacks[]>;
    getById: (id: string) => Promise<Snacks | null>;
    update: (id: string, updateData: Prisma.SnacksUpdateInput) => Promise<Snacks>;
    create: (newData: Prisma.SnacksCreateInput) => Promise<Snacks>;
    delete: (id: string) => Promise<void>;
}
