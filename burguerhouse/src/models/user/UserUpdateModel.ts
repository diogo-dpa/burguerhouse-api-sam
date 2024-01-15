export class UserUpdateModel {
    name: string;
    isEmployee: boolean;

    constructor(_name: string, _isEmployee: boolean) {
        this.name = _name;
        this.isEmployee = _isEmployee;
    }
}
