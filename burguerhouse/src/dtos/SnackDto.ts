import { SnackResponseModel } from '../models/snack/SnackResponseModel';
import { SnackPrismaModel } from '../models/snack/SnackPrismaModel';

export class SnackDto {
    static convertPrismaModelToSnackModel(snack: SnackPrismaModel | null): SnackResponseModel {
        if (snack === null) return {} as SnackResponseModel;

        return {
            id: snack.id,
            name: snack.name,
            description: snack.description,
            unitMoneyAmount: Number(snack.unitMoneyAmount),
            snackItems:
                snack.snackItems?.map((snackItem) => ({
                    id: snackItem.id,
                    ingredientId: snackItem.ingredientId,
                    ingredientAmount: snackItem.ingredientAmount,
                    ingredient: snackItem.ingredient,
                })) ?? [],
        };
    }

    static convertPrismaModelArrayToSnackModelArray(snacks: SnackPrismaModel[] | null): SnackResponseModel[] {
        if (snacks === null) return [] as SnackResponseModel[];

        return snacks.map((snack) => ({
            id: snack.id,
            name: snack.name,
            description: snack.description,
            unitMoneyAmount: Number(snack.unitMoneyAmount),
            snackItems:
                snack.snackItems?.map((snackItem) => ({
                    id: snackItem.id,
                    ingredientId: snackItem.ingredientId,
                    ingredientAmount: snackItem.ingredientAmount,
                    ingredient: snackItem.ingredient,
                })) ?? [],
        }));
    }
}
