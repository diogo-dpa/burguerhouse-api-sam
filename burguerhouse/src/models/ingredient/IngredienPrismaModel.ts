export class IngredientPrismaModel {
    id: string;
    name: string;
    unitMoneyAmount: number;
    availableAmount: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _name: string,
        _unitMoneyAmount: number,
        _availableAmount: number,
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        this.id = _id;
        this.name = _name;
        this.unitMoneyAmount = _unitMoneyAmount;
        this.availableAmount = _availableAmount;
        this.createdAt = _createdAt;
        this.updatedAt = _updatedAt;
    }
}
