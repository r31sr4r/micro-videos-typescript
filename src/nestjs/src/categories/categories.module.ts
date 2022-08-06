import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {
    CreateCategoryUseCase,
    GetCategoryUseCase,
    ListCategoriesUseCase,
    UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryInMemoryRepository } from '@fc/micro-videos/category/infra';
import CategoryRepository from '@fc/micro-videos/dist/category/domain/repository/category.repository';

@Module({
    controllers: [CategoriesController],
    providers: [
        CategoriesService,
        {
            provide: 'CategoryInMemoryRepository',
            useClass: CategoryInMemoryRepository,
        },
        {
            provide: CreateCategoryUseCase.UseCase,
            useFactory: (categoryRepo: CategoryRepository.Repository) => {
                return new CreateCategoryUseCase.UseCase(categoryRepo);
            },
            inject: ['CategoryInMemoryRepository'],
        },
        {
            provide: UpdateCategoryUseCase.UseCase,
            useFactory: (categoryRepo: CategoryRepository.Repository) => {
                return new UpdateCategoryUseCase.UseCase(categoryRepo);
            },
            inject: ['CategoryInMemoryRepository'],
        },
        {
            provide: GetCategoryUseCase.UseCase,
            useFactory: (categoryRepo: CategoryRepository.Repository) => {
                return new GetCategoryUseCase.UseCase(categoryRepo);
            },
            inject: ['CategoryInMemoryRepository'],
        },
        {
            provide: ListCategoriesUseCase.UseCase,
            useFactory: (categoryRepo: CategoryRepository.Repository) => {
                return new ListCategoriesUseCase.UseCase(categoryRepo);
            },
            inject: ['CategoryInMemoryRepository'],
        },
    ],
})
export class CategoriesModule {}
