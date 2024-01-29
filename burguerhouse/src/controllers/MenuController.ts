import { IMenuController } from '../icontrollers/IMenuController';
import { MenuCreateModel } from '../models/menu/MenuCreateModel';
import { MenuResponseModel } from '../models/menu/MenuResponseModel';
import { MenuUpdateModel } from '../models/menu/MenuUpdateModel';
import { MenuItemResponseModel } from '../models/menuItem/MenuItemResponseModel';
import { MenuService } from '../services/MenuService';
import { ErrorHandler } from '../utils/ErrorHandler';
import { JSONAPIHandler } from '../utils/jsonapi/JsonapiHandler';
import {
    ControllerResponseJsonAPI,
    JsonAPIBodyType,
    JsonAPIProjectTypesEnum,
    JsonAPIQueryOptions,
} from '../utils/jsonapi/typesJsonapi';
import { mapRelationTypeToModelType } from '../utils/jsonapi/utilsJsonapi';
import { ControllerOptions } from './typesController';
import { defineErrorResponse } from './utilsController';

export class MenuController implements IMenuController {
    private menuService: MenuService;
    private jsonAPIHandler: JSONAPIHandler;
    private jsonAPIRoute = 'menus';
    private jsonAPIType = JsonAPIProjectTypesEnum.menu;
    private menuRelations = [JsonAPIProjectTypesEnum.snack, JsonAPIProjectTypesEnum.ingredient];

    constructor(_menuService: MenuService) {
        this.menuService = _menuService;
        this.jsonAPIHandler = new JSONAPIHandler();
    }

