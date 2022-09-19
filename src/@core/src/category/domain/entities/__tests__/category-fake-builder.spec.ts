import { Chance } from 'chance';
import { CategoryFakeBuilder } from '../category-fake-builder';

describe('Category Fake Builder Unit Tests', () => {
	describe('name property', () => {
		const faker = CategoryFakeBuilder.aCategory();

		it('should be a function', () => {
			expect(typeof faker['name'] === 'function').toBeTruthy();
		});

		it('should call word method of Chance', () => {
			const chance = Chance();
			const spyWordMethod = jest.spyOn(chance, 'word');
			faker['chance'] = chance;

			faker.build();

			expect(spyWordMethod).toHaveBeenCalled();
		});

		test('with name', () => {
			const $this = faker.withName('some name');
			expect($this).toBeInstanceOf(CategoryFakeBuilder);
			expect(faker['name']).toBe('some name');

			faker.withName('Movie');
			expect(faker['name']).toBe('Movie');

			faker.withName(() => 'Movie');
			//@ts-expect-error name is callable
			expect(faker['name']()).toBe('Movie');
		});

		test('with empty case', () => {
			faker.withInvalidNameEmpty(undefined);
			expect(faker['name']).toBeUndefined();

			faker.withInvalidNameEmpty(null);
			expect(faker['name']).toBeNull();

			faker.withInvalidNameEmpty('');
			expect(faker['name']).toBe('');
		});

		test('with not a string case', () => {
			faker.withInvalidNameNotAStr(5);
			expect(faker['name']).toBe(5);

			faker.withInvalidNameNotAStr({});
			expect(faker['name']).toEqual({});

			faker.withInvalidNameNotAStr(null);
			expect(faker['name']).toBe(5);
		});

		test('with too long case', () => {
			faker.withInvalidNameTooLong('a'.repeat(256));
			expect(faker['name']).toBe('a'.repeat(256));

			faker.withInvalidNameTooLong(null);
			expect(faker['name']).toHaveLength(256);
		});

		it('should pass index to name factory', () => {
			faker.withName((index) => `Movie ${index}`);
			const category = faker.build();

			expect(category.name).toBe('Movie 0');

			const fakerMany = CategoryFakeBuilder.theCategories(2);
			fakerMany.withName((index) => `Movie ${index}`);
			const categories = fakerMany.build();

			expect(categories[0].name).toBe('Movie 0');
			expect(categories[1].name).toBe('Movie 1');
		});
	});

	describe('description property', () => {
		const faker = CategoryFakeBuilder.aCategory();
		it('should be a function', () => {
			expect(typeof faker['description'] === 'function').toBeTruthy();
		});

		it('should call paragraph method of Chance', () => {
			const chance = Chance();
			const spyParagraphMethod = jest.spyOn(chance, 'paragraph');
			faker['chance'] = chance;

			faker.build();

			expect(spyParagraphMethod).toHaveBeenCalled();
		});

		test('with description', () => {
			faker.withDescription('Movie');
			expect(faker['description']).toBe('Movie');

			faker.withDescription(() => 'Movie');
			//@ts-expect-error description is callable
			expect(faker['description']()).toBe('Movie');
		});

		test('with not a string case', () => {
			faker.withInvalidDescriptionNotAStr(5);
			expect(faker['description']).toBe(5);

			faker.withInvalidDescriptionNotAStr({});
			expect(faker['description']).toEqual({});

			faker.withInvalidDescriptionNotAStr(null);
			expect(faker['description']).toBe(5);
		});

		it('should pass index to description factory', () => {
			faker.withDescription((index) => `Movie ${index}`);
			const category = faker.build();

			expect(category.description).toBe('Movie 0');

			const fakerMany = CategoryFakeBuilder.theCategories(2);
			fakerMany.withDescription((index) => `Movie ${index}`);
			const categories = fakerMany.build();

			expect(categories[0].description).toBe('Movie 0');
			expect(categories[1].description).toBe('Movie 1');
		});
	});

	describe('is_active property', () => {
		const faker = CategoryFakeBuilder.aCategory();
		it('should be a function', () => {
			expect(typeof faker['is_active'] === 'function').toBeTruthy();
		});

		test('activate', () => {
			faker.activate();
			expect(faker['is_active']).toBe(true);
		});

		test('deactivate', () => {
			faker.deactivate();
			expect(faker['is_active']).toBe(false);
		});

		test('with not a boolean case', () => {
			faker.withInvalidIsActiveNotABool(5);
			expect(faker['is_active']).toBe(5);

			faker.withInvalidIsActiveNotABool({});
			expect(faker['is_active']).toEqual({});

			faker.withInvalidIsActiveNotABool(null);
			expect(faker['is_active']).toBe(5);
		});

		test('with a empty case', () => {
			faker.withInvalidIsActiveEmpty(undefined);
			expect(faker['is_active']).toBeUndefined();

			faker.withInvalidIsActiveEmpty(null);
			expect(faker['is_active']).toBeNull();

			faker.withInvalidIsActiveEmpty('');
			expect(faker['is_active']).toBe('');
		});
	});
});
