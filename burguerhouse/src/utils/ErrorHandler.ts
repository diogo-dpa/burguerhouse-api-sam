import { StatusCodeEnum } from './commonEnums';

/* eslint-disable @typescript-eslint/no-empty-function */
export class ErrorHandler {
    public static invalidParametersMessage = 'Invalid params';
    public static ingredientNotFoundMessage = 'Ingredient not found';
    public static snackNotFoundMessage = 'Snack not found';
    public static userNotFoundMessage = 'User not found';
    public static internalServerErrorMessage = 'Internal server error';
    public static insufficientIngredientAmountMessage = 'Available ingredient amount is insufficient';

    constructor() {}

    static returnNotFoundCustomError(message: string): string {
        return `${StatusCodeEnum.notFound} - ${message}`;
    }

    static validateStringParameter(parameter: string): void {
        if (parameter === null || parameter === undefined || !parameter.length || typeof parameter !== 'string')
            throw new Error(this.invalidParametersMessage);
    }

    static validateStringParameterReturningBool(parameter?: string | null): boolean {
        if (parameter === null || parameter === undefined || !parameter.length || typeof parameter !== 'string')
            return false;

        return true;
    }

    static validateBooleanParameter(parameter: boolean): void {
        if (parameter === null || parameter === undefined || typeof parameter !== 'boolean')
            throw new Error(this.invalidParametersMessage);
    }

    static validateBooleanParameterReturningBool(parameter?: boolean | null): boolean {
        if (parameter === null || parameter === undefined || typeof parameter !== 'boolean') return false;
        return true;
    }

    static validateNumberParameter(parameter: number): void {
        if (parameter === null || parameter === undefined || typeof parameter !== 'number')
            throw new Error(this.invalidParametersMessage);
    }

    static validateNumberParameterReturningBool(parameter: number): boolean {
        if (parameter === null || parameter === undefined || typeof parameter !== 'number') return false;

        return true;
    }

    static validateUnsedParameters(parameter: typeof Object) {
        if (!!Object.keys(parameter).length) throw new Error(this.invalidParametersMessage);
    }

    static internalServerErrorHandler(error: any): any {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `${this.internalServerErrorMessage}: ${error.message}`,
            }),
        };
    }
}
