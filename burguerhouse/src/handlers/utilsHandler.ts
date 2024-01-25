export function createNestedObj(obj: Record<string, object | boolean>, keyPath: string[], value: boolean) {
    const lastKeyIndex = keyPath.length - 1;
    let objAux = { ...obj };
    for (let i = 0; i < lastKeyIndex; ++i) {
        const key = keyPath[i];
        if (!(key in objAux)) {
            objAux[key] = {};
        }
        objAux = obj[key] as Record<string, object | boolean>;
    }
    objAux[keyPath[lastKeyIndex]] = value;
}

export function formatQueryParameters(queryParameter: Record<string, any>): Record<string, any> {
    const formattedQueryParameter: Record<string, any> = {};

    if (queryParameter && 'sort' in queryParameter) {
        formattedQueryParameter.sort = queryParameter.sort.split(',').map((field: string) => {
            const format = field.trim()[0] === '-' ? field.slice(1) : field;
            const sort = field.trim()[0] === '-' ? 'desc' : 'asc';
            return {
                [format]: sort,
            };
        });
    }

    if (queryParameter && 'include' in queryParameter) {
        const includeObj: Record<string, object | boolean> = {};
        formattedQueryParameter.include = queryParameter.include.split(',').reduce((acm: object, field: string) => {
            const formattedField = field.trim();
            const hasNestedLevel = formattedField.includes('.');

            if (hasNestedLevel) {
                const levels = formattedField.split('.');
                const nestedIncludeObj: string[] = levels.reduce(
                    (acm, cur, i) => (i === levels.length - 1 ? [...acm, cur] : [...acm, cur, 'include']),
                    [] as string[],
                );
                createNestedObj(includeObj, nestedIncludeObj, true);
                return { ...acm, ...includeObj };
            }

            return {
                ...acm,
                [formattedField]: true,
            };
        }, {});
    }

    return formattedQueryParameter;
}
