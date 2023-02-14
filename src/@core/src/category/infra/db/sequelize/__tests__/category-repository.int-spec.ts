import { Category, CategoryRepository } from '#category/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import _chance from 'chance';
import { CategorySequelize } from '../category-sequelize';

const { CategoryModel, CategorySequelizeRepository, CategoryModelMapper } =
	CategorySequelize;

const chance = _chance();

describe('CategoryRepository Unit Tests', () => {
	setupSequelize({ models: [CategoryModel] });
	let repository: CategorySequelize.CategorySequelizeRepository;

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

	describe('search method tests', () => {
		it('should apply only paginate when other params are not provided', async () => {
			await CategoryModel.factory()
				.count(16)
				.bulkCreate(() => ({
					id: chance.guid({ version: 4 }),
					name: chance.word(),
					description: null,
					is_active: chance.bool(),
					created_at: chance.date(),
				}));

			const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity');
			const searchOutput = await repository.search(
				new CategoryRepository.SearchParams()
			);

			expect(searchOutput).toBeInstanceOf(
				CategoryRepository.SearchResult
			);
			expect(spyToEntity).toHaveBeenCalledTimes(15);
			expect(searchOutput.toJSON()).toMatchObject({
				total: 16,
				current_page: 1,
				last_page: 2,
				per_page: 15,
				sort: null,
				sort_dir: null,
				filter: null,
			});

			searchOutput.items.forEach((item) => {
				expect(item).toBeInstanceOf(Category);
				expect(item.id).toBeDefined();
			});
		});

		it('should order by created_at DESC when search params are not provided', async () => {
			const created_at = new Date();
			await CategoryModel.factory()
				.count(16)
				.bulkCreate((index) => ({
					id: chance.guid({ version: 4 }),
					name: `name ${index}`,
					description: null,
					is_active: chance.bool(),
					created_at: new Date(created_at.getTime() + 100 + index),
				}));

			const searchOutput = await repository.search(
				new CategoryRepository.SearchParams()
			);

			searchOutput.items.forEach((item, index) => {
				expect(item.name).toBe(`name ${15 - index}`);
			});
		});

		it('should apply paginate and filter', async () => {
			const defaultProps = {
				description: null,
				is_active: true,
				created_at: new Date(),
			};

			const categoriesProp = [
				{
					id: chance.guid({ version: 4 }),
					name: 'test',
					...defaultProps,
				},
				{ id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
				{
					id: chance.guid({ version: 4 }),
					name: 'TEST',
					...defaultProps,
				},
				{
					id: chance.guid({ version: 4 }),
					name: 'TeSt',
					...defaultProps,
				},
			];
			const categories = await CategoryModel.bulkCreate(categoriesProp);

			let searchOutput = await repository.search(
				new CategoryRepository.SearchParams({
					page: 1,
					per_page: 2,
					filter: 'TEST',
				})
			);
			expect(searchOutput.toJSON(true)).toMatchObject(
				new CategoryRepository.SearchResult({
					items: [
						CategoryModelMapper.toEntity(categories[0]),
						CategoryModelMapper.toEntity(categories[2]),
					],
					total: 3,
					current_page: 1,
					per_page: 2,
					sort: null,
					sort_dir: null,
					filter: 'TEST',
				}).toJSON(true)
			);

			searchOutput = await repository.search(
				new CategoryRepository.SearchParams({
					page: 2,
					per_page: 2,
					filter: 'TEST',
				})
			);
			expect(searchOutput.toJSON(true)).toMatchObject(
				new CategoryRepository.SearchResult({
					items: [CategoryModelMapper.toEntity(categories[3])],
					total: 3,
					current_page: 2,
					per_page: 2,
					sort: null,
					sort_dir: null,
					filter: 'TEST',
				}).toJSON(true)
			);
		});

		it('should apply paginate and sort', async () => {
			expect(repository.sortableFields).toStrictEqual([
				'name',
				'created_at',
			]);
			const defaultProps = {
				description: null,
				is_active: true,
				created_at: new Date(),
			};

			const categoriesProp = [
				{ id: chance.guid({ version: 4 }), name: 'b', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'd', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'e', ...defaultProps },
				{ id: chance.guid({ version: 4 }), name: 'c', ...defaultProps },
			];
			const categories = await CategoryModel.bulkCreate(categoriesProp);

			const arrange = [
				{
					params: new CategoryRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
					}),
					result: new CategoryRepository.SearchResult({
						items: [
							CategoryModelMapper.toEntity(categories[1]),
							CategoryModelMapper.toEntity(categories[0]),
						],
						total: 5,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: null,
					}),
				},
				{
					params: new CategoryRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
					}),
					result: new CategoryRepository.SearchResult({
						items: [
							CategoryModelMapper.toEntity(categories[4]),
							CategoryModelMapper.toEntity(categories[2]),
						],
						total: 5,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: null,
					}),
				},
				{
					params: new CategoryRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new CategoryRepository.SearchResult({
						items: [
							CategoryModelMapper.toEntity(categories[3]),
							CategoryModelMapper.toEntity(categories[2]),
						],
						total: 5,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: null,
					}),
				},
				{
					params: new CategoryRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
					}),
					result: new CategoryRepository.SearchResult({
						items: [
							CategoryModelMapper.toEntity(categories[4]),
							CategoryModelMapper.toEntity(categories[0]),
						],
						total: 5,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: null,
					}),
				},
			];

			for (const i of arrange) {
				let result = await repository.search(i.params);
				expect(result.toJSON(true)).toMatchObject(
					i.result.toJSON(true)
				);
			}
		});

		describe('should apply paginate, sort and filter', () => {
			const defaultProps = {
				description: null,
				is_active: true,
				created_at: new Date(),
			};

			const entities = [
				new Category({
					name: 'some name',
					...defaultProps,
				}),
				new Category({
					name: 'other name',
					...defaultProps,
				}),
				new Category({
					name: 'some other name',
					...defaultProps,
				}),
				new Category({
					name: 'name',
					...defaultProps,
				}),
				new Category({
					name: 'some test',
					...defaultProps,
				}),
			];

			let arrange = [
				{
					params: new CategoryRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new CategoryRepository.SearchResult({
						items: [entities[0], entities[2]],
						total: 3,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: 'some',
					}),
				},
				{
					params: new CategoryRepository.SearchParams({
						page: 2,
						per_page: 2,
						sort: 'name',
						filter: 'some',
					}),
					result: new CategoryRepository.SearchResult({
						items: [entities[4]],
						total: 3,
						current_page: 2,
						per_page: 2,
						sort: 'name',
						sort_dir: 'asc',
						filter: 'some',
					}),
				},
				{
					params: new CategoryRepository.SearchParams({
						page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: 'some',
					}),
					result: new CategoryRepository.SearchResult({
						items: [entities[4], entities[2]],
						total: 3,
						current_page: 1,
						per_page: 2,
						sort: 'name',
						sort_dir: 'desc',
						filter: 'some',
					}),
				},
			];

			beforeEach(async () => {
				await CategoryModel.bulkCreate(entities.map((e) => e.toJSON()));
			});

			test.each(arrange)(
				'when value is $params',
				async ({ params, result }) => {
					let resultList = await repository.search(params);
					expect(resultList.toJSON(true)).toMatchObject(
						result.toJSON(true)
					);
				}
			);
		});
	});

	it('should throw error on update when category not found', async () => {
		const category = new Category({ name: 'some name' });
		await expect(repository.update(category)).rejects.toThrow(
			new NotFoundError(`Entity not found using ID ${category.id}`)
		);
	});

	it('should update a category', async () => {
		const category = new Category({ name: 'some name' });
		await repository.insert(category);

		category.update('some name updated', category.description);
		await repository.update(category);
		let entityFound = await repository.findById(category.id);

		expect(entityFound.toJSON()).toStrictEqual(category.toJSON());
	});

	it('should throw error on delete when category not found', async () => {
		await expect(repository.delete('fake ID')).rejects.toThrow(
			new NotFoundError(`Entity not found using ID fake ID`)
		);

		await expect(
			repository.delete(
				new UniqueEntityId('2658cf7c-1b88-49cf-93be-fcced08b6b0b')
			)
		).rejects.toThrow(
			new NotFoundError(
				`Entity not found using ID 2658cf7c-1b88-49cf-93be-fcced08b6b0b`
			)
		);
	});

	it('should delete a category', async () => {
		const category = new Category({ name: 'some name' });
		await repository.insert(category);

		await repository.delete(category.id);
		let entityFound = await CategoryModel.findByPk(category.id);

		expect(entityFound).toBeNull();
	});
});
