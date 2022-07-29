import CategoryValidatorFactory, {
    CategoryRules,
	CategoryValidator,
} from './category.validator';

describe('CategoryValidator Tests', () => {
	let validator: CategoryValidator;

	beforeEach(() => (validator = CategoryValidatorFactory.create()));
	test('invalidation cases for name field', () => {
		let isValid = validator.validate(null);

		expect(isValid).toBe(false);
		expect(validator.errors['name']).toStrictEqual([
			'name should not be empty',
			'name must be a string',
			'name must be shorter than or equal to 255 characters',
		]);

		isValid = validator.validate({ name: '' });

		expect(isValid).toBe(false);
		expect(validator.errors['name']).toStrictEqual([
			'name should not be empty',
		]);

		isValid = validator.validate({ name: 5 as any });

		expect(isValid).toBe(false);
		expect(validator.errors['name']).toStrictEqual([
			'name must be a string',
			'name must be shorter than or equal to 255 characters',
		]);

		isValid = validator.validate({ name: 'a'.repeat(256) });

		expect(isValid).toBe(false);
		expect(validator.errors['name']).toStrictEqual([
			'name must be shorter than or equal to 255 characters',
		]);
	});

	test('valid cases for fields', () => {

        const arrange = [
            { name: 'some value' },
            { name: 'some value', description: 'some description' },
            { name: 'some value', description: undefined },
            { name: 'some value', description: 'some description', is_active: false },
        ];

        arrange.forEach(item => {
            const isValid = validator.validate(item);
            expect(isValid).toBe(true);
            expect(validator.errors).toBeNull();
            expect(validator.validatedData).toStrictEqual(new CategoryRules(item));
        });
    });
});
