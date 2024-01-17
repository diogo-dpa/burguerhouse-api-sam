import { UserModel } from '../models/user/UserModel';

export interface IUserController {
    getAll: () => Promise<UserModel[]>;
    getById: (id: string) => Promise<UserModel | null>;
    update: (id: string, body: Partial<string>) => Promise<UserModel>;
    create: (body: string) => Promise<UserModel>;
    delete: (id: string) => Promise<void>;
}
