import { IngredientModel } from '../models/ingredient/IngredientModel';

export interface IIngredientController {
    getAll: () => Promise<IngredientModel[]>;
    getById: (id: string) => Promise<IngredientModel | null>;
    update: (id: string, body: string) => Promise<IngredientModel>;
    create: (body: string) => Promise<IngredientModel>;
    delete: (id: string) => Promise<void>;
}
