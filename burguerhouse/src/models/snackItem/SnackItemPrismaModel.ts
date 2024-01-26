import { IngredientPrismaModel } from '../ingredient/IngredienPrismaModel';

export class SnackItemPrismaModel {
    id: string;
    snackId: string;
    ingredientAmount: number;
    ingredientId?: string;
    ingredient?: IngredientPrismaModel;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _snackId: string,
        _ingredientAmount: number,
        _ingredientId: string,
        _ingredient: IngredientPrismaModel,
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        this.id = _id;
        this.snackId = _snackId;
        this.ingredientAmount = _ingredientAmount;
        this.ingredientId = _ingredientId;
        this.ingredient = _ingredient;
        this.createdAt = _createdAt;
        this.updatedAt = _updatedAt;
    }
}
