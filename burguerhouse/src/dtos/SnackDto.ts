import { Prisma, Snacks } from '@prisma/client';
import { SnackResponseModel } from '../models/snack/SnackResponseModel';
import { SnackUpdateModel } from '../models/snack/SnackUpdateModel';
import { SnackPrismaModel } from '../models/snack/SnackPrismaModel';

export class SnackDto {
    static convertSnackCreateModelToPrismaModel(snack: SnackPrismaModel | null): SnackResponseModel {
        if (snack === null) return {} as SnackResponseModel;

        return {
            id: snack.id,
            name: snack.name,
            description: snack.description,
            unitMoneyAmount: Number(snack.unitMoneyAmount),
            snackItems: snack.snackItems,
        };
    }

    static convertSnackUpdateModelToPrismaModel(snack: SnackUpdateModel): Prisma.SnacksUpdateInput {
        return {
            description: snack.description,
            unitMoneyAmount: Number(snack.unitMoneyAmount),
        };
    }

    static convertPrismaModelToSnackModel(snack: SnackPrismaModel | null): SnackResponseModel {
        if (snack === null) return {} as SnackResponseModel;

        return {
            id: snack.id,
            name: snack.name,
            description: snack.description,
            unitMoneyAmount: Number(snack.unitMoneyAmount),
            snackItems: snack.snackItems,
        };
    }

    static convertPrismaModelArrayToSnackModelArray(snacks: SnackPrismaModel[] | null): SnackResponseModel[] {
        if (snacks === null) return [] as SnackResponseModel[];

        return snacks.map((snack) => ({
            id: snack.id,
            name: snack.name,
            description: snack.description,
            unitMoneyAmount: Number(snack.unitMoneyAmount),
            snackItems: snack.snackItems,
        }));
    }
}
