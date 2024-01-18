import { UserCreateModel } from '../models/user/UserCreateModel';
import { UserResponseModel } from '../models/user/UserResponseModel';
import { UserUpdateModel } from '../models/user/UserUpdateModel';

export interface IUserService {
    createUser: (newUser: UserCreateModel) => Promise<UserResponseModel>;
    updateUser: (userId: string, newUser: UserUpdateModel) => Promise<UserResponseModel>;
    getAllUsers: () => Promise<UserResponseModel[]>;
    getUserById: (userId: string) => Promise<UserResponseModel | null>;
    deleteUserById: (userId: string) => Promise<void>;
}
