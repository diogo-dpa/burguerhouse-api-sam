import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { IngredientController } from '../controllers/IngredientController';
import { IngredientService } from '../services/IngredientService';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { HTTPMethodEnum } from '../utils/commonEnums';
import { formatQueryParameters } from './utilsHandler';
import { defineErrorResponse } from '../controllers/utilsController';
import { JSONAPIHandler } from '../utils/jsonapi/JsonapiHandler';

export class IngredientHandler {
    private ingredientController: IngredientController;

    constructor(_ingredientController: IngredientController) {
        this.ingredientController = _ingredientController;
    }

    public lambdaIngredientHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const idParameter = event.pathParameters?.id ?? '';
            const headerString = JSON.stringify(event.headers);
            const parsedQueryParameter = JSON.stringify(event.queryStringParameters ?? '');
            const queryParameter = formatQueryParameters(JSON.parse(parsedQueryParameter));

            switch (event.httpMethod) {
                case HTTPMethodEnum.POST.toString():
                    const resultPost = await this.ingredientController.create({
                        header: headerString,
                        params: {
                            queryParameter,
                        },
                        body: event.body ?? '',
                    });
                    return resultPost as APIGatewayProxyResult;
                case HTTPMethodEnum.PATCH.toString():
                    const resultPut = await this.ingredientController.update({
                        header: headerString,
                        params: { pathParameter: { id: idParameter }, queryParameter },
                        body: event.body ?? '',
                    });
                    return resultPut as APIGatewayProxyResult;
                case HTTPMethodEnum.GET.toString():
                    if (idParameter) {
                        const resultGet = await this.ingredientController.getById({
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
                        const resultGet = await this.ingredientController.getAll({
                            header: headerString,
                            params: { queryParameter },
                        });
                        return resultGet as APIGatewayProxyResult;
                    }

                case HTTPMethodEnum.DELETE.toString():
                    const resultDelete = await this.ingredientController.delete({
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

const ingredientRepository = new PrismaIngredientRepository();
const ingredientService = new IngredientService(ingredientRepository);
const ingredientController = new IngredientController(ingredientService);

export const lambdaIngredientHandler = new IngredientHandler(ingredientController).lambdaIngredientHandler;
