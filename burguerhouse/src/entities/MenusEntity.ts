import { BaseEntity } from './BaseEntity';

export class MenusEntity extends BaseEntity {
    public name: string;
    public description: string;

    constructor(_id: number, _name: string, _description: string) {
        super(_id);
        this.name = _name;
        this.description = _description;
    }
}
