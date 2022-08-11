import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { DeleteCategoryUseCase } from '../../delete-category.use-case';
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import { setupSequelize } from '#seedwork/infra';

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;
describe('DeleteCategoryUseCase Integragion Tests', () => {
	let repository: CategorySequelize.CategorySequelizeRepository;
	let useCase: DeleteCategoryUseCase.UseCase;

    setupSequelize({ models: [CategoryModel] });

	beforeEach(() => {
		repository = new CategorySequelizeRepository(CategoryModel);
		useCase = new DeleteCategoryUseCase.UseCase(repository);
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

		await useCase.execute({ id: model.id });
        const foundModel = await CategoryModel.findByPk(model.id);

        expect(foundModel).toBeNull();
		
	});
});
