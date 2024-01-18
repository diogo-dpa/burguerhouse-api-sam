import { UserResponseModel } from '../models/user/UserResponseModel';

export interface IUserController {
    getAll: () => Promise<UserResponseModel[]>;
    getById: (id: string) => Promise<UserResponseModel | null>;
    update: (id: string, body: Partial<string>) => Promise<UserResponseModel>;
    create: (body: string) => Promise<UserResponseModel>;
    delete: (id: string) => Promise<void>;
}
