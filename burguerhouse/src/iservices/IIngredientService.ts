import { IngredientCreateModel } from '../models/ingredient/IngredientCreateModel';
import { IngredientResponseModel } from '../models/ingredient/IngredientResponseModel';
import { IngredientUpdateModel } from '../models/ingredient/IngredientUpdateModel';
import { JsonAPIQueryOptions } from '../utils/jsonapi/typesJsonapi';

export interface IIngredientService {
    createIngredient: (newIngredient: IngredientCreateModel) => Promise<IngredientResponseModel>;
    updateIngredient: (ingredientId: string, newIngredient: IngredientUpdateModel) => Promise<IngredientResponseModel>;
    getAllIngredients: (queryOptions?: JsonAPIQueryOptions) => Promise<IngredientResponseModel[]>;
    getIngredientById: (ingredientId: string, queryOptions?: JsonAPIQueryOptions) => Promise<IngredientResponseModel>;
    deleteIngredientById: (ingredientId: string) => Promise<void>;
}
