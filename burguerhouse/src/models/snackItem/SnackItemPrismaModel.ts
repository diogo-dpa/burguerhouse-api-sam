export class SnackItemPrismaModel {
    id: string;
    snackId: string;
    ingredientAmount: number;
    ingredientId?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _snackId: string,
        _ingredientAmount: number,
        _ingredientId: string,
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        this.id = _id;
        this.snackId = _snackId;
        this.ingredientAmount = _ingredientAmount;
        this.ingredientId = _ingredientId;
        this.createdAt = _createdAt;
        this.updatedAt = _updatedAt;
    }
}
