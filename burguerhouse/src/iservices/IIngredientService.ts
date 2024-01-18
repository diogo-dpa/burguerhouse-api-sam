import { IngredientCreateModel } from '../models/ingredient/IngredientCreateModel';
import { IngredientResponseModel } from '../models/ingredient/IngredientResponseModel';
import { IngredientUpdateModel } from '../models/ingredient/IngredientUpdateModel';

export interface IIngredientService {
    createIngredient: (newIngredient: IngredientCreateModel) => Promise<IngredientResponseModel>;
    updateIngredient: (ingredientId: string, newIngredient: IngredientUpdateModel) => Promise<IngredientResponseModel>;
    getAllIngredients: () => Promise<IngredientResponseModel[]>;
    getIngredientById: (ingredientId: string) => Promise<IngredientResponseModel>;
    deleteIngredientById: (ingredientId: string) => Promise<void>;
}
