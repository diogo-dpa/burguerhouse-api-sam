import { SnackDto } from '../dtos/SnackDto';
import { ISnackService } from '../iservices/ISnackService';
import { SnackCreateModel } from '../models/snack/SnackCreateModel';
import { SnackResponseModel } from '../models/snack/SnackResponseModel';
import { SnackUpdateModel } from '../models/snack/SnackUpdateModel';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';
import { ErrorHandler } from '../utils/ErrorHandler';

export class SnackService implements ISnackService {
    private snackRepository: PrismaSnacksRepository;
    private ingredientRepository: PrismaIngredientRepository;

    constructor(_snackRepository: PrismaSnacksRepository, _ingredientRepository: PrismaIngredientRepository) {
        this.snackRepository = _snackRepository;
        this.ingredientRepository = _ingredientRepository;
    }

    async createSnack(newSnack: SnackCreateModel): Promise<SnackResponseModel> {
        const { snackItems } = newSnack;

        const ingredientIdFromSnackItems = snackItems.map((ingredientSnackItem) => ingredientSnackItem.ingredientId);

        const ingredientPromise = ingredientIdFromSnackItems
            .filter((ingredientId) => !!ingredientId)
            .map((ingredientId) => this.ingredientRepository.getById(ingredientId ?? ''));

        const ingredients = await Promise.all([...ingredientPromise]);

        if (ingredients.some((ingredient) => ingredient === null))
            throw new Error(ErrorHandler.ingredientNouFoundMessage);

        const snack = await this.snackRepository.create(newSnack);
        return SnackDto.convertPrismaModelToSnackModel(snack);
    }

    async updateSnack(snackId: string, updateSnack: SnackUpdateModel): Promise<SnackResponseModel> {
        const snack = await this.snackRepository.update(snackId, updateSnack);
        return SnackDto.convertPrismaModelToSnackModel(snack);
    }

    async getAllSnacks(): Promise<SnackResponseModel[]> {
        const snacks = await this.snackRepository.getAll();
        return SnackDto.convertPrismaModelArrayToSnackModelArray(snacks);
    }

    async getSnackById(snackId: string): Promise<SnackResponseModel> {
        const snack = await this.snackRepository.getById(snackId);
        return SnackDto.convertPrismaModelToSnackModel(snack);
    }

    async deleteSnackById(snackId: string): Promise<void> {
        await this.snackRepository.delete(snackId);
    }
}
