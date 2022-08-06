import {
    CreateCategoryUseCase,
    DeleteCategoryUseCase,
    GetCategoryUseCase,
    ListCategoriesUseCase,
    UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { CategoryInMemoryRepository } from '@fc/micro-videos/category/infra';

export namespace CATEGORY_PROVIDERS {
    export namespace REPOSITORIES {
        export const CATEGORY_IN_MEMORY_REPOSITORY = {
            provide: 'CategoryInMemoryRepository',
            useClass: CategoryInMemoryRepository,
        };
    }

    export namespace USE_CASES {
        export const CREATE_CATEGORY = {
            provide: 'CreateCategoryUseCase',
            useFactory: (categoryRepo: CategoryRepository.Repository) => {
                return new CreateCategoryUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
        };

        export const UPDATE_CATEGORY = {
            provide: 'UpdateCategoryUseCase',
            useFactory: (categoryRepo: CategoryRepository.Repository) => {
                return new UpdateCategoryUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
        };

        export const GET_CATEGORY = {
            provide: GetCategoryUseCase.UseCase,
            useFactory: (categoryRepo: CategoryRepository.Repository) => {
                return new GetCategoryUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
        };

        export const LIST_CATEGORIES = {
            provide: 'ListCategoriesUseCase',
            useFactory: (categoryRepo: CategoryRepository.Repository) => {
                return new ListCategoriesUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
        };

        export const DELETE_CATEGORY = {
            provide: DeleteCategoryUseCase.UseCase,
            useFactory: (categoryRepo: CategoryRepository.Repository) => {
                return new DeleteCategoryUseCase.UseCase(categoryRepo);
            },
            inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide],
        };
    }
}
