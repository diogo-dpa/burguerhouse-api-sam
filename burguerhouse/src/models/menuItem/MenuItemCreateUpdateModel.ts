export class MenuItemCreateUpdateModel {
    snackId?: string;
    ingredientId?: string;

    constructor(_snackId: string, _ingredientId: string) {
        this.snackId = _snackId;
        this.ingredientId = _ingredientId;
    }
}
