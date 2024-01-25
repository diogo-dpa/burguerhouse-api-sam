import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';
import { HTTPMethodEnum } from '../utils/commonEnums';
import { JSONAPIHandler } from '../utils/jsonapi/JsonapiHandler';
import { formatQueryParameters } from './utilsHandler';
import { defineErrorResponse } from '../controllers/utilsController';

export class UserHandler {
    private userController: UserController;

    constructor(_userController: UserController) {
        this.userController = _userController;
    }

    public lambdaUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const idParameter = event.pathParameters?.id ?? '';
            const relationParameter = event.pathParameters?.relation ?? '';
            const headerString = JSON.stringify(event.headers);
            const parsedQueryParameter = JSON.stringify(event.queryStringParameters ?? '');
            const queryParameter = formatQueryParameters(JSON.parse(parsedQueryParameter));

            switch (event.httpMethod) {
                case HTTPMethodEnum.POST.toString():
                    const resultPost = await this.userController.create({
                        header: headerString,
                        params: {
                            queryParameter,
                        },
                        body: event.body ?? '',
                    });
                    return resultPost as APIGatewayProxyResult;
                case HTTPMethodEnum.PATCH.toString():
                    const resultPut = await this.userController.update({
                        header: headerString,
                        params: { pathParameter: { id: idParameter }, queryParameter },
                        body: event.body ?? '',
                    });
                    return resultPut as APIGatewayProxyResult;
                case HTTPMethodEnum.GET.toString():
                    if (relationParameter) {
                        const resultGet = await this.userController.getRelationshipById({
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
                        const resultGet = await this.userController.getById({
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
                        const resultGet = await this.userController.getAll({
                            header: headerString,
                            params: { queryParameter },
                        });
                        return resultGet as APIGatewayProxyResult;
                    }
                case HTTPMethodEnum.DELETE.toString():
                    const resultDelete = await this.userController.delete({
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

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export const lambdaUserHandler = new UserHandler(userController).lambdaUserHandler;
