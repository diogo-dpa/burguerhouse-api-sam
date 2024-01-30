import { JsonAPIQueryOptions } from '../../../utils/jsonapi/typesJsonapi';

// Header
export const mockHeaderRequest = { 'Content-Type': 'application/vnd.api+json' };
export const mockWrongHeaderRequest = { 'Content-Type': 'some-content-type' };
export const mockWrongBodyDataPrimaryAttributesRequest = { data: {}, meta: {}, 'other-attribute': {} };
export const mockWrongBodyDataAttributeAsNull = { data: null, meta: {} };
export const mockWrongBodyDataTypeDifferent = { data: { type: 'some-type', id: '1' }, meta: {} };

// Query Params
export const mockQueryParamsRequest: JsonAPIQueryOptions = {
    include: {},
    fields: {} as Record<string, string>[],
    sort: {} as Record<string, string>[],
    page: {} as Record<string, string>[],
    filter: {} as Record<string, string>[],
};

export const mockPathParamsRequest = {};
export const mockPathParamsWithIdRequest = { id: '1' };

// JSON API
export const mockJsonAPIResponseClause = {
    version: '1.0',
    authors: ['Diogo Almazan'],
};

// Errors
export const mockErrorResponseUnsuporttedMediaType = {
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
            ...mockJsonAPIResponseClause,
        },
    }),
};

export const mockErrorResponseBadRequest = (errorMessage?: string) => ({
    statusCode: 400,
    body: JSON.stringify({
        errors: [
            {
                status: 400,
                title: 'Bad Request',
                detail: `The request is not appropriate to the API rules. Ensure sending the right parameters.${
                    errorMessage ? ' Detail: ' + errorMessage : ''
                }`,
            },
        ],
        jsonapi: {
            ...mockJsonAPIResponseClause,
        },
    }),
});

export const mockErrorResponseNotFound = (errorMessage?: string) => ({
    statusCode: 404,
    body: JSON.stringify({
        errors: [
            {
                status: 404,
                title: 'Not Found',
                detail: `The related resource does not exist. Ensure sending the right parameters.${
                    errorMessage ? ' Detail: ' + errorMessage : ''
                }`,
            },
        ],
        jsonapi: {
            ...mockJsonAPIResponseClause,
        },
    }),
});

export const mockErrorResponseConflict = (errorMessage?: string) => ({
    statusCode: 409,
    body: JSON.stringify({
        errors: [
            {
                status: 409,
                title: 'Conflict',
                detail: `The request violets the server constraints.${errorMessage ? ' Detail: ' + errorMessage : ''}`,
            },
        ],
        jsonapi: {
            ...mockJsonAPIResponseClause,
        },
    }),
});

export const mockErrorResponseForbidden = (errorMessage?: string) => ({
    statusCode: 403,
    body: JSON.stringify({
        errors: [
            {
                status: 403,
                title: 'Forbidden',
                detail: `Unsupported request according to the current state of the resource.${
                    errorMessage ? ' Detail: ' + errorMessage : ''
                }`,
            },
        ],
        jsonapi: {
            ...mockJsonAPIResponseClause,
        },
    }),
});

export const mockErrorResponseInternalServerError = (errorMessage?: string) => ({
    statusCode: 500,
    body: JSON.stringify({
        errors: [
            {
                status: 500,
                title: 'Internal server error',
                detail: `An unexpected error occured during the proccess.${
                    errorMessage ? ' Detail: ' + errorMessage : ''
                }`,
            },
        ],
        jsonapi: {
            ...mockJsonAPIResponseClause,
        },
    }),
});
