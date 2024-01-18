import { MenuDto } from '../dtos/MenuDto';
import { IMenuService } from '../iservices/IMenuService';
import { MenuCreateModel } from '../models/menu/MenuCreateModel';
import { MenuResponseModel } from '../models/menu/MenuResponseModel';
import { MenuUpdateModel } from '../models/menu/MenuUpdateModel';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { PrismaMenusRepository } from '../repositories/prisma/PrismaMenusRepository';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';
import { ErrorHandler } from '../utils/ErrorHandler';

export class MenuService implements IMenuService {
    private menuRepository: PrismaMenusRepository;
    private snackRepository: PrismaSnacksRepository;
    private ingredientRepository: PrismaIngredientRepository;

    constructor(
        _menuRepository: PrismaMenusRepository,
        _snackRepository: PrismaSnacksRepository,
        _ingredientRepository: PrismaIngredientRepository,
    ) {
        this.menuRepository = _menuRepository;
        this.snackRepository = _snackRepository;
        this.ingredientRepository = _ingredientRepository;
    }

    async createMenu(newMenu: MenuCreateModel): Promise<MenuResponseModel> {
        const { menuItems } = newMenu;

        const ingredientIdFromMenuItems = menuItems.map((menuItem) => menuItem.ingredientId);
        const snackIdFromMenuItems = menuItems.map((menuItem) => menuItem.snackId);

        const ingredientPromise = ingredientIdFromMenuItems
            .filter((ingredientId) => !!ingredientId)
            .map((ingredientId) => this.ingredientRepository.getById(ingredientId ?? ''));

        const snackPromise = snackIdFromMenuItems
            .filter((snackId) => !!snackId)
            .map((snackId) => this.snackRepository.getById(snackId ?? ''));

        const [ingredients, snacks] = await Promise.all([ingredientPromise, snackPromise]);

        if (ingredients.some((ingredient) => ingredient === null))
            throw new Error(ErrorHandler.ingredientNotFoundMessage);

        if (snacks.some((snack) => snack === null)) throw new Error(ErrorHandler.snackNotFoundMessage);

        const menu = await this.menuRepository.create(newMenu);
        return MenuDto.convertPrismaModelToMenuModel(menu);
    }

    async updateMenu(menuId: string, newMenu: MenuUpdateModel): Promise<MenuResponseModel> {
        const { menuItems } = newMenu;

        if (!!menuItems?.length) {
            const ingredientIdFromMenuItems = menuItems.map((menuItem) => menuItem.ingredientId);
            const snackIdFromMenuItems = menuItems.map((menuItem) => menuItem.snackId);

            const ingredientPromise = ingredientIdFromMenuItems
                .filter((ingredientId) => !!ingredientId)
                .map((ingredientId) => this.ingredientRepository.getById(ingredientId ?? ''));

            const snackPromise = snackIdFromMenuItems
                .filter((snackId) => !!snackId)
                .map((snackId) => this.snackRepository.getById(snackId ?? ''));

            const [ingredients, snacks] = await Promise.all([ingredientPromise, snackPromise]);

            if (ingredients.some((ingredient) => ingredient === null))
                throw new Error(ErrorHandler.ingredientNotFoundMessage);

            if (snacks.some((snack) => snack === null)) throw new Error(ErrorHandler.snackNotFoundMessage);
        }

        const menu = await this.menuRepository.update(menuId, newMenu);
        return MenuDto.convertPrismaModelToMenuModel(menu);
    }

    async getAllMenus(): Promise<MenuResponseModel[]> {
        const menus = await this.menuRepository.getAll();
        return MenuDto.convertPrismaModelArrayToMenuModelArray(menus);
    }

    async getMenuById(menuId: string): Promise<MenuResponseModel> {
        const menu = await this.menuRepository.getById(menuId);
        return MenuDto.convertPrismaModelToMenuModel(menu);
    }

    async deleteMenuById(menuId: string): Promise<void> {
        await this.menuRepository.delete(menuId);
    }
}
