import { Category } from '@fc/micro-videos/category/domain';

export class CategoryFixture {
    static keysInResponse() {
        return ['id', 'name', 'description', 'is_active', 'created_at'];
    }

    static arrangeForSave() {
        const faker = Category.fake().aCategory().withName('Category 1');
        return [
            {
                send_data: {
                    name: faker.name,
                },
                expected: {
                    description: null,
                    is_active: true,
                },
            },
            {
                send_data: {
                    name: faker.name,
                    description: null,
                },
                expected: {
                    is_active: true,
                },
            },
            {
                send_data: {
                    name: faker.name,
                    is_active: false,
                },
                expected: {
                    description: null,
                    is_active: false,
                },
            },
            {
                send_data: {
                    name: faker.name,
                    description: faker.description,
                    is_active: false,
                },
                expected: {
                    is_active: false,
                },
            },
        ];
    }

    static arrangeInvalidRequest() {
        const faker = Category.fake().aCategory();
        const defaultExpected = {
            statusCode: 422,
            error: 'Unprocessable Entity',
        };
        return {
            BODY_EMPTY: {
                send_data: {},
                expected: {
                    message: [
                        'name should not be empty',
                        'name must be a string',
                    ],
                    ...defaultExpected,
                },
            },
            NAME_EMPTY: {
                send_data: {
                    name: faker.withInvalidNameEmpty('').name,
                },
                expected: {
                    message: ['name should not be empty'],
                    ...defaultExpected,
                },
            },
            NAME_UNDEFINED: {
                send_data: {
                    name: faker.withInvalidNameEmpty(undefined).name,
                },
                expected: {
                    message: [
                        'name should not be empty',
                        'name must be a string',
                    ],
                    ...defaultExpected,
                },
            },
            NAME_NULL: {
                send_data: {
                    name: faker.withInvalidNameEmpty(null).name,
                },
                expected: {
                    message: [
                        'name should not be empty',
                        'name must be a string',
                    ],
                    ...defaultExpected,
                },
            },
            NAME_NOT_STRING: {
                send_data: {
                    name: faker.withInvalidNameNotAStr(1).name,
                },
                expected: {
                    message: ['name must be a string'],
                    ...defaultExpected,
                },
            },
            DESCRIPTION_NOT_STRING: {
                send_data: {
                    name: faker.withName('Category 1').name,
                    description:
                        faker.withInvalidDescriptionNotAStr(1).description,
                },
                expected: {
                    message: ['description must be a string'],
                    ...defaultExpected,
                },
            },
            IS_ACTIVE_NOT_BOOLEAN: {
                send_data: {
                    name: faker.withName('Category 1').name,
                    is_active: faker.withInvalidIsActiveNotABool(1).is_active,
                },
                expected: {
                    message: ['is_active must be a boolean value'],
                    ...defaultExpected,
                },
            },
        };
    }

    static arrangeForEntityValidationError() {
        const faker = Category.fake().aCategory();
        const defaultExpected = {
            statusCode: 422,
            error: 'Unprocessable Entity',
        };
        return {
            BODY_EMPTY: {
                send_data: {},
                expected: {
                    message: [
                        'name should not be empty',
                        'name must be a string',
                        'name must be shorter than or equal to 255 characters',
                    ],
                    ...defaultExpected,
                },
            },
            NAME_EMPTY: {
                send_data: {
                    name: faker.withInvalidNameEmpty('').name,
                },
                expected: {
                    message: ['name should not be empty'],
                    ...defaultExpected,
                },
            },
            NAME_UNDEFINED: {
                send_data: {
                    name: faker.withInvalidNameEmpty(undefined).name,
                },
                expected: {
                    message: [
                        'name should not be empty',
                        'name must be a string',
                        'name must be shorter than or equal to 255 characters',
                    ],
                    ...defaultExpected,
                },
            },
            NAME_NULL: {
                send_data: {
                    name: faker.withInvalidNameEmpty(null).name,
                },
                expected: {
                    message: [
                        'name should not be empty',
                        'name must be a string',
                        'name must be shorter than or equal to 255 characters',
                    ],
                    ...defaultExpected,
                },
            },
            NAME_NOT_STRING: {
                send_data: {
                    name: faker.withInvalidNameNotAStr(1).name,
                },
                expected: {
                    message: ['name must be a string', 'name must be shorter than or equal to 255 characters'],
                    ...defaultExpected,
                },
            },
            DESCRIPTION_NOT_STRING: {
                send_data: {
                    name: faker.withName('Category 1').name,
                    description:
                        faker.withInvalidDescriptionNotAStr(1).description,
                },
                expected: {
                    message: ['description must be a string'],
                    ...defaultExpected,
                },
            },
            IS_ACTIVE_NOT_BOOLEAN: {
                send_data: {
                    name: faker.withName('Category 1').name,
                    is_active: faker.withInvalidIsActiveNotABool(1).is_active,
                },
                expected: {
                    message: ['is_active must be a boolean value'],
                    ...defaultExpected,
                },
            },
        };
    }
}
