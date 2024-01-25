import { IUserController } from '../icontrollers/IUserController';
import { OrderResponseModel } from '../models/order/OrderResponseModel';
import { UserCreateModel } from '../models/user/UserCreateModel';
import { UserResponseModel } from '../models/user/UserResponseModel';
import { UserUpdateModel } from '../models/user/UserUpdateModel';
import { UserService } from '../services/UserService';
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

export class UserController implements IUserController {
    private userService: UserService;
    private jsonAPIHandler: JSONAPIHandler;
    private jsonAPIRoute = 'users';
    private usersRelations = [JsonAPIProjectTypesEnum.order];

    constructor(_userService: UserService) {
        this.userService = _userService;
        this.jsonAPIHandler = new JSONAPIHandler();
    }

    async create({ header, body }: ControllerOptions): Promise<ControllerResponseJsonAPI> {
        try {
            if (!this.jsonAPIHandler.validateContentType(header))
                return this.jsonAPIHandler.mountErrorResponseUnsupportedMediaType();

            if (!this.jsonAPIHandler.validateAvailableDataPrimaryKeys(body ?? ''))
                return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { data, ...rest }: JsonAPIBodyType<UserCreateModel> = JSON.parse(body ?? '');

            if (data === null) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { attributes, type } = data;

            if (type !== JsonAPIProjectTypesEnum.people || Object.keys(rest).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict();

            const { name, email, isEmployee } = attributes;

            if (
                !ErrorHandler.validateStringParameterReturningBool(name as string) ||
                !ErrorHandler.validateStringParameterReturningBool(email as string) ||
                !ErrorHandler.validateBooleanParameterReturningBool(isEmployee as boolean)
            )
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            const user = await this.userService.createUser({
                name: name as string,
                email: email as string,
                isEmployee: isEmployee as boolean,
            });
            return this.jsonAPIHandler.mountSuccessResponse<UserResponseModel>({
                options: { type: JsonAPIProjectTypesEnum.people, linkSelf: `${this.jsonAPIRoute}/${user.id}` },
                body: user,
                relationships: {
                    relations: [...this.usersRelations],
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

            const { data, ...rest }: JsonAPIBodyType<UserUpdateModel> = JSON.parse(body ?? '');

            if (data === null) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { type, attributes, id } = data;

            if (id !== formattedId || type !== JsonAPIProjectTypesEnum.people || Object.keys(rest).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict();

            const { name, isEmployee, ...restAttr } = attributes;

            if (
                (!ErrorHandler.validateStringParameterReturningBool(name) &&
                    !ErrorHandler.validateBooleanParameterReturningBool(isEmployee)) ||
                Object.keys(restAttr).length > 0
            )
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            const user = await this.userService.updateUser(formattedId, { name, isEmployee });
            return this.jsonAPIHandler.mountSuccessResponse<UserResponseModel>({
                options: { type: JsonAPIProjectTypesEnum.people, linkSelf: `${this.jsonAPIRoute}/${user.id}` },
                body: user,
                relationships: {
                    relations: [...this.usersRelations],
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

            const users = await this.userService.getAllUsers({ sort, fields, include, page });

            return this.jsonAPIHandler.mountSuccessResponseArray<UserResponseModel>({
                options: { type: JsonAPIProjectTypesEnum.people, linkSelf: this.jsonAPIRoute },
                body: users,
                relationships: {
                    relations: [...this.usersRelations],
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

            const user = await this.userService.getUserById(formattedId, { fields, include });
            return this.jsonAPIHandler.mountSuccessResponse<UserResponseModel>({
                options: { type: JsonAPIProjectTypesEnum.people, linkSelf: `${this.jsonAPIRoute}/${id}` },
                body: user,
                relationships: {
                    relations: [...this.usersRelations],
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

            const user = await this.userService.getUserById(formattedId, {
                include: {
                    [mapRelationTypeToModelType(JsonAPIProjectTypesEnum.order)]: true,
                },
            });

            return this.jsonAPIHandler.mountSuccessResponseRelationshipArray<OrderResponseModel>({
                options: {
                    type: JsonAPIProjectTypesEnum.order,
                    baseLinkReference: `${this.jsonAPIRoute}/${id}`,
                    linkSelf: mapRelationTypeToModelType(JsonAPIProjectTypesEnum.order),
                },
                body: user?.orders,
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

            await this.userService.deleteUserById(formattedId);
            return this.jsonAPIHandler.mountSuccessResponse<UserResponseModel>({
                options: {
                    type: JsonAPIProjectTypesEnum.people,
                    linkSelf: this.jsonAPIRoute,
                },
            });
        } catch (error: any) {
            return defineErrorResponse(error.message);
        }
    }
}
