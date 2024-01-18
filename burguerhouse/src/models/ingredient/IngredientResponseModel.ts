export class IngredientResponseModel {
    id: string;
    name: string;
    unitMoneyAmount: number;
    availableAmount: number;

    constructor(_id: string, _name: string, _unitMoneyAmount: number, _availableAmount: number) {
        this.id = _id;
        this.name = _name;
        this.unitMoneyAmount = _unitMoneyAmount;
        this.availableAmount = _availableAmount;
    }
}
