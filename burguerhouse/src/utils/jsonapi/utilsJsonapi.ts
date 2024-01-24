import { JsonAPIProjectTypesEnum } from './typesJsonapi';

export function mapRelationTypeToModelType(relationType: JsonAPIProjectTypesEnum) {
    switch (relationType) {
        case JsonAPIProjectTypesEnum.order:
            return 'orders';
        case JsonAPIProjectTypesEnum.orderItems:
            return 'orderItems';
        case JsonAPIProjectTypesEnum.ingredient:
            return 'ingredients';
        case JsonAPIProjectTypesEnum.people:
            return 'users';
        case JsonAPIProjectTypesEnum.snack:
            return 'snacks';
        case JsonAPIProjectTypesEnum.menu:
            return 'menus';
        default:
            return '';
    }
}

export function convertNestedObjectIntoArray(obj: object): string[] {
    const ref = Object.entries(obj);

    if (!ref.length) return [];

    return ref.reduce((acm: string[], item) => {
        const refKey = item[0];
        const refValue = item[1];

        if (refKey === 'include') return [...acm, ...convertNestedObjectIntoArray(refValue)];

        return [...acm, [refKey, ...convertNestedObjectIntoArray(refValue)].join('.')];
    }, []);
}
