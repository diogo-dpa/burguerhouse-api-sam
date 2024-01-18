import { IngredientCreateModel } from '../models/ingredient/IngredientCreateModel';
import { IngredientModel } from '../models/ingredient/IngredientModel';
import { IngredientUpdateModel } from '../models/ingredient/IngredientUpdateModel';

export interface IIngredientService {
    createIngredient: (newIngredient: IngredientCreateModel) => Promise<IngredientModel>;
    updateIngredient: (ingredientId: string, newIngredient: IngredientUpdateModel) => Promise<IngredientModel>;
    getAllIngredients: () => Promise<IngredientModel[]>;
    getIngredientById: (ingredientId: string) => Promise<IngredientModel>;
    deleteIngredientById: (ingredientId: string) => Promise<void>;
}
