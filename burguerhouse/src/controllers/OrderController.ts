import { IOrderController } from '../icontrollers/IOrderController';
import { OrderCreateModel } from '../models/order/OrderCreateModel';
import { OrderResponseModel } from '../models/order/OrderResponseModel';
import { OrderItemResponseModel } from '../models/orderItem/OrderItemResponseModel';
import { OrderService } from '../services/OrderService';
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

export class OrderController implements IOrderController {
    private orderService: OrderService;
    private jsonAPIHandler: JSONAPIHandler;
    private jsonAPIRoute = 'orders';
    private jsonAPIType = JsonAPIProjectTypesEnum.order;
    private orderRelations = [
        JsonAPIProjectTypesEnum.people,
        JsonAPIProjectTypesEnum.snack,
        JsonAPIProjectTypesEnum.ingredient,
    ];

    constructor(_orderService: OrderService) {
        this.orderService = _orderService;
        this.jsonAPIHandler = new JSONAPIHandler();
    }

    async create({ header, body }: ControllerOptions): Promise<ControllerResponseJsonAPI> {
        try {
            if (!this.jsonAPIHandler.validateContentType(header))
                return this.jsonAPIHandler.mountErrorResponseUnsupportedMediaType();

            if (!this.jsonAPIHandler.validateAvailableDataPrimaryKeys(body ?? ''))
                return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { data, ...rest }: JsonAPIBodyType<OrderCreateModel> = JSON.parse(body ?? '');

            if (data === null) return this.jsonAPIHandler.mountErrorResponseBadRequest();

            const { attributes, type, relationships } = data;

            if (type !== this.jsonAPIType || Object.keys(rest).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict('Data: Invalid format.');

            const { people, ingredient, snack, ...restRelationships } = relationships ?? {};

            if (!people || (!ingredient && !snack) || Object.keys(restRelationships).length > 0)
                return this.jsonAPIHandler.mountErrorResponseConflict('Relationships: Invalid format.');

            const { userId, totalPrice, orderItems, ...restAttr } = attributes;

            if (
                !ErrorHandler.validateStringParameterReturningBool(userId) ||
                !ErrorHandler.validateNumberParameterReturningBool(totalPrice) ||
                !orderItems ||
                !Array.isArray(orderItems) ||
                orderItems.length === 0 ||
                Object.keys(restAttr).length > 0
            )
                return this.jsonAPIHandler.mountErrorResponseForbidden('Attributes: Invalid format.');

            const { data: dataOrderItemPeople } = people ?? {};

            if (!dataOrderItemPeople || !Array.isArray(dataOrderItemPeople) || dataOrderItemPeople.length === 0)
                return this.jsonAPIHandler.mountErrorResponseForbidden('Relationships Object: Invalid format.');

            const peopleIds = dataOrderItemPeople.map((orderItem) => orderItem.id);

            if (dataOrderItemPeople.some((people) => people.type !== JsonAPIProjectTypesEnum.people))
                return this.jsonAPIHandler.mountErrorResponseForbidden('Invalid user type');

            if (peopleIds.some((people) => !people) || !peopleIds.includes(userId ?? ''))
                return this.jsonAPIHandler.mountErrorResponseForbidden('User Id don`t match');

            if (ingredient) {
                const { data: dataOrderItemIngredient } = ingredient ?? {};

                if (
                    !dataOrderItemIngredient ||
                    !Array.isArray(dataOrderItemIngredient) ||
                    dataOrderItemIngredient.length === 0
                )
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Relationships Object: Invalid format.');

                const ingredientIds = dataOrderItemIngredient.map((orderItem) => orderItem.id);

                if (
                    dataOrderItemIngredient.some((ingredient) => ingredient.type !== JsonAPIProjectTypesEnum.ingredient)
                )
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Invalid ingredient type');

                const ingredientIdsFromOrderItems = orderItems.filter((orderItem) => orderItem.ingredientId);

                if (
                    ingredientIds.some((ingredient) => !ingredient) ||
                    ingredientIdsFromOrderItems.some(
                        (orderItem) => !ingredientIds.includes(orderItem.ingredientId ?? ''),
                    )
                )
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Ingredient Ids don`t match');
            }

            if (snack) {
                const { data: dataOrderItemSnack } = snack ?? {};
                if (!dataOrderItemSnack || !Array.isArray(dataOrderItemSnack) || dataOrderItemSnack.length === 0)
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Relationships Object: Invalid format.');

                const snacksIds = dataOrderItemSnack.map((orderItem) => orderItem.id);

                if (dataOrderItemSnack.some((snack) => snack.type !== JsonAPIProjectTypesEnum.snack))
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Invalid snack type');

                const snackIdsFromOrderItems = orderItems.filter((orderItem) => orderItem.snackId);
                if (
                    snacksIds.some((snack) => !snack) ||
                    snackIdsFromOrderItems.some((orderItem) => !snacksIds.includes(orderItem.snackId ?? ''))
                )
                    return this.jsonAPIHandler.mountErrorResponseForbidden('Snack Ids don`t match');
            }

            const order = await this.orderService.createOrder(
                {
                    userId,
                    totalPrice,
                    orderItems,
                },
                {
                    snack: !!snack,
                    ingredient: !!ingredient,
                },
            );
            return this.jsonAPIHandler.mountSuccessResponse<OrderResponseModel>({
                options: { type: this.jsonAPIType, linkSelf: `${this.jsonAPIRoute}/${order.id}` },
                body: order,
                relationships: {
                    relations: [...this.orderRelations],
                },
                statusCode: 201,
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

            const orders = await this.orderService.getAllOrders({sort});
            return this.jsonAPIHandler.mountSuccessResponseArray<OrderResponseModel>({
                options: { type: this.jsonAPIType, linkSelf: this.jsonAPIRoute },
                body: orders,
                relationships: {
                    relations: [...this.orderRelations],
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

            const order = await this.orderService.getOrderById(id);
            return this.jsonAPIHandler.mountSuccessResponse<OrderResponseModel>({
                options: { type: this.jsonAPIType, linkSelf: `${this.jsonAPIRoute}/${id}` },
                body: order,
                relationships: {
                    relations: [...this.orderRelations],
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

            const choosenRelation = this.defineChoosenRelation(relation);

            if (
                this.orderRelations.every((orderRelation) => mapRelationTypeToModelType(orderRelation) !== relation) ||
                choosenRelation == null
            )
                return this.jsonAPIHandler.mountErrorResponseForbidden();

            const includeRelation = this.defineIncludeRelationships(choosenRelation);

            const order = await this.orderService.getOrderById(formattedId, {
                include: {
                    ...includeRelation,
                },
            });

            const choosenRelationData = this.defineDataRelation(relation, order);

            return this.jsonAPIHandler.mountSuccessResponseRelationshipArray<OrderItemResponseModel>({
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

    // Private Methods
    private defineDataRelation(relation: string, order: OrderResponseModel) {
        switch (relation) {
            case mapRelationTypeToModelType(JsonAPIProjectTypesEnum.people):
                return [order.user];
            case mapRelationTypeToModelType(JsonAPIProjectTypesEnum.ingredient):
                return order.orderItems.filter((item) => item.ingredient);
            case mapRelationTypeToModelType(JsonAPIProjectTypesEnum.snack):
                return order.orderItems.filter((item) => item.snack);
            default:
                return null;
        }
    }

    private defineIncludeRelationships(relation: JsonAPIProjectTypesEnum) {
        if (relation === JsonAPIProjectTypesEnum.people) {
            return {
                [mapRelationTypeToModelType(JsonAPIProjectTypesEnum.people)]: true,
                [mapRelationTypeToModelType(JsonAPIProjectTypesEnum.orderItems)]: true,
            };
        }

        return {
            [mapRelationTypeToModelType(JsonAPIProjectTypesEnum.orderItems)]: {
                include: {
                    [relation]: true,
                },
            },
        };
    }

    private defineChoosenRelation(relation: string) {
        switch (relation) {
            case mapRelationTypeToModelType(JsonAPIProjectTypesEnum.people):
                return JsonAPIProjectTypesEnum.people;
            case mapRelationTypeToModelType(JsonAPIProjectTypesEnum.ingredient):
                return JsonAPIProjectTypesEnum.ingredient;
            case mapRelationTypeToModelType(JsonAPIProjectTypesEnum.snack):
                return JsonAPIProjectTypesEnum.snack;
            default:
                return null;
        }
    }
}
