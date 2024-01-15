import { Prisma, User } from '@prisma/client';
import { UserCreateModel } from '../models/user/UserCreateModel';
import { UserUpdateModel } from '../models/user/UserUpdateModel';
import { UserModel } from '../models/user/UserModel';

export class UserDto {
    static convertUserCreateModelToPrismaModel(user: UserCreateModel): Prisma.UserCreateInput {
        return {
            email: user.email,
            name: user.name,
            isEmployee: user.isEmployee,
        };
    }

    static convertUserUpdateModelToPrismaModel(user: UserUpdateModel): Prisma.UserUpdateInput {
        return {
            name: user.name,
            isEmployee: user.isEmployee,
        };
    }

    static convertPrismaModelToUserModel(user: User | null): UserModel {
        if (!user) return {} as UserModel;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isEmployee: user.isEmployee,
            createdAt: user.createdAt,
            orders: [],
        };
    }

    static convertPrismaModelArrayToUserModelArray(users: User[]): UserModel[] {
        return users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            isEmployee: u.isEmployee,
            createdAt: u.createdAt,
            orders: [],
        }));
    }
}
