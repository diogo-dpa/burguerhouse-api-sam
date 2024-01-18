import { IIngredientController } from '../icontrollers/IIngredientController';
import { IIngredientService } from '../iservices/IIngredientService';
import { IngredientModel } from '../models/ingredient/IngredientModel';
import { ErrorHandler } from '../utils/ErrorHandler';

export class IngredientController implements IIngredientController {
    private ingredientService: IIngredientService;

    constructor(_ingredientService: IIngredientService) {
        this.ingredientService = _ingredientService;
    }

    async getAll(): Promise<IngredientModel[]> {
        try {
            const ingredients = await this.ingredientService.getAllIngredients();
            return ingredients;
        } catch (error: any) {
            return error.message;
        }
    }

    async getById(id: string): Promise<IngredientModel | null> {
        try {
            ErrorHandler.validateStringParameter(id);
            const ingredient = await this.ingredientService.getIngredientById(id);
            return ingredient;
        } catch (error: any) {
            return error.message;
        }
    }

    async update(id: string, body: string): Promise<IngredientModel> {
        try {
            const { name, unitMoneyAmount, availableAmount } = JSON.parse(body);

            ErrorHandler.validateStringParameter(id);

            if (
                !ErrorHandler.validateStringParameterReturningBool(name) &&
                !ErrorHandler.validateNumberParameterReturningBool(Number(unitMoneyAmount)) &&
                !ErrorHandler.validateNumberParameterReturningBool(availableAmount)
            )
                throw new Error(ErrorHandler.invalidParametersMessage);

            const ingredient = await this.ingredientService.updateIngredient(id, {
                name,
                unitMoneyAmount,
                availableAmount,
            });
            return ingredient;
        } catch (error: any) {
            return error.message;
        }
    }

    async create(body: string): Promise<IngredientModel> {
        try {
            const { name, unitMoneyAmount, availableAmount } = JSON.parse(body);

            ErrorHandler.validateStringParameter(name);
            ErrorHandler.validateNumberParameter(availableAmount);
            ErrorHandler.validateNumberParameter(Number(unitMoneyAmount));

            const ingredient = await this.ingredientService.createIngredient({
                name,
                availableAmount,
                unitMoneyAmount,
            });
            return ingredient;
        } catch (error: any) {
            return error.message;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            ErrorHandler.validateStringParameter(id);
            await this.ingredientService.deleteIngredientById(id);
        } catch (error: any) {
            return error.message;
        }
    }
}
