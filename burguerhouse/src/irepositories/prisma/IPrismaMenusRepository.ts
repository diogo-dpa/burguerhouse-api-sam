import { Prisma, Menus } from '@prisma/client';

export interface IPrismaMenusRepository {
    getAll: () => Promise<Menus[]>;
    getById: (id: string) => Promise<Menus | null>;
    update: (id: string, updateData: Prisma.MenusUpdateInput) => Promise<Menus>;
    create: (newData: Prisma.MenusCreateInput) => Promise<Menus>;
    delete: (id: string) => Promise<void>;
}
