import { expect, describe, it } from '@jest/globals';
import { JSONAPIHandler } from '../../utils/jsonapi/JsonapiHandler';
import { defineErrorResponse } from '../utilsController';

describe('utilsController', () => {
    describe('defineErrorResponse', () => {
        let jsonAPIHandler: JSONAPIHandler;

        beforeAll(() => {
            jsonAPIHandler = new JSONAPIHandler();
        });

        it('should return a jsonapi error response with status code 404', () => {
            const errorMessage = '404 - Some error message';
            const expectedResponse = jsonAPIHandler.mountErrorResponseNotFound('Some error message');
            const response = defineErrorResponse(errorMessage);
            expect(response).toEqual(expectedResponse);
        });

        it('should return a jsonapi error response with status code 500', () => {
            const errorMessage = '500 - Some other error message';
            const expectedResponse = jsonAPIHandler.mountErrorResponseInternalServer('Some other error message');
            const response = defineErrorResponse(errorMessage);
            expect(response).toEqual(expectedResponse);
        });

        it('should return a jsonapi error response with status code 500 when it doesn`t pass any parameter', () => {
            const errorMessage = '';
            const expectedResponse = jsonAPIHandler.mountErrorResponseInternalServer('');
            const response = defineErrorResponse(errorMessage);
            expect(response).toEqual(expectedResponse);
        });
    });
});
