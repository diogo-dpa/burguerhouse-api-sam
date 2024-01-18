import { SnackResponseModel } from '../models/snack/SnackResponseModel';

export interface ISnackController {
    getAll: () => Promise<SnackResponseModel[]>;
    getById: (id: string) => Promise<SnackResponseModel | null>;
    update: (id: string, body: string) => Promise<SnackResponseModel>;
    create: (body: string) => Promise<SnackResponseModel>;
    delete: (id: string) => Promise<void>;
}
