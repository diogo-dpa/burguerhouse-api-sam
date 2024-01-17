import { IUserController } from '../icontrollers/IUserController';
import { UserModel } from '../models/user/UserModel';
import { UserService } from '../services/UserService';
import { ErrorHandler } from '../utils/ErrorHandler';

export class UserController implements IUserController {
    private userService: UserService;

    constructor(_userService: UserService) {
        this.userService = _userService;
    }

    async getAll(): Promise<UserModel[]> {
        try {
            const users = await this.userService.getAllUsers();
            return users;
        } catch (error: any) {
            return error.message;
        }
    }

    async getById(id: string): Promise<UserModel | null> {
        try {
            ErrorHandler.validateStringParameter(id);

            const user = await this.userService.getUserById(id);
            return user;
        } catch (error: any) {
            return error.message;
        }
    }

    async update(id: string, body: string): Promise<UserModel> {
        try {
            const { name, isEmployee } = JSON.parse(body);

            ErrorHandler.validateStringParameter(id);

            if (
                !ErrorHandler.validateStringParameterReturningBool(name) ||
                !ErrorHandler.validateBooleanParameterReturningBool(isEmployee)
            )
                throw new Error(ErrorHandler.invalidParametersMessage);

            const user = await this.userService.updateUser(id, { name, isEmployee });
            return user;
        } catch (error: any) {
            return error.message;
        }
    }

    async create(body: string): Promise<UserModel> {
        try {
            const { name, email, isEmployee } = JSON.parse(body);

            if (
                !ErrorHandler.validateStringParameterReturningBool(name) ||
                !ErrorHandler.validateStringParameterReturningBool(email) ||
                !ErrorHandler.validateBooleanParameterReturningBool(isEmployee)
            )
                throw new Error(ErrorHandler.invalidParametersMessage);

            const user = await this.userService.createUser({ name, email, isEmployee });
            return user;
        } catch (error: any) {
            return error.message;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            ErrorHandler.validateStringParameter(id);

            const user = await this.userService.deleteUserById(id);
            return user;
        } catch (error: any) {
            return error.message;
        }
    }
}
