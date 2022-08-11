import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { GetCategoryUseCase } from '../../get-category.use-case';
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import { setupSequelize } from '#seedwork/infra';

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;
describe('DeleteCategoryUseCase Integragion Tests', () => {
	let repository: CategorySequelize.CategorySequelizeRepository;
	let useCase: GetCategoryUseCase.UseCase;

    setupSequelize({ models: [CategoryModel] });

	beforeEach(() => {
		repository = new CategorySequelizeRepository(CategoryModel);
		useCase = new GetCategoryUseCase.UseCase(repository);
	});

	it('should throw an error when category not found', async () => {
		await expect(() =>
			useCase.execute({ id: 'not-found' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID not-found')
		);
	});

	it('should delete a category', async () => {
		const model = await CategoryModel.factory().create();

		const foundModel = await useCase.execute({ id: model.id });

        expect(foundModel).not.toBeNull();
		expect(foundModel).toStrictEqual({
			id: model.id,
			name: model.name,
			description: model.description,
			is_active: model.is_active,
			created_at: model.created_at,
		});
		
	});
});
