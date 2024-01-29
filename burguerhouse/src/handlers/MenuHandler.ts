import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MenuController } from '../controllers/MenuController';
import { MenuService } from '../services/MenuService';
import { PrismaMenusRepository } from '../repositories/prisma/PrismaMenusRepository';
import { ErrorHandler } from '../utils/ErrorHandler';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { HTTPMethodEnum } from '../utils/commonEnums';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';
import { formatQueryParameters } from './utilsHandler';
import { JSONAPIHandler } from '../utils/jsonapi/JsonapiHandler';
import { defineErrorResponse } from '../controllers/utilsController';

export class MenuHandler {
    private menuController: MenuController;

    constructor(_menuController: MenuController) {
        this.menuController = _menuController;
    }

    public lambdaMenuHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const idParameter = event.pathParameters?.id ?? '';
            const relationParameter = event.pathParameters?.relation ?? '';
            const headerString = JSON.stringify(event.headers);
            const parsedQueryParameter = JSON.stringify(event.queryStringParameters ?? '');
            const queryParameter = formatQueryParameters(JSON.parse(parsedQueryParameter));

            switch (event.httpMethod) {
                case HTTPMethodEnum.POST.toString():
                    const resultPost = await this.menuController.create({
                        header: headerString,
                        params: {
                            queryParameter,
                        },
                        body: event.body ?? '',
                    });
                    return resultPost as APIGatewayProxyResult;
                case HTTPMethodEnum.PATCH.toString():
                    const resultPut = await this.menuController.update({
                        header: headerString,
                        params: { pathParameter: { id: idParameter }, queryParameter },
                        body: event.body ?? '',
                    });
                    return resultPut as APIGatewayProxyResult;
                case HTTPMethodEnum.GET.toString():
                    if (relationParameter) {
                        const resultGet = await this.menuController.getRelationshipById({
                            header: headerString,
                            params: {
                                pathParameter: { id: idParameter, relation: relationParameter },
                                queryParameter: {
                                    ...queryParameter,
                                },
                            },
                        });
                        return resultGet as APIGatewayProxyResult;
                    } else if (idParameter) {
                        const resultGet = await this.menuController.getById({
                            header: headerString,
                            params: {
                                pathParameter: { id: idParameter },
                                queryParameter: {
                                    ...queryParameter,
                                },
                            },
                        });
                        return resultGet as APIGatewayProxyResult;
                    } else {
                        const resultGet = await this.menuController.getAll({
                            header: headerString,
                            params: { queryParameter },
                        });
                        return resultGet as APIGatewayProxyResult;
                    }

                case HTTPMethodEnum.DELETE.toString():
                    const resultDelete = await this.menuController.delete({
                        header: headerString,
                        params: { pathParameter: { id: idParameter } },
                    });
                    return resultDelete as APIGatewayProxyResult;

                default:
                    const response = new JSONAPIHandler().mountErrorResponseNotFound();
                    return response as APIGatewayProxyResult;
            }
        } catch (error: any) {
            console.log(error);
            return defineErrorResponse(error.message) as APIGatewayProxyResult;
        }
    };
}

const menuRepository = new PrismaMenusRepository();
const ingredientRepository = new PrismaIngredientRepository();
const snackRepository = new PrismaSnacksRepository();
const menuService = new MenuService(menuRepository, snackRepository, ingredientRepository);
const menuController = new MenuController(menuService);

export const lambdaMenuHandler = new MenuHandler(menuController).lambdaMenuHandler;
