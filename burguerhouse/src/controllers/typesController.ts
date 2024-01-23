export type PathRequestOptions = {
    queryParameter?: Record<string, string>;
    pathParameter?: Record<string, string>;
};

export type ControllerOptions = {
    header: string;
    params?: PathRequestOptions;
    body?: string;
};
