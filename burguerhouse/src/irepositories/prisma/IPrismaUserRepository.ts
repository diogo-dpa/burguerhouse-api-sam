import { Prisma } from '@prisma/client';
import { UserPrismaModel } from '../../models/user/UserPrismaModel';
import { JsonAPIQueryOptions } from '../../utils/jsonapi/typesJsonapi';

export interface IPrismaUserRepository {
    getAll: (queryOptions?: JsonAPIQueryOptions) => Promise<UserPrismaModel[]>;
    getById: (id: string, queryOptions?: JsonAPIQueryOptions) => Promise<UserPrismaModel | null>;
    update: (id: string, updateData: Prisma.UserUpdateInput) => Promise<UserPrismaModel>;
    create: (newData: Prisma.UserCreateInput) => Promise<UserPrismaModel>;
    delete: (id: string) => Promise<void>;
}
