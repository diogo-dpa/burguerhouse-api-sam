import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SnackController } from '../controllers/SnackController';
import { SnackService } from '../services/SnackService';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { HTTPMethodEnum } from '../utils/commonEnums';
import { formatQueryParameters } from './utilsHandler';
import { JSONAPIHandler } from '../utils/jsonapi/JsonapiHandler';
import { defineErrorResponse } from '../controllers/utilsController';

export class SnackHandler {
    private snackController: SnackController;

    constructor(_snackController: SnackController) {
        this.snackController = _snackController;
    }

    public lambdaSnackHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const idParameter = event.pathParameters?.id ?? '';
            const relationParameter = event.pathParameters?.relation ?? '';
            const headerString = JSON.stringify(event.headers);
            const parsedQueryParameter = JSON.stringify(event.queryStringParameters ?? '');
            const queryParameter = formatQueryParameters(JSON.parse(parsedQueryParameter));

            switch (event.httpMethod) {
                case HTTPMethodEnum.POST.toString():
                    const resultPost = await this.snackController.create({
                        header: headerString,
                        params: {
                            queryParameter,
                        },
                        body: event.body ?? '',
                    });
                    return resultPost as APIGatewayProxyResult;

                case HTTPMethodEnum.PATCH.toString():
                    const resultPut = await this.snackController.update({
                        header: headerString,
                        params: { pathParameter: { id: idParameter }, queryParameter },
                        body: event.body ?? '',
                    });
                    return resultPut as APIGatewayProxyResult;
                case HTTPMethodEnum.GET.toString():
                    if (relationParameter) {
                        const resultGet = await this.snackController.getRelationshipById({
                            header: headerString,
                            params: {
                                pathParameter: { id: idParameter },
                                queryParameter: {
                                    ...queryParameter,
                                },
                            },
                        });
                        return resultGet as APIGatewayProxyResult;
                    } else if (idParameter) {
                        const resultGet = await this.snackController.getById({
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
                        const resultGet = await this.snackController.getAll({
                            header: headerString,
                            params: { queryParameter },
                        });
                        return resultGet as APIGatewayProxyResult;
                    }

                case HTTPMethodEnum.DELETE.toString():
                    const resultDelete = await this.snackController.delete({
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

const snackRepository = new PrismaSnacksRepository();
const ingredientRepository = new PrismaIngredientRepository();
const nackService = new SnackService(snackRepository, ingredientRepository);
const snackController = new SnackController(nackService);

export const lambdaSnackHandler = new SnackHandler(snackController).lambdaSnackHandler;
