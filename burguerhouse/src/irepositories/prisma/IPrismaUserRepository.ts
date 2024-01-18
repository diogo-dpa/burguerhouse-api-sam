import { Prisma } from '@prisma/client';
import { UserPrismaModel } from '../../models/user/UserPrismaModel';

export interface IPrismaUserRepository {
    getAll: () => Promise<UserPrismaModel[]>;
    getById: (id: string) => Promise<UserPrismaModel | null>;
    update: (id: string, updateData: Prisma.UserUpdateInput) => Promise<UserPrismaModel>;
    create: (newData: Prisma.UserCreateInput) => Promise<UserPrismaModel>;
    delete: (id: string) => Promise<void>;
}
