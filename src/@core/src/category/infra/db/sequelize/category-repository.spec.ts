import { Category } from '#category/domain';
import { NotFoundError } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { CategoryModel } from './category-model';
import CategorySequelizeRepository from './category-repository';

describe('CategoryRepository Unit Tests', () => {
	setupSequelize({models: [CategoryModel]});
	let repository: CategorySequelizeRepository;

	beforeEach(async () => {
		repository = new CategorySequelizeRepository(CategoryModel);
	});

	it('should insert a category', async () => {
		let category = new Category({
			name: 'Category 1',
			description: 'Description 1',
		});
		await repository.insert(category);
		let model = await CategoryModel.findByPk(category.id);
		expect(model.toJSON()).toStrictEqual(category.toJSON());

		category = new Category({
			name: 'Category 2',
			description: 'Description 2',
			is_active: false,
		});

		await repository.insert(category);
		model = await CategoryModel.findByPk(category.id);
		expect(model.toJSON()).toStrictEqual(category.toJSON());

		category = new Category({
			name: 'Category 3',
		});

		await repository.insert(category);
		model = await CategoryModel.findByPk(category.id);
		expect(model.toJSON()).toStrictEqual(category.toJSON());
	});

	it('should throw an error when entity has not been found', async () => {
		await expect(repository.findById('fake id')).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
		await expect(
			repository.findById('312cffad-1938-489e-a706-643dc9a3cfd3')
		).rejects.toThrow(
			new NotFoundError(
				'Entity not found using ID 312cffad-1938-489e-a706-643dc9a3cfd3'
			)
		);
	});

	it('should find an entity by Id', async () => {
		const entity = new Category({
			name: 'some name',
			description: 'some description',
		});
		await repository.insert(entity);

		let entityFound = await repository.findById(entity.id);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

		entityFound = await repository.findById(entity.uniqueEntityId);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
	});

	it('should return all entities', async () => {
		const entity1 = new Category({
			name: 'some name',
			description: 'some description',
		});
		const entity2 = new Category({
			name: 'some name 2',
			description: 'some description 2',
		});
		await repository.insert(entity1);
		await repository.insert(entity2);

		const entities = await repository.findAll();
		expect(entities.length).toBe(2);
		expect(entities[0].toJSON()).toStrictEqual(entity1.toJSON());
		expect(entities[1].toJSON()).toStrictEqual(entity2.toJSON());
	});
});
