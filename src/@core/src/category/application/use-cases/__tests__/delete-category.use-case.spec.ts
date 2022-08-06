import { Category } from '../../../domain/entities/category';
import NotFoundError from '../../../../@seedwork/domain/errors/not-found.error';
import CategoryInMemoryRepository from '../../../infra/repository/category-in-memory.repository';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('DeleteCategoryUseCase Unit Tests', () => {
    let repository: CategoryInMemoryRepository;
    let useCase: DeleteCategoryUseCase.UseCase;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new DeleteCategoryUseCase.UseCase(repository);
    });

    it('should throw an error when category not found', async () => {
        await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
            new NotFoundError('Entity not found using ID fake id')
        );
    });

    it('should delete a category', async () => {
        const spyDelete = jest.spyOn(repository, 'delete');
        let items = [
            new Category({
                name: 'Test Category',
            }),
        ];
        repository.items = items;
        await useCase.execute({ id: items[0].id });
        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(repository.items.length).toBe(0);
    });

});