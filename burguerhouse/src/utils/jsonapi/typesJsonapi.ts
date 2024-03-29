export enum JsonAPIProjectTypesEnum {
    people = 'people',
    order = 'order',
    orderItems = 'orderItems',
    ingredient = 'ingredient',
    snack = 'snack',
    snackItems = 'snackItems',
    menu = 'menu',
    menuItems = 'menuItems',
}

export type JsonAPIQueryOptions = {
    include?: Record<string, object | boolean>;
    fields?: Record<string, string>[];
    sort?: Record<string, string>[];
    page?: Record<string, string>[];
    filter?: Record<string, string>[];
};

export type JsonAPIBodyErrorType = {
    status?: number;
    id?: string;
    title?: string;
    detail?: string;
};

export type JsonAPIBodyErrorResponse = {
    errors: JsonAPIBodyErrorType[];
} & Omit<JsonAPIBodyResponse<any>, 'data'>;

export type JsonAPIRelationshipsDataType = {
    type: string;
    id: string;
};

export type JsonAPIBodyDataType<T> = {
    type: string;
    id?: string;
    attributes: Omit<T, 'id'>;
    relationships?: Record<string, Partial<JsonAPIBodyResponse<T>>>;
    links?: Record<string, string>;
};

export type JsonAPIBodyType<T> = {
    data: JsonAPIBodyDataType<T> | null;
};

export type JsonAPIBodyTypeArray<T> = {
    data: JsonAPIBodyDataType<T>[];
};

export type JsonAPIBodyResponse<T> = {
    links?: Record<string, string>;
    jsonapi?: Record<string, string | string[]>;
} & JsonAPIBodyType<T>;

export type JsonAPIBodyResponseArray<T> = {
    links?: Record<string, string>;
    jsonapi?: Record<string, string | string[]>;
} & JsonAPIBodyTypeArray<T>;

export type ControllerResponseJsonAPI = {
    statusCode: number;
    body?: string;
};

export type RelationshipType = { relations: string[]; includeData?: Record<string, boolean | object> | undefined };

export type MountSuccessResponseType = {
    options: { type: JsonAPIProjectTypesEnum; linkSelf: string; baseLinkReference?: string };
    body?: Record<string, any> | Record<string, any>[] | null;
    relationships?: RelationshipType | null;
    statusCode?: number;
};
