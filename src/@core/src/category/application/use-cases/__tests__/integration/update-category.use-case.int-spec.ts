import { UpdateCategoryUseCase } from '../../update-category.use-case';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { setupSequelize } from '#seedwork/infra';
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize';
import _chance from 'chance';
import { CategoryFakeBuilder } from '#category/domain/entities/category-fake-builder';

const chance = _chance();

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize;

describe('UpdateCategoryUseCase Integration Tests', () => {
	let useCase: UpdateCategoryUseCase.UseCase;
	let repository: CategorySequelize.CategorySequelizeRepository;

	setupSequelize({ models: [CategoryModel] });

	beforeEach(() => {
		repository = new CategorySequelizeRepository(CategoryModel);
		useCase = new UpdateCategoryUseCase.UseCase(repository);
	});

	it('should throw an error when id is not found', async () => {
		await expect(
			useCase.execute({ id: 'fake-id', name: 'fake-name' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake-id')
		);
	});

	it('should update category', async () => {
		const entity = CategoryFakeBuilder.aCategory().build();
		repository.insert(entity);

		let output = await useCase.execute({ id: entity.id, name: 'Test' });
		type Arrange = {
			input: {
				id: string;
				name: string;
				description?: string | null;
				is_active?: boolean | null;
			};
			expected: {
				id: string;
				name: string;
				description: string;
				is_active: boolean;
				created_at: Date;
			};
		};

		expect(output).toStrictEqual({
			id: entity.id,
			name: 'Test',
			description: null,
			is_active: true,
			created_at: entity.created_at,
		});

		const arrange: Arrange[] = [
			{
				input: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
					is_active: true,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
					is_active: false,
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: null,
					is_active: false,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: null,
					is_active: false,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
					is_active: true,
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: null,
					is_active: true,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: null,
					is_active: true,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
					is_active: true,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
					is_active: false,
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
					is_active: false,
					created_at: entity.created_at,
				},
			},
		];

		for (const i of arrange) {
			output = await useCase.execute({
				id: i.input.id,
				name: i.input.name,
				description: i.input.description,
				is_active: i.input.is_active,
			});
			expect(output).toStrictEqual({
				id: entity.id,
				name: i.expected.name,
				description: i.expected.description,
				is_active: i.expected.is_active,
				created_at: i.expected.created_at,
			});
		}
	});
});
