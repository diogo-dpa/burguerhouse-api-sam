import { BaseEntity } from './BaseEntity';

export class SnackItemsEntity extends BaseEntity {
    public snackId: string;
    public ingredientId: string;
    public ingredientAmount: number;

    constructor(_id: number, _snackId: string, _ingredientId: string, _ingredientAmount: number) {
        super(_id);
        this.snackId = _snackId;
        this.ingredientId = _ingredientId;
        this.ingredientAmount = _ingredientAmount;
    }
}
