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
