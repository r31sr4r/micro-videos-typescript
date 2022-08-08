import { LoadEntityError, UniqueEntityId } from '#seedwork/domain';
import { Sequelize } from 'sequelize-typescript';
import CategoryModelMapper from './category-mapper';
import { CategoryModel } from './category-model';
import { Category } from '#category/domain';

describe('CategoryMapper Unit Tests', () => {
	let sequelize: Sequelize;

	beforeAll(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			host: ':memory:',
			logging: false,
			models: [CategoryModel],
		});
	});

	beforeEach(async () => {
		await sequelize.sync({ force: true });
	});

	afterAll(async () => {
		await sequelize.close();
	});

	it('should throw an error when entity is invalid', async () => {
		const model = CategoryModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});
		try {
			CategoryModelMapper.toEntity(model);
			fail('The category is valid but an error was expected');
		} catch (err) {
			expect(err).toBeInstanceOf(LoadEntityError);
			expect(err.error).toMatchObject({
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be shorter than or equal to 255 characters',
				],
			});
			expect(err.message).toBe('An entity could not be loaded');
		}
	});

	it('should throw a generic error', async () => {
		const error = new Error('An error has occurred');
		const spyValidate = jest
			.spyOn(Category, 'validate')
			.mockImplementation(() => {
				throw error;
			});
		const model = CategoryModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});

		expect(() => CategoryModelMapper.toEntity(model)).toThrow(error);
		expect(spyValidate).toHaveBeenCalled();
		spyValidate.mockRestore();
	});

	it('should map a category model to a category entity', async () => {
		const created_at = new Date();
		const model = CategoryModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
			name: 'Category 1',
			description: 'Description 1',
			is_active: true,
			created_at,
		});
        
		const entity = CategoryModelMapper.toEntity(model);

		expect(entity.toJSON()).toStrictEqual(
			new Category(
				{
					name: 'Category 1',
					description: 'Description 1',
					is_active: true,
					created_at,
				},
				new UniqueEntityId('02b090cf-5658-4073-b242-9bf64915b3ad')
			).toJSON()
		);
	});
});
