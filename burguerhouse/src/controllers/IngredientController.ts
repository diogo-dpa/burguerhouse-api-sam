import { IIngredientController } from '../icontrollers/IIngredientController';
import { IngredientCreateModel } from '../models/ingredient/IngredientCreateModel';
import { IngredientResponseModel } from '../models/ingredient/IngredientResponseModel';
import { IngredientUpdateModel } from '../models/ingredient/IngredientUpdateModel';
import { IngredientService } from '../services/IngredientService';
import { ErrorHandler } from '../utils/ErrorHandler';
import { JSONAPIHandler } from '../utils/jsonapi/JsonapiHandler';
import {
    ControllerResponseJsonAPI,
    JsonAPIBodyType,
    JsonAPIProjectTypesEnum,
    JsonAPIQueryOptions,
} from '../utils/jsonapi/typesJsonapi';
import { ControllerOptions } from './typesController';
import { defineErrorResponse } from './utilsController';

export class IngredientController implements IIngredientController {
    private ingredientService: IngredientService;
    private jsonAPIHandler: JSONAPIHandler;
    private jsonAPIRoute = 'ingredients';

    constructor(_ingredientService: IngredientService) {
        this.ingredientService = _ingredientService;
        this.jsonAPIHandler = new JSONAPIHandler();
    }

    async create({ header, body }: ControllerOptions): Promise<ControllerResponseJsonAPI> {
        try {
            if (!this.jsonAPIHandler.validateContentType(header))
                return this.jsonAPIHandler.mountErrorResponseUnsupportedMediaType();

            if (!this.jsonAPIHandler.validateAvailableDataPrimaryKeys(body ?? ''))
                return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { data, ...rest }: JsonAPIBodyType<IngredientCreateModel> = JSON.parse(body ?? '');

            if (data === null) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { attributes, type } = data;

            if (type !== JsonAPIProjectTypesEnum.ingredient || Object.keys(rest).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict();

            const { name, unitMoneyAmount, availableAmount } = attributes;

            if (
                !ErrorHandler.validateStringParameterReturningBool(name) ||
                !ErrorHandler.validateNumberParameterReturningBool(availableAmount) ||
                !ErrorHandler.validateNumberParameterReturningBool(unitMoneyAmount)
            )
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            const ingredient = await this.ingredientService.createIngredient({
                name,
                availableAmount,
                unitMoneyAmount,
            });
            return this.jsonAPIHandler.mountSuccessResponse<IngredientResponseModel>({
                options: {
                    type: JsonAPIProjectTypesEnum.ingredient,
                    linkSelf: `${this.jsonAPIRoute}/${ingredient.id}`,
                },
                body: ingredient,
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

            const { data, ...rest }: JsonAPIBodyType<IngredientUpdateModel> = JSON.parse(body ?? '');

            if (data === null) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { type, attributes, id } = data;

            if (id !== formattedId || type !== JsonAPIProjectTypesEnum.ingredient || Object.keys(rest).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict();

            const { name, unitMoneyAmount, availableAmount, ...restAttr } = attributes;

            if (!ErrorHandler.validateStringParameterReturningBool(id))
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            if (
                (!ErrorHandler.validateStringParameterReturningBool(name) &&
                    !ErrorHandler.validateNumberParameterReturningBool(Number(unitMoneyAmount)) &&
                    !ErrorHandler.validateNumberParameterReturningBool(availableAmount)) ||
                Object.keys(restAttr).length > 0
            )
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            const ingredient = await this.ingredientService.updateIngredient(id, {
                name,
                unitMoneyAmount,
                availableAmount,
            });

            return this.jsonAPIHandler.mountSuccessResponse<IngredientResponseModel>({
                options: {
                    type: JsonAPIProjectTypesEnum.ingredient,
                    linkSelf: `${this.jsonAPIRoute}/${ingredient.id}`,
                },
                body: ingredient,
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

            const ingredients = await this.ingredientService.getAllIngredients({ sort, fields, include, page });

            return this.jsonAPIHandler.mountSuccessResponseArray<IngredientResponseModel>({
                options: { type: JsonAPIProjectTypesEnum.ingredient, linkSelf: this.jsonAPIRoute },
                body: ingredients,
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

            const ingredient = await this.ingredientService.getIngredientById(id);

            return this.jsonAPIHandler.mountSuccessResponse<IngredientResponseModel>({
                options: { type: JsonAPIProjectTypesEnum.ingredient, linkSelf: `${this.jsonAPIRoute}/${id}` },
                body: ingredient,
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

            await this.ingredientService.deleteIngredientById(id);

            return this.jsonAPIHandler.mountSuccessResponse<IngredientResponseModel>({
                options: {
                    type: JsonAPIProjectTypesEnum.ingredient,
                    linkSelf: this.jsonAPIRoute,
                },
            });
        } catch (error: any) {
            return defineErrorResponse(error.message);
        }
    }
}
