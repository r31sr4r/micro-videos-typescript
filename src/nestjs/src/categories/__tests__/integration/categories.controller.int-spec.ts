import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../../categories.controller';
import { CategoriesModule } from '../../categories.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import {
    CreateCategoryUseCase,
    DeleteCategoryUseCase,
    GetCategoryUseCase,
    ListCategoriesUseCase,
    UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../category.providers';
import { CategorySequelize } from '@fc/micro-videos/category/infra';
import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';

describe('CategoriesController Integration Tests', () => {
    let controller: CategoriesController;
    let repository: CategoryRepository.Repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
        }).compile();

        controller = module.get(CategoriesController);
        repository = module.get(
            CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
    });

    it('should be defined', async () => {
        expect(controller).toBeDefined();
        expect(controller['createUseCase']).toBeInstanceOf(
            CreateCategoryUseCase.UseCase,
        );
        expect(controller['updateUseCase']).toBeInstanceOf(
            UpdateCategoryUseCase.UseCase,
        );
        expect(controller['deleteUseCase']).toBeInstanceOf(
            DeleteCategoryUseCase.UseCase,
        );
        expect(controller['listUseCase']).toBeInstanceOf(
            ListCategoriesUseCase.UseCase,
        );
        expect(controller['getUseCase']).toBeInstanceOf(
            GetCategoryUseCase.UseCase,
        );
    });

    describe('should create a category', () => {
        const arrange = [
            {
                request: {
                    name: 'Movie',
                },
                expectedPresenter: {
                    name: 'Movie',
                    description: null,
                    is_active: true,
                },
            },
            {
                request: {
                    name: 'Movie',
                    description: 'Movie category',
                },
                expectedPresenter: {
                    name: 'Movie',
                    description: 'Movie category',
                    is_active: true,
                },
            },
            {
                request: {
                    name: 'Movie',
                    description: 'Movie category',
                    is_active: false,
                },
                expectedPresenter: {
                    name: 'Movie',
                    description: 'Movie category',
                    is_active: false,
                },
            }            
        ];

        test.each(arrange)(
            'with request $request',
            async ({ request, expectedPresenter }) => {
                const presenter = await controller.create(request);
                const entity = await repository.findById(presenter.id);

                expect(entity).toMatchObject({
                    id: presenter.id,
                    name: expectedPresenter.name,
                    description: expectedPresenter.description,
                    is_active: expectedPresenter.is_active,
                    created_at: presenter.created_at,
                });

                expect(presenter.id).toBe(entity.id);
                expect(presenter.name).toBe(expectedPresenter.name);
                expect(presenter.description).toBe(expectedPresenter.description);
                expect(presenter.is_active).toBe(expectedPresenter.is_active);
                expect(presenter.created_at).toStrictEqual(entity.created_at);
            },
        );
    });

    describe('should update a category', () => {
        let category: CategorySequelize.CategoryModel ;
        beforeEach(async () => {
            category = await CategorySequelize.CategoryModel.factory().create();
        });

        const arrange = [
            {
                categoriesProps: {
                    name: 'category test',                    
                },
                request: {
                    name: 'Movie',
                },
                expectedPresenter: {
                    name: 'Movie',
                    description: null,
                    is_active: true,
                },
            },
            {
                categoriesProps: {
                    name: 'category test',                    
                },
                request: {
                    name: 'Movie',
                    description: 'Movie category',
                },
                expectedPresenter: {
                    name: 'Movie',
                    description: 'Movie category',
                    is_active: true,
                },
            },
            {
                categoriesProps: {
                    name: 'category test',                  
                },
                request: {
                    name: 'Movie',
                    description: 'Movie category',
                    is_active: false,
                },
                expectedPresenter: {
                    name: 'Movie',
                    description: 'Movie category',
                    is_active: false,
                },
            },
            {
                categoriesProps: {
                    name: 'category test',
                    is_active: false,
                },
                request: {
                    name: 'Movie',
                    description: 'Movie category',
                    is_active: false,
                },
                expectedPresenter: {
                    name: 'Movie',
                    description: 'Movie category',
                    is_active: false,
                },
            }        
        ];

        test.each(arrange)(
            'with request $request',
            async ({ categoriesProps, request, expectedPresenter }) => {
                if(categoriesProps) {
                    await category.update(categoriesProps);
                }
                const presenter = await controller.update(category.id, request);
                const entity = await repository.findById(presenter.id);

                expect(entity).toMatchObject({
                    id: presenter.id,
                    name: expectedPresenter.name,
                    description: expectedPresenter.description,
                    is_active: expectedPresenter.is_active,
                    created_at: presenter.created_at,
                });

                expect(presenter.id).toBe(entity.id);
                expect(presenter.name).toBe(expectedPresenter.name);
                expect(presenter.description).toBe(expectedPresenter.description);
                expect(presenter.is_active).toBe(expectedPresenter.is_active);
                expect(presenter.created_at).toStrictEqual(entity.created_at);
            },
        );
    });

    it('should delete a category', async() => {
        const category = await CategorySequelize.CategoryModel.factory().create();
        
        const response = await controller.remove(category.id);

        expect(response).toBeUndefined();
        await expect(repository.findById(category.id)).rejects.toThrow(
            new NotFoundError(`Entity not found using ID ${category.id}`),
        );
        
    });

    it('should get a category', async() => {
        const category = await CategorySequelize.CategoryModel.factory().create();
        
        const presenter = await controller.findOne(category.id);

        expect(presenter).toMatchObject({
            id: category.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at,
        });

        expect(presenter.id).toBe(category.id);
        expect(presenter.name).toBe(category.name);
        expect(presenter.description).toBe(category.description);
        expect(presenter.is_active).toBe(category.is_active);
        expect(presenter.created_at).toStrictEqual(category.created_at);

    });
});
