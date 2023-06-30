import CategoryInMemoryRepository from '../../../../infra/db/in-memory/category-in-memory.repository';
import { CreateCategoryUseCase } from '../../create-category.use-case';

describe('CreateCategoryUseCase Unit Tests', () => {
	let useCase: CreateCategoryUseCase.UseCase;
	let repository: CategoryInMemoryRepository;

	beforeEach(() => {
		repository = new CategoryInMemoryRepository();
		useCase = new CreateCategoryUseCase.UseCase(repository);
	});

	it('should create a new category', async () => {
		const spyInsert = jest.spyOn(repository, 'insert');
		let output = await useCase.execute({
			name: 'Test Category',
		});

		expect(spyInsert).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'Test Category',
			description: null,
			is_active: true,
			created_at: repository.items[0].created_at,
		});

		output = await useCase.execute({
			name: 'Test Category',
			description: 'Test Category Description',
			is_active: false,
		});

		expect(spyInsert).toHaveBeenCalledTimes(2);
		expect(output).toStrictEqual({
			id: repository.items[1].id,
			name: 'Test Category',
			description: 'Test Category Description',
			is_active: false,
			created_at: repository.items[1].created_at,
		});
	});

	it('should throw an error if name is not provided', async () => {
		await expect(useCase.execute(null as any)).rejects.toThrow(
			'Entity Validation Error'
		);
	});

	it('should throw an error if name is not provided', async () => {
		await expect(useCase.execute(null as any)).rejects.toMatchObject({
			error: {
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be shorter than or equal to 255 characters',
				],
			},
		});

		await expect(useCase.execute({ name: '' } as any)).rejects.toMatchObject({
			error: {
				name: [
					'name should not be empty',
				],
			},				
		});
	});

});
