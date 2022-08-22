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

describe('CategoriesController Integration Tests', () => {
    let controller: CategoriesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
        }).compile();

        controller = module.get(CategoriesController);
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
});
