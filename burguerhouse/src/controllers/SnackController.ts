import { ISnackController } from '../icontrollers/ISnackController';
import { SnackCreateModel } from '../models/snack/SnackCreateModel';
import { SnackResponseModel } from '../models/snack/SnackResponseModel';
import { SnackUpdateModel } from '../models/snack/SnackUpdateModel';
import { SnackItemResponseModel } from '../models/snackItem/SnackItemResponseModel';
import { SnackService } from '../services/SnackService';
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

export class SnackController implements ISnackController {
    private snackService: SnackService;

    private jsonAPIHandler: JSONAPIHandler;
    private jsonAPIRoute = 'snacks';
    private jsonAPIType = JsonAPIProjectTypesEnum.snack;
    private snacksRelations = [JsonAPIProjectTypesEnum.ingredient];

    constructor(_snackService: SnackService) {
        this.snackService = _snackService;
        this.jsonAPIHandler = new JSONAPIHandler();
    }

    async create({ header, body }: ControllerOptions): Promise<ControllerResponseJsonAPI> {
        try {
            if (!this.jsonAPIHandler.validateContentType(header))
                return this.jsonAPIHandler.mountErrorResponseUnsupportedMediaType();

            if (!this.jsonAPIHandler.validateAvailableDataPrimaryKeys(body ?? ''))
                return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { data, ...rest }: JsonAPIBodyType<SnackCreateModel> = JSON.parse(body ?? '');

            if (data === null) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { attributes, type, relationships } = data;

            if (type !== this.jsonAPIType || Object.keys(rest).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict('Data: Invalid format.');

            const { ingredient, ...restRelationships } = relationships ?? {};

            if (!ingredient || Object.keys(restRelationships).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict('Relationships: Invalid format.');

            const { name, description, unitMoneyAmount, snackItems, ...restAttr } = attributes;

            if (
                !ErrorHandler.validateStringParameterReturningBool(name) ||
                !ErrorHandler.validateStringParameterReturningBool(description) ||
                !ErrorHandler.validateNumberParameterReturningBool(unitMoneyAmount) ||
                !snackItems ||
                !Array.isArray(snackItems) ||
                snackItems.length === 0 ||
                Object.keys(restAttr).length > 0
            )
                return this.jsonAPIHandler.mountErrorResponseForbidden('Attributes: Invalid format.');

            const { data: dataIngredient } = ingredient;

            if (!dataIngredient || !Array.isArray(dataIngredient) || dataIngredient.length === 0)
                return this.jsonAPIHandler.mountErrorResponseForbidden('Relationships Object: Invalid format.');

            const ingredientIds = dataIngredient.map((ingredient) => ingredient.id);

            if (dataIngredient.some((ingredient) => !this.snacksRelations.includes(ingredient.type)))
                return this.jsonAPIHandler.mountErrorResponseForbidden('Invalid ingredient type');

            if (
                dataIngredient.some((ingredient) => !ingredient.id) ||
                snackItems.some((snackItem) => !ingredientIds.includes(snackItem.ingredientId ?? ''))
            )
                return this.jsonAPIHandler.mountErrorResponseForbidden('Ingredient Ids does not match');

            const snack = await this.snackService.createSnack({
                name,
                description,
                unitMoneyAmount,
                snackItems,
            });

            return this.jsonAPIHandler.mountSuccessResponse<SnackResponseModel>({
                options: { type: this.jsonAPIType, linkSelf: `${this.jsonAPIRoute}/${snack.id}` },
                body: snack,
                relationships: {
                    relations: [...this.snacksRelations],
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

            const { data, ...rest }: JsonAPIBodyType<SnackUpdateModel> = JSON.parse(body ?? '');

            if (data === null) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { type, attributes, id, relationships } = data;

            if (id !== formattedId || type !== this.jsonAPIType || Object.keys(rest).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict('Data: Invalid format.');

            const { ingredient, ...restRelationships } = relationships ?? {};

            if (!ingredient || Object.keys(restRelationships).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict('Relationships: Invalid format.');

            const { description, unitMoneyAmount, snackItems, ...restAttr } = attributes;

            if (
                (!ErrorHandler.validateStringParameterReturningBool(description) &&
                    !ErrorHandler.validateNumberParameterReturningBool(unitMoneyAmount)) ||
                !snackItems ||
                !Array.isArray(snackItems) ||
                snackItems.length === 0 ||
                Object.keys(restAttr).length > 0
            )
                return this.jsonAPIHandler.mountErrorResponseConflict(ErrorHandler.invalidParametersMessage);

            const { data: dataIngredient } = ingredient;

            if (!dataIngredient || !Array.isArray(dataIngredient) || dataIngredient.length === 0)
                return this.jsonAPIHandler.mountErrorResponseForbidden('Relationships Object: Invalid format.');

            const ingredientIds = dataIngredient.map((ingredient) => ingredient.id);

            if (dataIngredient.some((ingredient) => !this.snacksRelations.includes(ingredient.type)))
                return this.jsonAPIHandler.mountErrorResponseForbidden('Invalid ingredient type');

            if (
                dataIngredient.some((ingredient) => !ingredient.id) ||
                snackItems.some((snackItem) => !ingredientIds.includes(snackItem.ingredientId ?? ''))
            )
                return this.jsonAPIHandler.mountErrorResponseForbidden('Ingredient Ids does not match');

            const snack = await this.snackService.updateSnack(id, {
                description,
                unitMoneyAmount,
                snackItems,
            });

            return this.jsonAPIHandler.mountSuccessResponse<SnackResponseModel>({
                options: { type: this.jsonAPIType, linkSelf: `${this.jsonAPIRoute}/${snack.id}` },
                body: snack,
                relationships: {
                    relations: [...this.snacksRelations],
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

            const snacks = await this.snackService.getAllSnacks({ sort });

            return this.jsonAPIHandler.mountSuccessResponseArray<SnackResponseModel>({
                options: { type: this.jsonAPIType, linkSelf: this.jsonAPIRoute },
                body: snacks,
                relationships: {
                    relations: [...this.snacksRelations],
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

            const snack = await this.snackService.getSnackById(id);
            return this.jsonAPIHandler.mountSuccessResponse<SnackResponseModel>({
                options: { type: this.jsonAPIType, linkSelf: `${this.jsonAPIRoute}/${id}` },
                body: snack,
                relationships: {
                    relations: [...this.snacksRelations],
                },
            });
        } catch (error: any) {
            return defineErrorResponse(error.message);
        }
    }

    async getRelationshipById({ header, params }: ControllerOptions): Promise<ControllerResponseJsonAPI> {
        try {
            const { pathParameter, queryParameter } = params ?? {};
            const { id } = pathParameter ?? {};
            const { include, fields, filter, page }: JsonAPIQueryOptions = queryParameter ?? {};

            if (!this.jsonAPIHandler.validateContentType(header))
                return this.jsonAPIHandler.mountErrorResponseUnsupportedMediaType();

            if (include || fields || filter || page) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const formattedId = id ?? '';

            if (!ErrorHandler.validateStringParameterReturningBool(formattedId))
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            const snack = await this.snackService.getSnackById(formattedId, {
                include: {
                    [mapRelationTypeToModelType(JsonAPIProjectTypesEnum.snackItems)]: {
                        include: {
                            [JsonAPIProjectTypesEnum.ingredient]: true,
                        },
                    },
                },
            });

            return this.jsonAPIHandler.mountSuccessResponseRelationshipArray<SnackItemResponseModel>({
                options: {
                    type: JsonAPIProjectTypesEnum.ingredient,
                    baseLinkReference: `${this.jsonAPIRoute}/${id}`,
                    linkSelf: mapRelationTypeToModelType(JsonAPIProjectTypesEnum.ingredient),
                },
                body: snack?.snackItems.map((item) => item.ingredient) ?? [],
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

            await this.snackService.deleteSnackById(id);

            return this.jsonAPIHandler.mountSuccessResponse<SnackResponseModel>({
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
