import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { CreateCategoryUseCase } from '../../create-category.use-case';

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;

describe('CreateCategoryUseCase Integrations Tests', () => {
	let useCase: CreateCategoryUseCase.UseCase;
	let repository: CategorySequelize.CategorySequelizeRepository;

	setupSequelize({ models: [CategoryModel] });

	beforeEach(() => {
		repository = new CategorySequelizeRepository(CategoryModel);
		useCase = new CreateCategoryUseCase.UseCase(repository);
	});

	it('should create a new category', async () => {
		let output = await useCase.execute({
			name: 'Test Category',
		});
		let category = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: category.id,
			name: 'Test Category',
			description: null,
			is_active: true,
			created_at: category.props.created_at,
		});

		output = await useCase.execute({
			name: 'Test Category',
			description: 'Test Category Description',
			is_active: false,
		});

		category = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: category.id,
			name: 'Test Category',
			description: 'Test Category Description',
			is_active: false,
			created_at: category.props.created_at,
		});
	});

	describe('test with test.each', () => {
		const arrange = [
			{
				inputProps: { name: 'Test Category' },
				outputProps: {
					name: 'Test Category',
					description: null,
					is_active: true,
				},
			},
		];
		test.each(arrange)(
			'input $inputProps, output $outputProps',
			async ({ inputProps, outputProps }) => {
				let output = await useCase.execute(inputProps);
				let category = await repository.findById(output.id);
				expect(output.id).toBe(category.id);
				expect(output.created_at).toStrictEqual(
					category.props.created_at
				);
				expect(output).toMatchObject(outputProps);
			}
		);
	});
});
