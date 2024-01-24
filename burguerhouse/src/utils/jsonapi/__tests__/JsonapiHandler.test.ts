import { expect, describe, it } from '@jest/globals';
import { JSONAPIHandler } from '../JsonapiHandler';
import {
    mockInputMountSuccessResponseArrayWithRelationship,
    mockInputMountSuccessResponseArrayWithoutRelationship,
    mockInputMountSuccessResponseRelationship,
    mockInputMountSuccessResponseRelationshipWithBodyEmpty,
    mockInputMountSuccessResponseWithRelationship,
    mockInputMountSuccessResponseWithoutRelationship,
    mockInputMountSuccessResponseWithoutRelationshipAndBody,
    mockOutMountSuccessResponseRelationship,
    mockOutputMountSuccessResponseArrayWithRelationship,
    mockOutputMountSuccessResponseArrayWithoutRelationship,
    mockOutputMountSuccessResponseRelationshipWithBodyEmpty,
    mockOutputMountSuccessResponseWithRelationship,
    mockOutputMountSuccessResponseWithoutRelationship,
    mockOutputMountSuccessResponseWithoutRelationshipAndBody,
} from './__mocks__/JsonapiHandler.mock';
import { JsonAPIProjectTypesEnum } from '../typesJsonapi';

describe('Unit test for JSON API Handler', function () {
    let jsonAPIHandler: JSONAPIHandler;

    beforeAll(() => {
        jsonAPIHandler = new JSONAPIHandler();
    });

    describe('Validation methods', () => {
        describe('validateContentType', () => {
            it('should return false when the content type is not application/vnd.api+json', () => {
                const result = jsonAPIHandler.validateContentType(
                    JSON.stringify({ 'Content-Type': 'application/json' }),
                );
                expect(result).toBeFalsy();
            });

            it('should return true when the content type is application/vnd.api+json', () => {
                const result = jsonAPIHandler.validateContentType(
                    JSON.stringify({ 'Content-Type': 'application/vnd.api+json' }),
                );
                expect(result).toBeTruthy();
            });
        });

        describe('validateAvailableDataPrimaryKeys', () => {
            it('should return false when the primary data has any invalid attribute', () => {
                const result = jsonAPIHandler.validateAvailableDataPrimaryKeys(
                    JSON.stringify({ data: {}, meta: {}, links: {}, primary: {}, errors: {}, jsonapi: {} }),
                );
                expect(result).toBeFalsy();
            });

            it('should return true when the content type is application/vnd.api+json', () => {
                const result = jsonAPIHandler.validateAvailableDataPrimaryKeys(
                    JSON.stringify({ data: {}, meta: {}, links: {}, included: {}, errors: {}, jsonapi: {} }),
                );
                expect(result).toBeTruthy();
            });
        });
    });

    describe('Successful Response methods', () => {
        describe('mountSuccessResponse', () => {
            it('should return an error when sending a body as an array', () => {
                const result = jsonAPIHandler.mountSuccessResponse({
                    options: { type: 'testing' as JsonAPIProjectTypesEnum, linkSelf: '' },
                    body: [],
                });
                expect(result).toEqual(jsonAPIHandler.mountErrorResponseConflict());
            });

            it('should return a successful response when body is null', () => {
                const result = jsonAPIHandler.mountSuccessResponse({
                    options: { type: 'testing' as JsonAPIProjectTypesEnum, linkSelf: 'some-url' },
                    body: null,
                });
                expect(result).toEqual({
                    statusCode: 200,
                    body: JSON.stringify({
                        data: null,
                        links: {
                            self: `http://localhost:3000/some-url`,
                        },
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });

            it('should return a successful response without relationship and body response with the correct data', () => {
                const result = jsonAPIHandler.mountSuccessResponse(
                    mockInputMountSuccessResponseWithoutRelationshipAndBody,
                );
                expect(result).toEqual({
                    statusCode: 200,
                    body: JSON.stringify(mockOutputMountSuccessResponseWithoutRelationshipAndBody),
                });
            });

            it('should return a successful response without a relationship response with the correct data', () => {
                const result = jsonAPIHandler.mountSuccessResponse(mockInputMountSuccessResponseWithoutRelationship);
                expect(result).toEqual({
                    statusCode: 200,
                    body: JSON.stringify(mockOutputMountSuccessResponseWithoutRelationship),
                });
            });

            it('should return a successful response with a relationship response with the correct data', () => {
                const result = jsonAPIHandler.mountSuccessResponse(mockInputMountSuccessResponseWithRelationship);
                expect(result).toEqual({
                    statusCode: 200,
                    body: JSON.stringify(mockOutputMountSuccessResponseWithRelationship),
                });
            });
        });

        describe('mountSuccessResponseArray', () => {
            it('should return an error 415 when sending a body without relationship and body', () => {
                const result = jsonAPIHandler.mountSuccessResponseArray(
                    mockInputMountSuccessResponseWithoutRelationshipAndBody,
                );
                expect(result).toEqual(jsonAPIHandler.mountErrorResponseConflict());
            });

            it('should return a successful response when body is an empty array', () => {
                const result = jsonAPIHandler.mountSuccessResponseArray({
                    options: { type: 'testing' as JsonAPIProjectTypesEnum, linkSelf: 'some-url' },
                    body: [],
                });
                expect(result).toEqual({
                    statusCode: 200,
                    body: JSON.stringify({
                        data: [],
                        links: {
                            self: `http://localhost:3000/some-url`,
                        },
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });

            it('should return a successful response without a relationship response with the correct data', () => {
                const result = jsonAPIHandler.mountSuccessResponseArray(
                    mockInputMountSuccessResponseArrayWithoutRelationship,
                );
                expect(result).toEqual({
                    statusCode: 200,
                    body: JSON.stringify(mockOutputMountSuccessResponseArrayWithoutRelationship),
                });
            });

            it('should return a successful response with a relationship response with the correct data', () => {
                const result = jsonAPIHandler.mountSuccessResponseArray(
                    mockInputMountSuccessResponseArrayWithRelationship,
                );
                expect(result).toEqual({
                    statusCode: 200,
                    body: JSON.stringify(mockOutputMountSuccessResponseArrayWithRelationship),
                });
            });
        });

        describe('mountSuccessResponseRelationshipArray', () => {
            it('should return a successful response when sending the body as an empty array', () => {
                const result = jsonAPIHandler.mountSuccessResponseRelationshipArray(
                    mockInputMountSuccessResponseRelationshipWithBodyEmpty,
                );
                expect(result).toEqual({
                    statusCode: 200,
                    body: JSON.stringify(mockOutputMountSuccessResponseRelationshipWithBodyEmpty),
                });
            });

            it('should return a successful response when sending all the parameters correctly', () => {
                const result = jsonAPIHandler.mountSuccessResponseRelationshipArray(
                    mockInputMountSuccessResponseRelationship,
                );
                expect(result).toEqual({
                    statusCode: 200,
                    body: JSON.stringify(mockOutMountSuccessResponseRelationship),
                });
            });
        });
    });

    describe('Error Response methods', () => {
        describe('mountErrorResponseForbidden', () => {
            it('should return an error 403 without a message when calling the method without a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseForbidden();
                expect(result).toEqual({
                    statusCode: 403,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 403,
                                title: 'Forbidden',
                                detail: 'Unsupported request according to the current state of the resource.',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });

            it('should return an error 403 with a message when calling the method with a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseForbidden('error-message');
                expect(result).toEqual({
                    statusCode: 403,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 403,
                                title: 'Forbidden',
                                detail: 'Unsupported request according to the current state of the resource. Detail: error-message',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });
        });

        describe('mountErrorResponseBadRequest', () => {
            it('should return an error 400 without a message when calling the method without a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseBadRequest();
                expect(result).toEqual({
                    statusCode: 400,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 400,
                                title: 'Bad Request',
                                detail: 'The request is not appropriate to the API rules. Ensure sending the right parameters.',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });

            it('should return an error 400 with a message when calling the method with a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseBadRequest('error-message');
                expect(result).toEqual({
                    statusCode: 400,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 400,
                                title: 'Bad Request',
                                detail: 'The request is not appropriate to the API rules. Ensure sending the right parameters. Detail: error-message',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });
        });

        describe('mountErrorResponseNotFound', () => {
            it('should return an error 404 without a message when calling the method without a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseNotFound();
                expect(result).toEqual({
                    statusCode: 404,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 404,
                                title: 'Not Found',
                                detail: 'The related resource does not exist. Ensure sending the right parameters.',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });

            it('should return an error 404 with a message when calling the method with a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseNotFound('error-message');
                expect(result).toEqual({
                    statusCode: 404,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 404,
                                title: 'Not Found',
                                detail: 'The related resource does not exist. Ensure sending the right parameters. Detail: error-message',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });
        });

        describe('mountErrorResponseConflict', () => {
            it('should return an error 409 without a message when calling the method without a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseConflict();
                expect(result).toEqual({
                    statusCode: 409,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 409,
                                title: 'Conflict',
                                detail: 'The request violets the server constraints.',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });

            it('should return an error 409 with a message when calling the method with a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseConflict('error-message');
                expect(result).toEqual({
                    statusCode: 409,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 409,
                                title: 'Conflict',
                                detail: 'The request violets the server constraints. Detail: error-message',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });
        });

        describe('mountErrorResponseUnsupportedMediaType', () => {
            it('should return an error 415 without a message when calling the method without a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseUnsupportedMediaType();
                expect(result).toEqual({
                    statusCode: 415,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 415,
                                title: 'Unsupported Media Type',
                                detail: 'The request is not appropriate accordingly to the server rules.',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });

            it('should return an error 415 with a message when calling the method with a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseUnsupportedMediaType('error-message');
                expect(result).toEqual({
                    statusCode: 415,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 415,
                                title: 'Unsupported Media Type',
                                detail: 'The request is not appropriate accordingly to the server rules. Detail: error-message',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });
        });

        describe('mountErrorResponseInternalServer', () => {
            it('should return an error 500 without a message when calling the method without a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseInternalServer();
                expect(result).toEqual({
                    statusCode: 500,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 500,
                                title: 'Internal server error',
                                detail: 'An unexpected error occured during the proccess.',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });

            it('should return an error 500 with a message when calling the method with a parameter', () => {
                const result = jsonAPIHandler.mountErrorResponseInternalServer('error-message');
                expect(result).toEqual({
                    statusCode: 500,
                    body: JSON.stringify({
                        errors: [
                            {
                                status: 500,
                                title: 'Internal server error',
                                detail: 'An unexpected error occured during the proccess. Detail: error-message',
                            },
                        ],
                        jsonapi: {
                            version: '1.0',
                            authors: ['Diogo Almazan'],
                        },
                    }),
                });
            });
        });
    });
});
