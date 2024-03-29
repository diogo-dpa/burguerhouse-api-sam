import { StatusCodeEnum } from './commonEnums';

/* eslint-disable @typescript-eslint/no-empty-function */
export class ErrorHandler {
    public static invalidParametersMessage = 'Invalid params';
    public static ingredientNotFoundMessage = 'Ingredient not found';
    public static existingIngredientNameMessage = 'Existing ingredient name';
    public static menuNotFoundMessage = 'Menu not found';
    public static snackNotFoundMessage = 'Snack not found';
    public static userNotFoundMessage = 'User not found';
    public static existingUserEmailMessage = 'Existing user email';
    public static internalServerErrorMessage = 'Internal server error';
    public static insufficientIngredientAmountMessage = 'Available ingredient amount is insufficient';

    static returnNotFoundCustomError(message: string): string {
        return `${StatusCodeEnum.notFound} - ${message}`;
    }

    static returnBadRequestCustomError(message: string): string {
        return `${StatusCodeEnum.badRequest} - ${message}`;
    }

    static validateStringIdReturningBool(idParameter: string): boolean {
        if (!this.validateStringParameterReturningBool(idParameter)) return false;

        if (!isNaN(parseFloat(idParameter))) return false;

        return true;
    }

    static validateStringParameterReturningBool(parameter?: string | null): boolean {
        if (parameter === null || parameter === undefined || !parameter.length || typeof parameter !== 'string')
            return false;

        return true;
    }

    static validateBooleanParameterReturningBool(parameter?: boolean | null): boolean {
        if (parameter === null || parameter === undefined || typeof parameter !== 'boolean') return false;
        return true;
    }

    static validateNumberParameterReturningBool(parameter?: number): boolean {
        if (parameter === null || parameter === undefined || typeof parameter !== 'number') return false;

        return true;
    }
}
