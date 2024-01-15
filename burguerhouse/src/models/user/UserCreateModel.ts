export class UserCreateModel {
    name: string;
    email: string;
    isEmployee: boolean;

    constructor(_name: string, _email: string, _isEmployee: boolean) {
        this.name = _name;
        this.email = _email;
        this.isEmployee = _isEmployee;
    }
}
