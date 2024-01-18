import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MenuController } from '../controllers/MenuController';
import { MenuService } from '../services/MenuService';
import { PrismaMenusRepository } from '../repositories/prisma/PrismaMenusRepository';
import { ErrorHandler } from '../utils/ErrorHandler';
import { PrismaIngredientRepository } from '../repositories/prisma/PrismaIngredientRepository';
import { HTTPMethodEnum } from '../utils/commonEnums';
import { PrismaSnacksRepository } from '../repositories/prisma/PrismaSnacksRepository';

export const lambdaMenuHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const menuRepository = new PrismaMenusRepository();
        const ingredientRepository = new PrismaIngredientRepository();
        const snackRepository = new PrismaSnacksRepository();
        const menuService = new MenuService(menuRepository, snackRepository, ingredientRepository);
        const menuController = new MenuController(menuService);

        const idParameter = event.pathParameters?.id ?? '';
        switch (event.httpMethod) {
            case HTTPMethodEnum.POST.toString():
                const resultPost = await menuController.create(event.body ?? '');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: resultPost,
                    }),
                };
            case HTTPMethodEnum.GET.toString():
                if (idParameter) {
                    const resultGet = await menuController.getById(idParameter);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            data: resultGet,
                        }),
                    };
                } else {
                    const resultGet = await menuController.getAll();
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            data: resultGet,
                        }),
                    };
                }
            case HTTPMethodEnum.PUT.toString():
                const resultPut = await menuController.update(idParameter, event.body ?? '');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: resultPut,
                    }),
                };
            case HTTPMethodEnum.DELETE.toString():
                await menuController.delete(idParameter);
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
