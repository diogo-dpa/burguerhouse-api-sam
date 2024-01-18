import { IngredientResponseModel } from '../models/ingredient/IngredientResponseModel';

export interface IIngredientController {
    getAll: () => Promise<IngredientResponseModel[]>;
    getById: (id: string) => Promise<IngredientResponseModel | null>;
    update: (id: string, body: string) => Promise<IngredientResponseModel>;
    create: (body: string) => Promise<IngredientResponseModel>;
    delete: (id: string) => Promise<void>;
}
