export class MenuItemResponseModel {
    id: string;
    menuId: string;
    snackId?: string;
    ingredientId?: string;

    constructor(_id: string, _menuId: string, _snackId: string, _ingredientId: string) {
        this.id = _id;
        this.menuId = _menuId;
        this.snackId = _snackId;
        this.ingredientId = _ingredientId;
    }
}
