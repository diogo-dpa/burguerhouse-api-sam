import { MenuDto } from '../dtos/MenuDto';
import { IMenuService } from '../iservices/IMenuService';
import { MenuCreateModel } from '../models/menu/MenuCreateModel';
import { MenuResponseModel } from '../models/menu/MenuResponseModel';
import { MenuUpdateModel } from '../models/menu/MenuUpdateModel';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { PrismaMenusRepository } from '../repositories/prisma/PrismaMenusRepository';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';
import { ErrorHandler } from '../utils/ErrorHandler';
import { RelationSnackIngredient } from '../utils/commonTypes';
import { JsonAPIQueryOptions } from '../utils/jsonapi/typesJsonapi';

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

    async createMenu(
        newMenu: MenuCreateModel,
        { snack, ingredient }: RelationSnackIngredient,
    ): Promise<MenuResponseModel> {
        const { menuItems } = newMenu;

        if (
            menuItems?.some(
                (item) =>
                    (ingredient && !ErrorHandler.validateStringParameterReturningBool(item.ingredientId)) ||
                    (snack && !ErrorHandler.validateStringParameterReturningBool(item.snackId)),
            )
        )
            throw new Error(ErrorHandler.returnBadRequestCustomError(ErrorHandler.invalidParametersMessage));

        const existingMenu = await this.menuRepository.getByName(newMenu.name);
        if (existingMenu) throw new Error(ErrorHandler.returnBadRequestCustomError('Existing menu name'));

        await this.validateIFSnacksAndIngredientsExistsFromMenuItems(menuItems);

        const menu = await this.menuRepository.create(newMenu);
        return MenuDto.convertPrismaModelToMenuModel(menu);
    }

    async updateMenu(
        menuId: string,
        newMenu: MenuUpdateModel,
        { snack, ingredient }: RelationSnackIngredient,
    ): Promise<MenuResponseModel> {
        const { menuItems } = newMenu;

        const foundMenu = await this.menuRepository.getById(menuId);
        if (!foundMenu) throw new Error(ErrorHandler.returnNotFoundCustomError(ErrorHandler.menuNotFoundMessage));

        if (!!menuItems?.length) {
            if (
                menuItems?.some(
                    (item) =>
                        (ingredient && !ErrorHandler.validateStringParameterReturningBool(item.ingredientId)) ||
                        (snack && !ErrorHandler.validateStringParameterReturningBool(item.snackId)),
                )
            )
                throw new Error(ErrorHandler.returnBadRequestCustomError(ErrorHandler.invalidParametersMessage));

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
                throw new Error(ErrorHandler.returnNotFoundCustomError(ErrorHandler.ingredientNotFoundMessage));

            if (snacks.some((snack) => snack === null))
                throw new Error(ErrorHandler.returnNotFoundCustomError(ErrorHandler.snackNotFoundMessage));
        }

        const menu = await this.menuRepository.update(menuId, newMenu);
        return MenuDto.convertPrismaModelToMenuModel(menu);
    }

    async getAllMenus(queryOptions?: JsonAPIQueryOptions): Promise<MenuResponseModel[]> {
        const { sort, include, page, fields } = queryOptions ?? {};

        const menus = await this.menuRepository.getAll({ sort, include, page, fields });
        return MenuDto.convertPrismaModelArrayToMenuModelArray(menus);
    }

    async getMenuById(menuId: string, queryOptions?: JsonAPIQueryOptions): Promise<MenuResponseModel> {
        const { sort, include, page, fields } = queryOptions ?? {};

        const menu = await this.menuRepository.getById(menuId, { sort, include, page, fields });

        return MenuDto.convertPrismaModelToMenuModel(menu);
    }

    async deleteMenuById(menuId: string): Promise<void> {
        const foundMenu = await this.menuRepository.getById(menuId);
        if (!foundMenu) throw new Error(ErrorHandler.returnNotFoundCustomError(ErrorHandler.menuNotFoundMessage));

        await this.menuRepository.delete(menuId);
    }

    //Private methods
    private async validateIFSnacksAndIngredientsExistsFromMenuItems(menuItems: MenuCreateModel['menuItems']) {
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
            throw new Error(ErrorHandler.returnBadRequestCustomError(ErrorHandler.ingredientNotFoundMessage));

        if (snacks.some((snack) => snack === null))
            throw new Error(ErrorHandler.returnBadRequestCustomError(ErrorHandler.snackNotFoundMessage));
    }
}
