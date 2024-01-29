import { expect, describe, it } from '@jest/globals';
import { convertNestedObjectIntoArray, mapRelationTypeToModelType, mapRelationTypeToRoute } from '../utilsJsonapi';
import { JsonAPIProjectTypesEnum } from '../typesJsonapi';

describe('Unit tests - utilsJsonapi', function () {
    describe('mapRelationTypeToRoute', () => {
        it('should return an empty string when the relation type is different from the mapped types', () => {
            expect(mapRelationTypeToRoute('Wrong type' as JsonAPIProjectTypesEnum)).toEqual('');
        });

        it('should return orders when the relation type is order', () => {
            expect(mapRelationTypeToRoute(JsonAPIProjectTypesEnum.order)).toEqual('orders');
        });

        it('should return orderItems when the relation type is orderItems', () => {
            expect(mapRelationTypeToRoute(JsonAPIProjectTypesEnum.orderItems)).toEqual('orderItems');
        });

        it('should return ingredients when the relation type is ingredient', () => {
            expect(mapRelationTypeToRoute(JsonAPIProjectTypesEnum.ingredient)).toEqual('ingredients');
        });

        it('should return users when the relation type is people', () => {
            expect(mapRelationTypeToRoute(JsonAPIProjectTypesEnum.people)).toEqual('users');
        });

        it('should return snacks when the relation type is snack', () => {
            expect(mapRelationTypeToRoute(JsonAPIProjectTypesEnum.snack)).toEqual('snacks');
        });

        it('should return menus when the relation type is menu', () => {
            expect(mapRelationTypeToRoute(JsonAPIProjectTypesEnum.menu)).toEqual('menus');
        });
    });

    describe('mapRelationTypeToModelType', () => {
        it('should return an empty string when the relation type is different from the mapped types', () => {
            expect(mapRelationTypeToModelType('Wrong type' as JsonAPIProjectTypesEnum)).toEqual('');
        });

        it('should return orders when the relation type is order', () => {
            expect(mapRelationTypeToModelType(JsonAPIProjectTypesEnum.order)).toEqual('orders');
        });

        it('should return orderItems when the relation type is orderItems', () => {
            expect(mapRelationTypeToModelType(JsonAPIProjectTypesEnum.orderItems)).toEqual('orderItems');
        });

        it('should return ingredients when the relation type is ingredient', () => {
            expect(mapRelationTypeToModelType(JsonAPIProjectTypesEnum.ingredient)).toEqual('ingredients');
        });

        it('should return users when the relation type is people', () => {
            expect(mapRelationTypeToModelType(JsonAPIProjectTypesEnum.people)).toEqual('user');
        });

        it('should return snacks when the relation type is snack', () => {
            expect(mapRelationTypeToModelType(JsonAPIProjectTypesEnum.snack)).toEqual('snacks');
        });

        it('should return menus when the relation type is menu', () => {
            expect(mapRelationTypeToModelType(JsonAPIProjectTypesEnum.menu)).toEqual('menus');
        });
    });

    describe('convertNestedObjectIntoArray', () => {
        it('should return an empty array when the object is empty', () => {
            expect(convertNestedObjectIntoArray({})).toEqual([]);
        });

        it("should return an empty array when the object has only one level with the key 'include'", () => {
            expect(convertNestedObjectIntoArray({ include: {} })).toEqual([]);
        });

        it('should return an array with the object key when the object only one level', () => {
            expect(convertNestedObjectIntoArray({ order: true })).toEqual(['order']);
        });

        it('should return an array with the object keys when the object has two levels', () => {
            expect(convertNestedObjectIntoArray({ order: { include: { orderItem: true } } })).toEqual([
                'order.orderItem',
            ]);
        });

        it('should return an array with the object keys when the object has more than two levels', () => {
            expect(
                convertNestedObjectIntoArray({ order: { include: { orderItem: { include: { ingredient: true } } } } }),
            ).toEqual(['order.orderItem.ingredient']);
        });

        it('should return an array with the object keys when the object has one level with more than two levels and one level in the surface', () => {
            expect(
                convertNestedObjectIntoArray({
                    order: { include: { orderItem: { include: { ingredient: true } } } },
                    menu: true,
                }),
            ).toEqual(['order.orderItem.ingredient', 'menu']);
        });

        it('should return an array with the object keys when the object has more than one level with more than one inner levels', () => {
            expect(
                convertNestedObjectIntoArray({
                    order: { include: { orderItem: { include: { ingredient: true } } } },
                    menu: { include: { snack: true } },
                }),
            ).toEqual(['order.orderItem.ingredient', 'menu.snack']);
        });
    });
});
