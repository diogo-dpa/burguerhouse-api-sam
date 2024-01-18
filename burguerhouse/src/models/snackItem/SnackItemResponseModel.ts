export class SnackItemResponseModel {
    id: string;
    snackId: string;
    ingredientAmount: number;
    ingredientId?: string;

    constructor(_id: string, _snackId: string, _ingredientAmount: number, _ingredientId: string) {
        this.id = _id;
        this.snackId = _snackId;
        this.ingredientAmount = _ingredientAmount;
        this.ingredientId = _ingredientId;
    }
}
