import { JsonAPIQueryOptions } from '../utils/jsonapi/typesJsonapi';

export type PathRequestOptions = {
    queryParameter?: JsonAPIQueryOptions;
    pathParameter?: Record<string, string>;
};

export type ControllerOptions = {
    header: string;
    params?: PathRequestOptions;
    body?: string;
};
