import { Prisma } from '@prisma/client';
import { UserCreateModel } from '../models/user/UserCreateModel';
import { UserUpdateModel } from '../models/user/UserUpdateModel';
import { UserResponseModel } from '../models/user/UserResponseModel';
import { UserPrismaModel } from '../models/user/UserPrismaModel';
import { OrderDto } from './OrderDto';

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
            email: user.email,
            isEmployee: user.isEmployee,
        };
    }

    static convertPrismaModelToUserModel(user: UserPrismaModel | null): UserResponseModel {
        if (!user) return {} as UserResponseModel;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isEmployee: user.isEmployee,
            orders: !!user.orders?.length ? OrderDto.convertPrismaModelArrayToMenuModelArray(user.orders) : [],
        };
    }

    static convertPrismaModelArrayToUserModelArray(users: UserPrismaModel[]): UserResponseModel[] {
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            isEmployee: user.isEmployee,
            orders: !!user.orders?.length ? OrderDto.convertPrismaModelArrayToMenuModelArray(user.orders) : [],
        }));
    }
}
