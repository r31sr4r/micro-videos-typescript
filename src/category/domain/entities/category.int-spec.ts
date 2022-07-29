import ValidationError from '../../../@seedwork/domain/errors/validation-error';
import { Category } from './category';

describe('Category Integration Tests', () => {
	describe('create method', () => {
		it('should a invalid category using name property', async () => {
			expect(() => new Category({ name: null })).toThrow(
				new ValidationError('name is required')
			);

			expect(() => new Category({ name: '' })).toThrow(
				new ValidationError('name is required')
			);

			expect(() => new Category({ name: 5 as any })).toThrow(
				new ValidationError('name must be a string')
			);

			expect(() => new Category({ name: 't'.repeat(256) })).toThrow(
				new ValidationError(
					'name must be less or equal than 255 characters'
				)
			);
		});

		it('should a invalid category using description property', async () => {
			expect(
				() => new Category({ name: 'some name', description: 5 as any })
			).toThrow(new ValidationError('description must be a string'));
		});

		it('should a invalid category using is_active property', async () => {
			expect(
				() =>
					new Category({
						name: 'some name',
						is_active: 'true' as any,
					})
			).toThrow(new ValidationError('is_active must be a boolean'));
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
			expect(() => category.update(null, null)).toThrow(
				new ValidationError('name is required')
			);
			
			expect(() => category.update('', null)).toThrow(
				new ValidationError('name is required')
			);

			expect(() => category.update(5 as any, null)).toThrow(
				new ValidationError('name must be a string')
			);

			expect(() => category.update( 't'.repeat(256), null)).toThrow(
				new ValidationError(
					'name must be less or equal than 255 characters'
				)
			);
		});

		it('should throw a invalid category using description property', async () => {
			let category = new Category({ name: 'some name' });
			expect(
				() => category.update('some name', 5 as any )
			).toThrow(new ValidationError('description must be a string'));
		});

		it('should update category', async () => {
			expect.assertions(0);
			const category = new Category({ name: 'some name' });
			category.update('changed name', 'some description');
			category.update('changed name', null);
		});
	});
});
