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
			faker.withName('Movie');
			expect(faker['name']).toBe('Movie');

			faker.withName(() => 'Movie');
			//@ts-expect-error name is callable
			expect(faker['name']()).toBe('Movie');
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
});
