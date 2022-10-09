import {
    CreateCategoryUseCase,
    GetCategoryUseCase,
    ListCategoriesUseCase,
    UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { SortDirection } from '@fc/micro-videos/dist/@seedwork/domain/repository/repository-contracts';
import {
    CategoryCollectionPresenter,
    CategoryPresenter,
} from '../../presenter/category.presenter';
import { CategoriesController } from '../../categories.controller';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';

describe('CategoriesController Unit Tests', () => {
    let controller: CategoriesController;

    beforeEach(async () => {
        controller = new CategoriesController();
    });

    it('should create a category', async () => {
        const output: CreateCategoryUseCase.Output = {
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            name: 'Movie',
            description: 'Movie category',
            is_active: true,
            created_at: new Date(),
        };

        const mockCreateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output)),
        };

        //@ts-expect-error
        controller['createUseCase'] = mockCreateUseCase;

        const input: CreateCategoryDto = {
            name: 'Movie',
            description: 'Movie category',
            is_active: true,
        };

        const presenter = await controller.create(input);
        expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
        expect(presenter).toBeInstanceOf(CategoryPresenter);
        expect(presenter).toStrictEqual(new CategoryPresenter(output));
    });

    it('shoul update a category', async () => {
        const output: UpdateCategoryUseCase.Output = {
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            name: 'Movie',
            description: 'Movie category',
            is_active: true,
            created_at: new Date(),
        };

        const mockUpdateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output)),
        };

        //@ts-expect-error
        controller['updateUseCase'] = mockUpdateUseCase;

        const input: UpdateCategoryDto = {
            name: 'Movie',
            description: 'Movie category',
            is_active: true,
        };

        const presenter = await controller.update(
            '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            input,
        );
        expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            ...input,
        });
        expect(controller).toBeDefined();
        expect(presenter).toBeInstanceOf(CategoryPresenter);
        expect(presenter).toStrictEqual(new CategoryPresenter(output));
    });

    it('should delete a category', async () => {
        const expectdOutput = undefined;
        const mockDeleteUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectdOutput)),
        };
        //@ts-expect-error
        controller['deleteUseCase'] = mockDeleteUseCase;
        const id = '3edaaad1-d538-4843-a6ef-9ebdaa69f10b';
        expect(controller.remove(id)).toBeInstanceOf(Promise);

        const output = await controller.remove(id);
        expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
        expect(expectdOutput).toStrictEqual(output);
    });

    it('should get all categories', async () => {
        const output: ListCategoriesUseCase.Output = {
            items: [
                {
                    id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
                    name: 'Movie',
                    description: 'Movie category',
                    is_active: true,
                    created_at: new Date(),
                },
            ],
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 1,
        };

        const mockListUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output)),
        };
        //@ts-expect-error
        controller['listUseCase'] = mockListUseCase;

        const searchParams = {
            page: 1,
            per_page: 10,
            sort: 'name',
            sort_dir: 'asc' as SortDirection,
            fiter: 'Movie',
        };

        const presenter = await controller.search(searchParams);

        expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
        expect(mockListUseCase.execute).toBeCalledWith(searchParams);
        expect(presenter).toEqual(
            new CategoryCollectionPresenter(output),
        );
    });

    it('should get a category', async () => {
        const id = '3edaaad1-d538-4843-a6ef-9ebdaa69f10b';
        const output: GetCategoryUseCase.Output = {
            id: id,
            name: 'Movie',
            description: 'Movie category',
            is_active: true,
            created_at: new Date(),
        };
        const mockGetUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output)),
        };
        //@ts-expect-error
        controller['getUseCase'] = mockGetUseCase;
        const presenter = await controller.findOne(id);
        expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
        expect(presenter).toBeInstanceOf(CategoryPresenter);
        expect(presenter).toStrictEqual(new CategoryPresenter(output));
    });
});
