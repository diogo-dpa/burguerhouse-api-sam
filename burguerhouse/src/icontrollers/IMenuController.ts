import { MenuResponseModel } from '../models/menu/MenuResponseModel';

export interface IMenuController {
    getAll: () => Promise<MenuResponseModel[]>;
    getById: (id: string) => Promise<MenuResponseModel | null>;
    update: (id: string, body: string) => Promise<MenuResponseModel>;
    create: (body: string) => Promise<MenuResponseModel>;
    delete: (id: string) => Promise<void>;
}
