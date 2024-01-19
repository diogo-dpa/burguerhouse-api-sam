import { IngredientPrismaModel } from '../ingredient/IngredienPrismaModel';
import { SnackPrismaModel } from '../snack/SnackPrismaModel';

export class MenuItemPrismaModel {
    id: string;
    menuId: string;
    snackId: string | null;
    snack: SnackPrismaModel | null;
    ingredientId: string | null;
    ingredient: IngredientPrismaModel | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _menuId: string,
        _snackId: string | null,
        snack: SnackPrismaModel | null,
        _ingredientId: string | null,
        _ingredient: IngredientPrismaModel | null,
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        this.id = _id;
        this.menuId = _menuId;
        this.snackId = _snackId;
        this.snack = snack;
        this.ingredientId = _ingredientId;
        this.ingredient = _ingredient;
        this.createdAt = _createdAt;
        this.updatedAt = _updatedAt;
    }
}
