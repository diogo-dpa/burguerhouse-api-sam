import { describe, expect, it } from '@jest/globals';
import { ErrorHandler } from '../ErrorHandler';

describe('ErrorHandler', () => {
    describe('returnNotFoundCustomError', () => {
        it('should return the not found code without a message when passing empty string', () => {
            expect(ErrorHandler.returnNotFoundCustomError('')).toEqual('404 - ');
        });

        it('should return the not found code with a message', () => {
            expect(ErrorHandler.returnNotFoundCustomError('some-custom-message')).toEqual('404 - some-custom-message');
        });
    });

    describe('returnBadRequestCustomError', () => {
        it('should return the not found code without a message when passing empty string', () => {
            expect(ErrorHandler.returnBadRequestCustomError('')).toEqual('400 - ');
        });

        it('should return the not found code with a message', () => {
            expect(ErrorHandler.returnBadRequestCustomError('some-custom-message')).toEqual(
                '400 - some-custom-message',
            );
        });
    });

    describe('validateStringIdReturningBool', () => {
        it.each([
            ['false', 'null', null, false],
            ['false', 'undefined', undefined, false],
            ['false', 'empty string', '', false],
            ['false', 'a boolean value (true)', true, false],
            ['false', 'a boolean value (false)', false, false],
            ['false', 'a number value (1)', 1, false],
            ['false', 'a number value (0)', 0, false],
            ['false', 'a number in string', '1', false],
            ['true', 'a valid string', 'some-string', true],
        ])('should return %s when passing %s', (_label1, _label2, input, output) => {
            expect(ErrorHandler.validateStringIdReturningBool(input as string)).toEqual(output);
        });
    });

    describe('validateStringParameterReturningBool', () => {
        it.each([
            ['false', 'null', null, false],
            ['false', 'undefined', undefined, false],
            ['false', 'empty string', '', false],
            ['false', 'a boolean value (true)', true, false],
            ['false', 'a boolean value (false)', false, false],
            ['false', 'a number value (1)', 1, false],
            ['false', 'a number value (0)', 0, false],
            ['true', 'a valid string', 'some-string', true],
        ])('should return %s when passing %s', (_label1, _label2, input, output) => {
            expect(ErrorHandler.validateStringParameterReturningBool(input as string)).toEqual(output);
        });
    });

    describe('validateBooleanParameterReturningBool', () => {
        it.each([
            ['false', 'null', null, false],
            ['false', 'undefined', undefined, false],
            ['false', 'empty string', '', false],
            ['false', 'a number value (1)', 1, false],
            ['false', 'a number value (0)', 0, false],
            ['false', 'a valid string', 'some-string', false],
            ['true', 'a boolean value (true)', true, true],
            ['true', 'a boolean value (false)', false, true],
        ])('should return %s when passing %s', (_label1, _label2, input, output) => {
            expect(ErrorHandler.validateBooleanParameterReturningBool(input as boolean)).toEqual(output);
        });
    });

    describe('validateNumberParameterReturningBool', () => {
        it.each([
            ['false', 'null', null, false],
            ['false', 'undefined', undefined, false],
            ['false', 'empty string', '', false],
            ['false', 'a valid string', 'some-string', false],
            ['false', 'a boolean value (true)', true, false],
            ['false', 'a boolean value (false)', false, false],
            ['true', 'a number value (1)', 1, true],
            ['true', 'a number value (0)', 0, true],
        ])('should return %s when passing %s', (_label1, _label2, input, output) => {
            expect(ErrorHandler.validateNumberParameterReturningBool(input as number)).toEqual(output);
        });
    });
});
