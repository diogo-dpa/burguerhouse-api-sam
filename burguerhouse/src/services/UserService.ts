import { IUserService } from '../iservices/IUserService';
import { UserCreateModel } from '../models/user/UserCreateModel';
import { UserResponseModel } from '../models/user/UserResponseModel';
import { UserUpdateModel } from '../models/user/UserUpdateModel';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';
import { UserDto } from '../dtos/UserDto';
import { ErrorHandler } from '../utils/ErrorHandler';
import { JsonAPIQueryOptions } from '../utils/jsonapi/typesJsonapi';

export class UserService implements IUserService {
    private userRepository: PrismaUserRepository;

    constructor(_userRepository: PrismaUserRepository) {
        this.userRepository = _userRepository;
    }

    async createUser(newUser: UserCreateModel): Promise<UserResponseModel> {
        const existingUser = await this.userRepository.getByEmail(newUser.email);
        if (existingUser)
            throw new Error(ErrorHandler.returnBadRequestCustomError(ErrorHandler.existingUserEmailMessage));

        const user = UserDto.convertUserCreateModelToPrismaModel(newUser);
        const createdUser = await this.userRepository.create(user);

        return UserDto.convertPrismaModelToUserModel(createdUser);
    }

    async updateUser(userId: string, user: UserUpdateModel): Promise<UserResponseModel> {
        const foundUser = await this.userRepository.getById(userId);
        if (!foundUser) throw new Error(ErrorHandler.returnNotFoundCustomError(ErrorHandler.userNotFoundMessage));

        if (!!user.email) {
            const existingUser = await this.userRepository.getByEmail(user.email);
            if (existingUser)
                throw new Error(ErrorHandler.returnBadRequestCustomError(ErrorHandler.existingUserEmailMessage));
        }

        const formattedUser = UserDto.convertUserUpdateModelToPrismaModel(user);
        const updatedUser = await this.userRepository.update(userId, formattedUser);

        return UserDto.convertPrismaModelToUserModel(updatedUser);
    }

    async getAllUsers(queryOptions?: JsonAPIQueryOptions): Promise<UserResponseModel[]> {
        const { sort, include, page, fields } = queryOptions ?? {};

        const allUsers = await this.userRepository.getAll({ sort, include, page, fields });

        return UserDto.convertPrismaModelArrayToUserModelArray(allUsers);
    }

    async getUserById(userId: string, queryOptions?: JsonAPIQueryOptions): Promise<UserResponseModel | null> {
        const { sort, include, page, fields } = queryOptions ?? {};
        const foundUser = await this.userRepository.getById(userId, { sort, include, page, fields });

        return UserDto.convertPrismaModelToUserModel(foundUser);
    }

    async deleteUserById(userId: string): Promise<void> {
        const foundUser = await this.userRepository.getById(userId);

        if (!foundUser) throw new Error(ErrorHandler.returnNotFoundCustomError(ErrorHandler.userNotFoundMessage));

        await this.userRepository.delete(userId);
    }
}
