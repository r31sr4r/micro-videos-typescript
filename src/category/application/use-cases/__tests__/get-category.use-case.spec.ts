import { Category } from '../../../domain/entities/category';
import NotFoundError from '../../../../@seedwork/domain/errors/not-found.error';
import CategoryInMemoryRepository from '../../../infra/repository/category-in-memory.repository';
import GetCategoryUseCase from '../get-category.use-case';

describe('GetCategoryUseCase Unit Tests', () => {
	let useCase: GetCategoryUseCase;
	let repository: CategoryInMemoryRepository;

	beforeEach(() => {
		repository = new CategoryInMemoryRepository();
		useCase = new GetCategoryUseCase(repository);
	});

	it('should throw an error when category not found', async () => {
		await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should return a category', async () => {
		const spyFindById = jest.spyOn(repository, 'findById');
		let items = [
			new Category({
				name: 'Test Category',
			}),
		];
		repository.items = items;
		let output = await useCase.execute({ id: items[0].id });

		expect(spyFindById).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'Test Category',
			description: null,
			is_active: true,
			created_at: repository.items[0].created_at,
		});
	});


});
