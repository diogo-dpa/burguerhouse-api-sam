import { UserCreateModel } from '../models/user/UserCreateModel';
import { UserModel } from '../models/user/UserModel';
import { UserUpdateModel } from '../models/user/UserUpdateModel';

export interface IUserService {
    createUser: (newUser: UserCreateModel) => Promise<UserModel>;
    updateUser: (userId: string, newUser: UserUpdateModel) => Promise<UserModel>;
    getAllUsers: () => Promise<UserModel[]>;
    getUserById: (userId: string) => Promise<UserModel | null>;
    deleteUserById: (userId: string) => Promise<void>;
}
