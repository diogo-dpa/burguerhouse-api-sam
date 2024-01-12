import { BaseEntity } from './BaseEntity';

export class UserEntity extends BaseEntity {
    public name: string;
    public email: string;
    public isEmployee: boolean;

    constructor(_id: number, _name: string, _email: string, _isEmployee: boolean) {
        super(_id);
        this.name = _name;
        this.email = _email;
        this.isEmployee = _isEmployee;
    }
}