    async create({ header, body }: ControllerOptions): Promise<ControllerResponseJsonAPI> {
        try {
            if (!this.jsonAPIHandler.validateContentType(header))
                return this.jsonAPIHandler.mountErrorResponseUnsupportedMediaType();

            if (!this.jsonAPIHandler.validateAvailableDataPrimaryKeys(body ?? ''))
                return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { data, ...rest }: JsonAPIBodyType<MenuCreateModel> = JSON.parse(body ?? '');

            if (data === null) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { attributes, type, relationships } = data;

            if (type !== this.jsonAPIType || Object.keys(rest).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict('Data: Invalid format.');

            const { ingredient, snack, ...restRelationships } = relationships ?? {};

            if ((!ingredient && !snack) || Object.keys(restRelationships).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict('Relationships: Invalid format.');

            const { name, description, menuItems, ...restAttr } = attributes;

            if (
                !ErrorHandler.validateStringParameterReturningBool(name) ||
                !ErrorHandler.validateStringParameterReturningBool(description) ||
                !menuItems ||
                !Array.isArray(menuItems) ||
                menuItems.length === 0 ||
                Object.keys(restAttr).length > 0
            )
                return this.jsonAPIHandler.mountErrorResponseForbidden('Attributes: Invalid format.');

            if (ingredient) {
                const { data: dataMenuItemIngredient } = ingredient ?? {};

                if (
                    !dataMenuItemIngredient ||
                    !Array.isArray(dataMenuItemIngredient) ||
                    dataMenuItemIngredient.length === 0
                )
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Relationships Object: Invalid format.');

                const ingredientIds = dataMenuItemIngredient.map((menuItem) => menuItem.id);

                if (dataMenuItemIngredient.some((ingredient) => !this.menuRelations.includes(ingredient.type)))
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Invalid ingredient type');

                if (
                    ingredientIds.some((ingredient) => !ingredient) ||
                    menuItems.some((menuItem) => !ingredientIds.includes(menuItem.ingredientId ?? ''))
                )
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Ingredient Ids don`t match');
            }

            if (snack) {
                const { data: dataMenuItemSnack } = snack ?? {};
                if (!dataMenuItemSnack || !Array.isArray(dataMenuItemSnack) || dataMenuItemSnack.length === 0)
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Relationships Object: Invalid format.');

                const snacksIds = dataMenuItemSnack.map((menuItem) => menuItem.id);

                if (dataMenuItemSnack.some((snack) => !this.menuRelations.includes(snack.type)))
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Invalid ingredient type');

                if (
                    snacksIds.some((snack) => !snack) ||
                    menuItems.some((menuItem) => !snacksIds.includes(menuItem.snackId ?? ''))
                )
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Snack Ids don`t match');
            }

            const menu = await this.menuService.createMenu(
                {
                    name,
                    description,
                    menuItems,
                },
                {
                    snack: !!snack,
                    ingredient: !!ingredient,
                },
            );
            return this.jsonAPIHandler.mountSuccessResponse<MenuResponseModel>({
                options: { type: this.jsonAPIType, linkSelf: `${this.jsonAPIRoute}/${menu.id}` },
                body: menu,
                relationships: {
                    relations: [...this.menuRelations],
                },
                statusCode: 201,
            });
        } catch (error: any) {
            return defineErrorResponse(error.message);
        }
    }

    async update({ header, params, body }: ControllerOptions): Promise<ControllerResponseJsonAPI> {
        try {
            const { pathParameter } = params ?? {};
            const { id: idParams } = pathParameter ?? {};

            if (!this.jsonAPIHandler.validateContentType(header))
                return this.jsonAPIHandler.mountErrorResponseUnsupportedMediaType();

            const formattedId = idParams ?? '';

            if (!ErrorHandler.validateStringParameterReturningBool(formattedId))
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            const { data, ...rest }: JsonAPIBodyType<MenuUpdateModel> = JSON.parse(body ?? '');

            if (data === null) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { type, attributes, id, relationships } = data;

            if (id !== formattedId || type !== this.jsonAPIType || Object.keys(rest).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict('Data: Invalid format.');

            const { ingredient, snack, ...restRelationships } = relationships ?? {};

            if ((!ingredient && !snack) || Object.keys(restRelationships).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict('Relationships: Invalid format.');

            const { description, menuItems, ...restAttr } = attributes;

            if (
                !ErrorHandler.validateStringParameterReturningBool(id) ||
                (!ErrorHandler.validateStringParameterReturningBool(description) &&
                    (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0)) ||
                Object.keys(restAttr).length > 0
            )
                return this.jsonAPIHandler.mountErrorResponseConflict(ErrorHandler.invalidParametersMessage);

            if (ingredient) {
                const { data: dataMenuItemIngredient } = ingredient ?? {};

                if (
                    !dataMenuItemIngredient ||
                    !Array.isArray(dataMenuItemIngredient) ||
                    dataMenuItemIngredient.length === 0
                )
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Relationships Object: Invalid format.');

                const ingredientIds = dataMenuItemIngredient.map((menuItem) => menuItem.id);

                if (dataMenuItemIngredient.some((ingredient) => !this.menuRelations.includes(ingredient.type)))
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Invalid ingredient type');

                if (
                    ingredientIds.some((ingredient) => !ingredient) ||
                    menuItems?.some((menuItem) => !ingredientIds.includes(menuItem.ingredientId ?? ''))
                )
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Ingredient Ids don`t match');
            }

            if (snack) {
                const { data: dataMenuItemSnack } = snack ?? {};
                if (!dataMenuItemSnack || !Array.isArray(dataMenuItemSnack) || dataMenuItemSnack.length === 0)
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Relationships Object: Invalid format.');

                const snacksIds = dataMenuItemSnack.map((menuItem) => menuItem.id);

                if (dataMenuItemSnack.some((snack) => !this.menuRelations.includes(snack.type)))
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Invalid snack type');

                if (
                    snacksIds.some((snack) => !snack) ||
                    menuItems?.some((menuItem) => !snacksIds.includes(menuItem.snackId ?? ''))
                )
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Snack Ids don`t match');
            }

            const menu = await this.menuService.updateMenu(
                id,
                {
                    description,
                    menuItems,
                },
                {
                    snack: !!snack,
                    ingredient: !!ingredient,
                },
            );

            return this.jsonAPIHandler.mountSuccessResponse<MenuResponseModel>({
                options: { type: this.jsonAPIType, linkSelf: `${this.jsonAPIRoute}/${menu.id}` },
                body: menu,
                relationships: {
                    relations: [...this.menuRelations],
                },
            });
        } catch (error: any) {
            return defineErrorResponse(error.message);
        }
    }

    async getAll({ header, params }: ControllerOptions): Promise<ControllerResponseJsonAPI> {
        try {
            const { queryParameter } = params ?? {};
            const { sort, fields, include, page }: JsonAPIQueryOptions = queryParameter ?? {};

            if (!this.jsonAPIHandler.validateContentType(header))
                return this.jsonAPIHandler.mountErrorResponseUnsupportedMediaType();

            if (include || fields || page) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const menus = await this.menuService.getAllMenus({ sort });
            return this.jsonAPIHandler.mountSuccessResponseArray<MenuResponseModel>({
                options: { type: this.jsonAPIType, linkSelf: this.jsonAPIRoute },
                body: menus,
                relationships: {
                    relations: [...this.menuRelations],
                },
            });
        } catch (error: any) {
            return defineErrorResponse(error.message);
        }
    }

    async getById({ header, params }: ControllerOptions): Promise<ControllerResponseJsonAPI> {
        try {
            const { pathParameter, queryParameter } = params ?? {};
            const { id } = pathParameter ?? {};
            const { include, fields, page }: JsonAPIQueryOptions = queryParameter ?? {};

            if (!this.jsonAPIHandler.validateContentType(header))
                return this.jsonAPIHandler.mountErrorResponseUnsupportedMediaType();

            if (include || fields || page) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const formattedId = id ?? '';

            if (!ErrorHandler.validateStringParameterReturningBool(formattedId))
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            const menu = await this.menuService.getMenuById(id);
            return this.jsonAPIHandler.mountSuccessResponse<MenuResponseModel>({
                options: { type: this.jsonAPIType, linkSelf: `${this.jsonAPIRoute}/${id}` },
                body: menu,
                relationships: {
                    relations: [...this.menuRelations],
                },
            });
        } catch (error: any) {
            return defineErrorResponse(error.message);
        }
    }

    async getRelationshipById({ header, params }: ControllerOptions): Promise<ControllerResponseJsonAPI> {
        try {
            const { pathParameter, queryParameter } = params ?? {};
            const { id, relation } = pathParameter ?? {};
            const { include, fields, filter, page }: JsonAPIQueryOptions = queryParameter ?? {};

            if (!this.jsonAPIHandler.validateContentType(header))
                return this.jsonAPIHandler.mountErrorResponseUnsupportedMediaType();

            if (include || fields || filter || page) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const formattedId = id ?? '';

            if (!ErrorHandler.validateStringParameterReturningBool(formattedId))
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            if (
                relation !== mapRelationTypeToModelType(JsonAPIProjectTypesEnum.ingredient) &&
                relation !== mapRelationTypeToModelType(JsonAPIProjectTypesEnum.snack)
            )
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            const choosenRelation =
                relation === mapRelationTypeToModelType(JsonAPIProjectTypesEnum.ingredient)
                    ? JsonAPIProjectTypesEnum.ingredient
                    : JsonAPIProjectTypesEnum.snack;

            const menu = await this.menuService.getMenuById(formattedId, {
                include: {
                    [mapRelationTypeToModelType(JsonAPIProjectTypesEnum.menuItems)]: {
                        include: {
                            [choosenRelation]: true,
                        },
                    },
                },
            });

            const choosenRelationData =
                relation === mapRelationTypeToModelType(JsonAPIProjectTypesEnum.ingredient)
                    ? menu.menuItems.filter((item) => item.ingredient)
                    : menu.menuItems.filter((item) => item.snack);

            return this.jsonAPIHandler.mountSuccessResponseRelationshipArray<MenuItemResponseModel>({
                options: {
                    type: choosenRelation,
                    baseLinkReference: `${this.jsonAPIRoute}/${id}`,
                    linkSelf: mapRelationTypeToModelType(choosenRelation),
                },
                body: choosenRelationData,
            });
        } catch (error: any) {
            return defineErrorResponse(error.message);
        }
    }

    async delete({ header, params }: ControllerOptions): Promise<ControllerResponseJsonAPI> {
        try {
            const { pathParameter } = params ?? {};
            const { id } = pathParameter ?? {};

            if (!this.jsonAPIHandler.validateContentType(header))
                return this.jsonAPIHandler.mountErrorResponseUnsupportedMediaType();

            const formattedId = id ?? '';

            if (!ErrorHandler.validateStringParameterReturningBool(formattedId))
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            await this.menuService.deleteMenuById(id);

            return this.jsonAPIHandler.mountSuccessResponse<MenuResponseModel>({
                options: {
                    type: this.jsonAPIType,
                    linkSelf: this.jsonAPIRoute,
                },
            });
        } catch (error: any) {
            return defineErrorResponse(error.message);
        }
    }
}
