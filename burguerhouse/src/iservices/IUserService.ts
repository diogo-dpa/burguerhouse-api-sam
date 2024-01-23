import { UserCreateModel } from '../models/user/UserCreateModel';
import { UserResponseModel } from '../models/user/UserResponseModel';
import { UserUpdateModel } from '../models/user/UserUpdateModel';
import { JsonAPIQueryOptions } from '../utils/jsonapi/typesJsonapi';

export interface IUserService {
    createUser: (newUser: UserCreateModel) => Promise<UserResponseModel>;
    updateUser: (userId: string, newUser: UserUpdateModel) => Promise<UserResponseModel>;
    getAllUsers: (queryOptions?: JsonAPIQueryOptions) => Promise<UserResponseModel[]>;
    getUserById: (userId: string, queryOptions?: JsonAPIQueryOptions) => Promise<UserResponseModel | null>;
    deleteUserById: (userId: string) => Promise<void>;
}
