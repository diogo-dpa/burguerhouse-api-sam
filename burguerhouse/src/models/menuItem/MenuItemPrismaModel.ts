export class MenuItemPrismaModel {
    id: string;
    menuId: string;
    snackId?: string;
    ingredientId?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _menuId: string,
        _snackId: string,
        _ingredientId: string,
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        this.id = _id;
        this.menuId = _menuId;
        this.snackId = _snackId;
        this.ingredientId = _ingredientId;
        this.createdAt = _createdAt;
        this.updatedAt = _updatedAt;
    }
}
