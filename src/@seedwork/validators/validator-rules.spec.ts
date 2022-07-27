import ValidationError from "../errors/validation-error";
import ValidatorRules from "./validator-rules";

type ExpectedValidationRule = {
    value: any,
    property: string,
}

function assertIsInvalid({ value, property, rule, error }) {
    expect(() => {
        ValidatorRules.values(value, property)[rule]();
    }).toThrow(error);
}

function assertIsValid({value, property, rule, error}) {
    expect(() => {
        ValidatorRules.values(value, property)[rule]();
    }).not.toThrow(error);
}

describe('ValidatorRules Unit Tests', () => {
    test('values method', () => {
        const validator = ValidatorRules.values('some value', 'field');
        expect(validator).toBeInstanceOf(ValidatorRules);
        expect(validator['value']).toBe('some value');
        expect(validator['property']).toBe('field');        
    });

    test('required validation rule', () => {
        
        let arrange: ExpectedValidationRule[] = [
            {value: undefined, property: 'field'},
            {value: null, property: 'field'},
            {value: '', property: 'field'},
        ]

        arrange.forEach((item) => {
            assertIsInvalid({
                value: item.value, 
                property: item.property, 
                rule: 'required', 
                error: 'field is required'});
        });

        arrange = [
            {value: 'some value', property: 'field'},
            {value: 5, property: 'field'},
            {value: 0, property: 'field'},
            {value: true, property: 'field'},
        ]

        arrange.forEach((item) => {
            assertIsValid({
                value: item.value, 
                property: item.property, 
                rule: 'required', 
                error: 'field is required'});
        });

    });

    test('string validation rule', () => {
        let arrange: {value: any, property: string, messageError: string}[] = [
            {value: undefined, property: 'field', messageError: 'field must be a string'},
            {value: null, property: 'field', messageError: 'field must be a string'},
            {value: 5, property: 'field', messageError: 'field must be a string'},
            {value: true, property: 'field', messageError: 'field must be a string'},
            {value: {}, property: 'field', messageError: 'field must be a string'},
            {value: [], property: 'field', messageError: 'field must be a string'},
            {value: () => {}, property: 'field', messageError: 'field must be a string'},
        ]



    });
});