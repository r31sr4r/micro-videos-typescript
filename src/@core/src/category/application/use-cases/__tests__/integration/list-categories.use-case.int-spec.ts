import { ListCategoriesUseCase } from '../../list-categories.use-case';
import { setupSequelize } from '#seedwork/infra';
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import { Category } from '#category/domain';

const { CategorySequelizeRepository, CategoryModel, CategoryModelMapper } =
	CategorySequelize;

describe('ListCategoriesUseCase Integration Tests', () => {
	let repository: CategorySequelize.CategorySequelizeRepository;
	let useCase: ListCategoriesUseCase.UseCase;

	setupSequelize({ models: [CategoryModel] });

	beforeEach(() => {
		repository = new CategorySequelizeRepository(CategoryModel);
		useCase = new ListCategoriesUseCase.UseCase(repository);
	});

	it('should return output with four categories ordered by created_at when input is empty', async () => {
		const faker = Category.fake().theCategories(4);
		const entities = faker
		.withName(index => `name ${index}`)
		.withCreatedAt(index => new Date(new Date().getTime() + index))
		.build();

		await repository.bulkInsert(entities);

		const output = await useCase.execute({});

		expect(output).toMatchObject({
			items: [...entities]
				.reverse()				
				.map((i) => i.toJSON()),
			total: 4,
			current_page: 1,
			last_page: 1,
			per_page: 15,
		});
	});

	it('should return output using paginate, sort and filter', async () => {
		const faker = Category.fake().aCategory();
		const entities = [
			faker.withName('a').build(),
			faker.withName('AAA').build(),
			faker.withName('AaA').build(),
			faker.withName('b').build(),
			faker.withName('c').build(),
		]

		await repository.bulkInsert(entities);

		let output = await useCase.execute({
			page: 1,
			per_page: 2,
			sort: 'name',
			filter: 'a',
		});

		expect(output).toMatchObject({
			items: [entities[1], entities[2]]
				.map((i) => i.toJSON()),
			total: 3,
			current_page: 1,
			last_page: 2,
			per_page: 2,
		});

		output = await useCase.execute({
			page: 2,
			per_page: 2,
			sort: 'name',
			filter: 'a',
		});
		expect(output).toMatchObject({
			items: [entities[0]]
				.map((i) => i.toJSON()),
			total: 3,
			current_page: 2,
			last_page: 2,
			per_page: 2,
		});

		output = await useCase.execute({
			page: 1,
			per_page: 2,
			sort: 'name',
			sort_dir: 'desc',
			filter: 'a',
		});
		expect(output).toMatchObject({
			items: [entities[0], entities[2]]
				.map((i) => i.toJSON()),
			total: 3,
			current_page: 1,
			last_page: 2,
			per_page: 2,
		});
	});
});
