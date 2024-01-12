import { BaseEntity } from './BaseEntity';

export class IngredientsEntity extends BaseEntity {
    public name: string;
    public unitMoneyAmount: number;
    public availableAmount: number;

    constructor(_id: number, _name: string, _unitMoneyAmount: number, _availableAmount: number) {
        super(_id);
        this.name = _name;
        this.unitMoneyAmount = _unitMoneyAmount;
        this.availableAmount = _availableAmount;
    }
}
