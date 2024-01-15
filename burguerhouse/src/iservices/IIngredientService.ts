import { IngredientCreateModel } from '../models/ingredient/IngredientCreateModel';
import { IngredientModel } from '../models/ingredient/IngredientModel';
import { IngredientUpdateModel } from '../models/ingredient/IngredientUpdateModel';

export interface IIngredientService {
    createIngredient: (newIngredient: IngredientCreateModel) => Promise<IngredientModel>;
    updateIngredient: (newIngredient: IngredientUpdateModel) => Promise<IngredientModel>;
    getAllIngredients: () => Promise<IngredientModel[]>;
    getIngredientById: (IngredientId: string) => Promise<IngredientModel>;
    deleteIngredientById: (IngredientId: string) => Promise<void>;
}
