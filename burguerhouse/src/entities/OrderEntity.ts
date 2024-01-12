import { BaseEntity } from './BaseEntity';

export class OrderEntity extends BaseEntity {
    public userId: string;
    public totalPrice: number;
    public date: Date;

    constructor(_id: number, _userId: string, _totalPrice: number, _date: Date) {
        super(_id);
        this.userId = _userId;
        this.totalPrice = _totalPrice;
        this.date = _date;
    }
}
