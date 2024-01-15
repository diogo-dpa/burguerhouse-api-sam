import { Prisma, User } from '@prisma/client';

export interface IPrismaUserRepository {
    getAll: () => Promise<User[]>;
    getById: (id: string) => Promise<User | null>;
    update: (id: string, updateData: Prisma.UserUpdateInput) => Promise<User>;
    create: (newData: Prisma.UserCreateInput) => Promise<User>;
    delete: (id: string) => Promise<void>;
}
