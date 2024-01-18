import { ISnackController } from '../icontrollers/ISnackController';
import { SnackResponseModel } from '../models/snack/SnackResponseModel';
import { SnackService } from '../services/SnackService';
import { ErrorHandler } from '../utils/ErrorHandler';

export class SnackController implements ISnackController {
    private snackService: SnackService;

    constructor(_snackService: SnackService) {
        this.snackService = _snackService;
    }

    async getAll(): Promise<SnackResponseModel[]> {
        try {
            const snacks = await this.snackService.getAllSnacks();
            return snacks;
        } catch (error: any) {
            return error.message;
        }
    }

    async getById(id: string): Promise<SnackResponseModel | null> {
        try {
            const snack = await this.snackService.getSnackById(id);
            return snack;
        } catch (error: any) {
            return error.message;
        }
    }

    async update(id: string, body: string): Promise<SnackResponseModel> {
        try {
            const { description, unitMoneyAmount, snackItems } = JSON.parse(body);

            if (
                (!ErrorHandler.validateStringParameterReturningBool(description) &&
                    !ErrorHandler.validateNumberParameterReturningBool(unitMoneyAmount)) ||
                !snackItems ||
                !Array.isArray(snackItems) ||
                snackItems.length === 0
            )
                throw new Error('Invalid parameters');

            const snack = await this.snackService.updateSnack(id, {
                description,
                unitMoneyAmount,
                snackItems,
            });
            return snack;
        } catch (error: any) {
            return error.message;
        }
    }

    async create(body: string): Promise<SnackResponseModel> {
        try {
            const { name, description, unitMoneyAmount, snackItems } = JSON.parse(body);

            if (
                !ErrorHandler.validateStringParameterReturningBool(name) ||
                !ErrorHandler.validateStringParameterReturningBool(description) ||
                !ErrorHandler.validateNumberParameterReturningBool(unitMoneyAmount) ||
                !snackItems ||
                !Array.isArray(snackItems) ||
                snackItems.length === 0
            )
                throw new Error(ErrorHandler.invalidParametersMessage);

            const snack = await this.snackService.createSnack({
                name,
                description,
                unitMoneyAmount,
                snackItems,
            });
            return snack;
        } catch (error: any) {
            return error.message;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.snackService.deleteSnackById(id);
        } catch (error: any) {
            return error.message;
        }
    }
}
