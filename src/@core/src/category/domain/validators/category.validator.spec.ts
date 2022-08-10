import CategoryValidatorFactory, {
	CategoryRules,
	CategoryValidator,
} from './category.validator';

describe('CategoryValidator Tests', () => {
	let validator: CategoryValidator;

	beforeEach(() => (validator = CategoryValidatorFactory.create()));
	test('invalidation cases for name field', () => {
		expect({ validator, data: null }).containsErrorMessages({
			name: [
				'name should not be empty',
				'name must be a string',
				'name must be shorter than or equal to 255 characters',
			],
		});

		expect({ validator, data: { name: '' } }).containsErrorMessages({
			name: ['name should not be empty'],
		});

		expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
			name: [
				'name must be a string',
				'name must be shorter than or equal to 255 characters',
			],
		});

		expect({
			validator,
			data: { name: 'a'.repeat(256) },
		}).containsErrorMessages({
			name: ['name must be shorter than or equal to 255 characters'],
		});
	});

	test('invalidation cases for description field', () => {
		expect({
			validator,
			data: { name: 'some name', description: 5 as any },
		}).containsErrorMessages({
			description: ['description must be a string'],
		});
	});

	test('invalidation cases for is_active field', () => {
		expect({
			validator,
			data: { name: 'some name', is_active: 5 as any },
		}).containsErrorMessages({
			is_active: ['is_active must be a boolean value'],
		});

		expect({
			validator,
			data: { name: 'some name', is_active: 'true' },
		}).containsErrorMessages({
			is_active: ['is_active must be a boolean value'],
		});
	});

	describe('valid cases for fields', () => {
		const arrange = [
			{ name: 'some value' },
			{ name: 'some value', description: 'some description' },
			{ name: 'some value', description: undefined },
			{
				name: 'some value',
				description: 'some description',
				is_active: false,
			},
		];

		test.each(arrange)(
			'validates %p',
			(item) => {
				const isValid = validator.validate(item);
				expect(isValid).toBe(true);
				expect(validator.errors).toBeNull();
				expect(validator.validatedData).toStrictEqual(
					new CategoryRules(item)
				);
			}
		);

	});
});
