import { IUserController } from '../icontrollers/IUserController';
import { UserModel } from '../models/user/UserModel';
import { UserService } from '../services/UserService';

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
            const user = await this.userService.getUserById(id);
            return user;
        } catch (error: any) {
            return error.message;
        }
    }

    async update(id: string, body: any): Promise<UserModel> {
        try {
            const user = await this.userService.updateUser(id, body);
            return user;
        } catch (error: any) {
            return error.message;
        }
    }

    async create(body: any): Promise<UserModel> {
        try {
            const user = await this.userService.createUser(body);
            return user;
        } catch (error: any) {
            return error.message;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const user = await this.userService.deleteUserById(id);
            return user;
        } catch (error: any) {
            return error.message;
        }
    }
}
