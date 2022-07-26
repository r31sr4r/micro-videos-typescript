import { UniqueEntityId } from '#seedwork/domain';
import { Chance } from 'chance';
import { CategoryFakeBuilder } from '../category-fake-builder';

describe('Category Fake Builder Unit Tests', () => {
	describe('unique_entity_id property', () => {
		const faker = CategoryFakeBuilder.aCategory();

		it('should throw error when any with methodos has called', () => {
			expect(() => faker['getValue']('unique_entity_id')).toThrow(
				new Error(
					`Property unique_entity_id not has value. Use 'with' method to set value`
				)
			);
		});

		it('should be undefined by default', () => {
			expect(faker['_unique_entity_id']).toBeUndefined();
		});

		test('withUniqueEntityID', () => {
			const uniqueEntityId = new UniqueEntityId();
			const $this = faker.withUniqueEntityId(uniqueEntityId);
			expect($this).toBeInstanceOf(CategoryFakeBuilder);
			expect(faker['_unique_entity_id']).toBe(uniqueEntityId);

			faker.withUniqueEntityId(() => uniqueEntityId);
			expect(faker['_unique_entity_id']()).toBe(uniqueEntityId);

			expect(faker.unique_entity_id).toBe(uniqueEntityId);
		});

		it('should pass index to unique_entity_id factory', () => {
			let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
			faker.withUniqueEntityId(mockFactory);
			faker.build();
			expect(mockFactory).toHaveBeenCalledWith(0);

			mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
			const fakerMany = CategoryFakeBuilder.theCategories(2);
			fakerMany.withUniqueEntityId(mockFactory);
			fakerMany.build();

			expect(mockFactory).toHaveBeenCalledWith(0);
			expect(mockFactory).toHaveBeenCalledWith(1);
		});
	});

	describe('name property', () => {
		const faker = CategoryFakeBuilder.aCategory();

		it('should be a function', () => {
			expect(typeof faker['_name'] === 'function').toBeTruthy();
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
			expect(faker['_name']).toBe('some name');

			faker.withName('Movie');
			expect(faker['_name']).toBe('Movie');

			faker.withName(() => 'Movie');
			//@ts-expect-error name is callable
			expect(faker['_name']()).toBe('Movie');

			expect(faker.name).toBe('Movie');
		});

		test('with empty case', () => {
			faker.withInvalidNameEmpty(undefined);
			expect(faker['_name']).toBeUndefined();

			faker.withInvalidNameEmpty(null);
			expect(faker['_name']).toBeNull();

			faker.withInvalidNameEmpty('');
			expect(faker['_name']).toBe('');
		});

		test('with not a string case', () => {
			faker.withInvalidNameNotAStr(5);
			expect(faker['_name']).toBe(5);

			faker.withInvalidNameNotAStr({});
			expect(faker['_name']).toEqual({});

			faker.withInvalidNameNotAStr(null);
			expect(faker['_name']).toBe(5);
		});

		test('with too long case', () => {
			faker.withInvalidNameTooLong('a'.repeat(256));
			expect(faker['_name']).toBe('a'.repeat(256));

			faker.withInvalidNameTooLong(null);
			expect(faker['_name']).toHaveLength(256);
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
			expect(typeof faker['_description'] === 'function').toBeTruthy();
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
			expect(faker['_description']).toBe('Movie');

			faker.withDescription(() => 'Movie');
			//@ts-expect-error description is callable
			expect(faker['_description']()).toBe('Movie');

			expect(faker.description).toBe('Movie');
		});

		test('with not a string case', () => {
			faker.withInvalidDescriptionNotAStr(5);
			expect(faker['_description']).toBe(5);

			faker.withInvalidDescriptionNotAStr({});
			expect(faker['_description']).toEqual({});

			faker.withInvalidDescriptionNotAStr(null);
			expect(faker['_description']).toBe(5);
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
			expect(typeof faker['_is_active'] === 'function').toBeTruthy();
		});

		test('activate', () => {
			faker.activate();
			expect(faker['_is_active']).toBe(true);
			expect(faker.is_active).toBe(true);
		});

		test('deactivate', () => {
			faker.deactivate();
			expect(faker['_is_active']).toBe(false);
			expect(faker.is_active).toBe(false);
		});

		test('with not a boolean case', () => {
			faker.withInvalidIsActiveNotABool(5);
			expect(faker['_is_active']).toBe(5);

			faker.withInvalidIsActiveNotABool({});
			expect(faker['_is_active']).toEqual({});

			faker.withInvalidIsActiveNotABool(null);
			expect(faker['_is_active']).toBe(5);
		});

		test('with a empty case', () => {
			faker.withInvalidIsActiveEmpty(undefined);
			expect(faker['_is_active']).toBeUndefined();

			faker.withInvalidIsActiveEmpty(null);
			expect(faker['_is_active']).toBeNull();

			faker.withInvalidIsActiveEmpty('');
			expect(faker['_is_active']).toBe('');
		});
	});

	describe('created_at property', () => {
		const faker = CategoryFakeBuilder.aCategory();

		it('should throw error when any with methodos has called', () => {
			expect(() => faker['getValue']('created_at')).toThrow(
				new Error(
					`Property created_at not has value. Use 'with' method to set value`
				)
			);
		});

		test('withCreatedAt', () => {
			const date = new Date();
			const $this = faker.withCreatedAt(date);

			expect($this).toBeInstanceOf(CategoryFakeBuilder);
			expect(faker['_created_at']).toBe(date);

			faker.withCreatedAt(() => date);
			expect(faker['_created_at']()).toBe(date);

			expect(faker.build().created_at).toBe(date);
		});

		it('should pass index to created_at factory', () => {
			const date = new Date();
			faker.withCreatedAt(
				(index) => new Date(date.getTime() + index + 2)
			);
			const category = faker.build();
			expect(category.created_at.getTime()).toBe(date.getTime() + 2);

			const fakerMany = CategoryFakeBuilder.theCategories(2);
			fakerMany.withCreatedAt(
				(index) => new Date(date.getTime() + index + 2)
			);
			const categories = fakerMany.build();

			expect(categories[0].created_at.getTime()).toBe(date.getTime() + 2);
			expect(categories[1].created_at.getTime()).toBe(date.getTime() + 3);
		});
	});

	it('should create a category', () => {
		const faker = CategoryFakeBuilder.aCategory();
		let category = faker.build();

		expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
		expect(typeof category.name === 'string').toBeTruthy();
		expect(typeof category.description === 'string').toBeTruthy();
		expect(category.is_active).toBeTruthy();
		expect(category.created_at).toBeInstanceOf(Date);

		const created_at = new Date();
		const uniqueEntityId = new UniqueEntityId();

		category = faker
			.withUniqueEntityId(uniqueEntityId)
			.withName('Movie')
			.withDescription('Some description')
			.deactivate()
			.withCreatedAt(created_at)
			.build();

		expect(category.uniqueEntityId.value).toBe(uniqueEntityId.value);
		expect(category.name).toBe('Movie');
		expect(category.description).toBe('Some description');
		expect(category.is_active).toBeFalsy();
		expect(category.created_at).toBe(created_at);
	});

	it('should create many categories', () => {
		const faker = CategoryFakeBuilder.theCategories(5);
		let categories = faker.build();

		expect(categories.length).toBe(5);

		categories.forEach((category) => {
			expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
			expect(typeof category.name === 'string').toBeTruthy();
			expect(typeof category.description === 'string').toBeTruthy();
			expect(category.is_active).toBeTruthy();
			expect(category.created_at).toBeInstanceOf(Date);
		});

		const created_at = new Date();
		const uniqueEntityId = new UniqueEntityId();
		categories = faker
			.withUniqueEntityId(uniqueEntityId)
			.withName('Movie')
			.withDescription('Some description')
			.deactivate()
			.withCreatedAt(created_at)
			.build();

		expect(categories.length).toBe(5);
		categories.forEach((category) => {
			expect(category.uniqueEntityId.value).toBe(uniqueEntityId.value);
			expect(category.name).toBe('Movie');
			expect(category.description).toBe('Some description');
			expect(category.is_active).toBeFalsy();
			expect(category.created_at).toBe(created_at);
		});
	});
});
