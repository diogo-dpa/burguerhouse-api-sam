import { SnackItemPrismaModel } from '../snackItem/SnackItemPrismaModel';

export class SnackPrismaModel {
    id: string;
    name: string;
    description: string;
    unitMoneyAmount: number;
    snackItems: SnackItemPrismaModel[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        _id: string,
        _name: string,
        _description: string,
        _snackItems: SnackItemPrismaModel[],
        _unitMoneyAmount: number,
        _createdAt: Date,
        _updatedAt: Date,
    ) {
        this.id = _id;
        this.name = _name;
        this.description = _description;
        this.snackItems = _snackItems;
        this.unitMoneyAmount = _unitMoneyAmount;
        this.createdAt = _createdAt;
        this.updatedAt = _updatedAt;
    }
}
