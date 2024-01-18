import { SnackDto } from '../dtos/SnackDto';
import { ISnackService } from '../iservices/ISnackService';
import { SnackCreateModelWithIngredientIds } from '../models/snack/SnackCreateModelWithIngredientIds';
import { SnackResponseModel } from '../models/snack/SnackResponseModel';
import { SnackUpdateModel } from '../models/snack/SnackUpdateModel';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';

export class SnackService implements ISnackService {
    private snackRepository: PrismaSnacksRepository;
    private ingredientRepository: PrismaIngredientRepository;

    constructor(_snackRepository: PrismaSnacksRepository, _ingredientRepository: PrismaIngredientRepository) {
        this.snackRepository = _snackRepository;
        this.ingredientRepository = _ingredientRepository;
    }

    async createSnack(newSnack: SnackCreateModelWithIngredientIds): Promise<SnackResponseModel> {
        const { snackItems } = newSnack;

        const ingredientIdFromSnackItems = snackItems.map((ingredientSnackItem) => ingredientSnackItem.ingredient.id);

        const ingredientPromise = ingredientIdFromSnackItems.map((ingredientId) =>
            this.ingredientRepository.getById(ingredientId),
        );

        const ingredients = await Promise.all([...ingredientPromise]);

        if (ingredients.some((ingredient) => ingredient === null)) throw new Error('Ingredient not found');

        const snack = await this.snackRepository.create(newSnack);
        return SnackDto.convertPrismaModelToSnackModel(snack);
    }

    async updateSnack(snackId: string, newSnack: SnackUpdateModel): Promise<SnackResponseModel> {
        const formattedSnack = SnackDto.convertSnackUpdateModelToPrismaModel(newSnack);
        const snack = await this.snackRepository.update(snackId, formattedSnack);
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
