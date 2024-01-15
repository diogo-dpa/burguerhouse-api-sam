import { UserModel } from '../models/user/UserModel';

export interface IUserController {
    getAll: () => Promise<UserModel[]>;
    getById: (id: string) => Promise<UserModel | null>;
    update: (id: string, body: Partial<any>) => Promise<UserModel>;
    create: (body: any) => Promise<UserModel>;
    delete: (id: string) => Promise<void>;
}
