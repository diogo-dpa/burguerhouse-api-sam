import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SnackController } from '../controllers/SnackController';
import { SnackService } from '../services/SnackService';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';
import { ErrorHandler } from '../utils/ErrorHandler';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';

export const lambdaSnackHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const snackRepository = new PrismaSnacksRepository();
        const ingredientRepository = new PrismaIngredientRepository();
        const snackService = new SnackService(snackRepository, ingredientRepository);
        const snackController = new SnackController(snackService);
        console.log(JSON.stringify(event));

        const idParameter = event.pathParameters?.id ?? '';
        switch (event.httpMethod) {
            case 'POST':
                const resultPost = await snackController.create(event.body ?? '');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: resultPost,
                    }),
                };
            case 'GET':
                if (idParameter) {
                    const resultGet = await snackController.getById(idParameter);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            data: resultGet,
                        }),
                    };
                } else {
                    const resultGet = await snackController.getAll();
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            data: resultGet,
                        }),
                    };
                }
            case 'PUT':
                const resultPut = await snackController.update(idParameter, event.body ?? '');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: resultPut,
                    }),
                };
            case 'DELETE':
                await snackController.delete(idParameter);
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'OK',
                    }),
                };

            default:
                console.log('ERROR');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'ERRO',
                    }),
                };
        }
    } catch (error) {
        console.log(error);
        return ErrorHandler.internalServerErrorHandler(error);
    }
};
