/* eslint-disable @typescript-eslint/no-empty-function */
export class ErrorHandler {
    public static invalidParametersMessage = 'Invalid params';
    public static internalServerErrorMessage = 'Internal server error';

    constructor() {}

    static validateStringParameter(parameter: string): void {
        if (parameter === null || parameter === undefined || !parameter.length || typeof parameter !== 'string')
            throw new Error(this.invalidParametersMessage);
    }

    static validateStringParameterReturningBool(parameter: string): boolean {
        if (parameter === null || parameter === undefined || !parameter.length || typeof parameter !== 'string')
            return false;

        return true;
    }

    static validateBooleanParameter(parameter: boolean): void {
        if (parameter === null || parameter === undefined || typeof parameter !== 'boolean')
            throw new Error(this.invalidParametersMessage);
    }

    static validateBooleanParameterReturningBool(parameter: boolean): boolean {
        if (parameter === null || parameter === undefined || typeof parameter !== 'boolean') return false;
        return true;
    }

    static validateNumberParameter(parameter: number): void {
        if (parameter === null || parameter === undefined || typeof parameter !== 'number')
            throw new Error(this.invalidParametersMessage);
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
