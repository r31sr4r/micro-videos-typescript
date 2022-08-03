import { EntityValidationError } from '../../../@seedwork/domain/errors/validation-error';
import { Category } from './category';

describe('Category Integration Tests', () => {
	describe('create method', () => {
		it('should to invalidate category using name property', async () => {
			expect(() => new Category({ name: null })).containsErrorMessages({
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be shorter than or equal to 255 characters',
				],
			});

			expect(() => new Category({ name: '' })).containsErrorMessages({
				name: ['name should not be empty'],
			});

			expect(
				() => new Category({ name: 5 as any })
			).containsErrorMessages({
				name: [
					'name must be a string',
					'name must be shorter than or equal to 255 characters',
				],
			});

			expect(
				() => new Category({ name: 't'.repeat(256) })
			).containsErrorMessages({
				name: ['name must be shorter than or equal to 255 characters'],
			});
		});

		it('should to invalidate category using description property', async () => {
			expect(
				() => new Category({ name: 'some name', description: 5 as any })
			).containsErrorMessages({
				description: ['description must be a string'],
			});
		});

		it('should a invalid category using is_active property', async () => {
			expect(
				() =>
					new Category({
						name: 'some name',
						is_active: 'true' as any,
					})
			).containsErrorMessages({
				is_active: ['is_active must be a boolean value'],
			});
		});

		it('should create a valid category', async () => {
			expect.assertions(0);
			new Category({ name: 'some name' }); // NOSONAR

			/* NOSONAR */ new Category({
				name: 'some name',
				description: 'some description',
			});

			/* NOSONAR */ new Category({
				name: 'some name',
				description: 'some description',
				is_active: false,
			});

			/* NOSONAR */ new Category({
				name: 'some name',
				description: null,
			});
		});
	});

	describe('update method', () => {
		it('should throw a invalid category using name property', async () => {
			let category = new Category({ name: 'some name' });
			expect(() => category.update(null, null)).containsErrorMessages({
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be shorter than or equal to 255 characters',
				],
			});

			expect(() => category.update('', null)).containsErrorMessages({
				name: ['name should not be empty'],
			});

			expect(() => category.update(5 as any, null)).containsErrorMessages(
				{
					name: [
						'name must be a string',
						'name must be shorter than or equal to 255 characters',
					],
				}
			);

			expect(() =>
				category.update('t'.repeat(256), null)
			).containsErrorMessages({
				name: ['name must be shorter than or equal to 255 characters'],
			});
		});

		it('should throw a invalid category using description property', async () => {
			let category = new Category({ name: 'some name' });
			expect(() => category.update('some name', 5 as any)).containsErrorMessages(
				{
					description: ['description must be a string'],
				}
			);
		});

		it('should update category', async () => {
			expect.assertions(0);
			const category = new Category({ name: 'some name' });
			category.update('changed name', 'some description');
			category.update('changed name', null);
		});
	});
});
