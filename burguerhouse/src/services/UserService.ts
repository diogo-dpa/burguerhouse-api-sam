import { IUserService } from '../iservices/IUserService';
import { UserCreateModel } from '../models/user/UserCreateModel';
import { UserModel } from '../models/user/UserModel';
import { UserUpdateModel } from '../models/user/UserUpdateModel';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';
import { UserDto } from '../dtos/UserDto';
import { ERROR_MESSAGE_INVALID_PARAMS } from '../utils/errorsConstants';

export class UserService implements IUserService {
    private userRepository: PrismaUserRepository;

    constructor(_userRepository: PrismaUserRepository) {
        this.userRepository = _userRepository;
    }

    async createUser(newUser: UserCreateModel): Promise<UserModel> {
        if (!newUser || !Object.keys(newUser).length) throw new Error(ERROR_MESSAGE_INVALID_PARAMS);

        const user = UserDto.convertUserCreateModelToPrismaModel(newUser);
        const createdUser = await this.userRepository.create(user);

        return UserDto.convertPrismaModelToUserModel(createdUser);
    }

    async updateUser(userId: string, user: UserUpdateModel): Promise<UserModel> {
        if (!userId || !Object.keys(user).length) throw new Error(ERROR_MESSAGE_INVALID_PARAMS);

        const formattedUser = UserDto.convertUserUpdateModelToPrismaModel(user);
        const updatedUser = await this.userRepository.update(userId, formattedUser);

        return UserDto.convertPrismaModelToUserModel(updatedUser);
    }

    async getAllUsers(): Promise<UserModel[]> {
        const allUsers = await this.userRepository.getAll();

        return UserDto.convertPrismaModelArrayToUserModelArray(allUsers);
    }

    async getUserById(userId: string): Promise<UserModel | null> {
        if (!userId) throw new Error(ERROR_MESSAGE_INVALID_PARAMS);

        const foundUser = await this.userRepository.getById(userId);

        return UserDto.convertPrismaModelToUserModel(foundUser);
    }

    async deleteUserById(userId: string): Promise<void> {
        if (!userId) throw new Error(ERROR_MESSAGE_INVALID_PARAMS);

        await this.userRepository.delete(userId);
    }
}
