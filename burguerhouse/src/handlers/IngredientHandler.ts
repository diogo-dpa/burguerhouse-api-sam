import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { IngredientController } from '../controllers/IngredientController';
import { IngredientService } from '../services/IngredientService';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { ErrorHandler } from '../utils/ErrorHandler';
import { HTTPMethodEnum } from '../utils/commonEnums';

export const lambdaIngredientHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userRepository = new PrismaIngredientRepository();
        const ingredientService = new IngredientService(userRepository);
        const ingredientController = new IngredientController(ingredientService);
        console.log(JSON.stringify(event));

        const idParameter = event.pathParameters?.id ?? '';
        switch (event.httpMethod) {
            case HTTPMethodEnum.POST.toString():
                const resultPost = await ingredientController.create(event.body ?? '');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: resultPost,
                    }),
                };
            case HTTPMethodEnum.GET.toString():
                if (idParameter) {
                    const resultGet = await ingredientController.getById(idParameter);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            data: resultGet,
                        }),
                    };
                } else {
                    const resultGet = await ingredientController.getAll();
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            data: resultGet,
                        }),
                    };
                }
            case HTTPMethodEnum.PUT.toString():
                const resultPut = await ingredientController.update(idParameter, event.body ?? '');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: resultPut,
                    }),
                };
            case HTTPMethodEnum.DELETE.toString():
                await ingredientController.delete(idParameter);
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'OK',
                    }),
                };

            default:
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Something went wrong',
                    }),
                };
        }
    } catch (error) {
        console.log(error);
        return ErrorHandler.internalServerErrorHandler(error);
    }
};
