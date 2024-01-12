import { BaseEntity } from './BaseEntity';

export class SnacksEntity extends BaseEntity {
    public name: string;
    public unitMoneyAmount: number;
    public description: string;

    constructor(_id: number, _name: string, _unitMoneyAmount: number, _description: string) {
        super(_id);
        this.name = _name;
        this.unitMoneyAmount = _unitMoneyAmount;
        this.description = _description;
    }
}
