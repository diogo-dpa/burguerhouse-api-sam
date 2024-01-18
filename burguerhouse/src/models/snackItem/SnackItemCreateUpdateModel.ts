export class SnackItemCreateUpdateModel {
    ingredientAmount: number;
    ingredientId?: string;

    constructor(_ingredientAmount: number, _ingredientId: string) {
        this.ingredientAmount = _ingredientAmount;
        this.ingredientId = _ingredientId;
    }
}
