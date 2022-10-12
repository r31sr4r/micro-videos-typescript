import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../../src/app.module';
import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { UpdateCategoryFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '../../src/global-config';

function startApp({
    beforeInit,
}: { beforeInit?: (app: INestApplication) => void } = {}) {
    let _app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        _app = moduleFixture.createNestApplication();
        applyGlobalConfig(_app);
        beforeInit && beforeInit(_app);
        await _app.init();
    });

    return {
        get app() {
            return _app;
        },
    };
}

describe('CategoriesController (e2e)', () => {
    const uuid = 'a7f14b3b-27ab-4f1b-9cc8-fdbe49a01f07';

    describe('PUT /categories/:id', () => {
        describe('should return error 422 when the request body is invalid', () => {
            const app = startApp();
            const invalidRequest =
                UpdateCategoryFixture.arrangeInvalidRequest();
            const arrange = Object.keys(invalidRequest).map((key) => ({
                label: key,
                value: invalidRequest[key],
            }));

            test.each(arrange)(
                'when the request body is $label',
                ({ value }) => {
                    return request(app.app.getHttpServer())
                        .put(`/categories/${uuid}`)
                        .send(value.send_data)
                        .expect(422)
                        .expect(value.expected);
                },
            );
        });

        describe('should return error 422 when throw EntityValidationError', () => {
            const app = startApp({
                beforeInit: (app) => {
                    app['config'].globalPipes = [];
                },
            });

            let categoryRepo: CategoryRepository.Repository;
            beforeEach(async () => {
                categoryRepo = app.app.get<CategoryRepository.Repository>(
                    CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
                );
            });

            const validationError =
                UpdateCategoryFixture.arrangeForEntityValidationError();
            const arrange = Object.keys(validationError).map((key) => ({
                label: key,
                value: validationError[key],
            }));

            test.each(arrange)(
                'when the request body is $label',
                async ({ value }) => {
                    const category = Category.fake().aCategory().build();
                    await categoryRepo.insert(category);

                    return request(app.app.getHttpServer())
                        .put(`/categories/${category.id}`)
                        .send(value.send_data)
                        .expect(422)
                        .expect(value.expected);
                },
            );
        });

        describe('should update a category', () => {
            const app = startApp();
            const arrange = UpdateCategoryFixture.arrangeForSave();
            let categoryRepo: CategoryRepository.Repository;
            beforeEach(async () => {
                categoryRepo = app.app.get<CategoryRepository.Repository>(
                    CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
                );
            });

            test.each(arrange)(
                'when body is $send_data',
                async ({ send_data, expected }) => {
                    const createdCategory = Category.fake().aCategory().build();
                    await categoryRepo.insert(createdCategory);
                    const res = await request(app.app.getHttpServer())
                        .put(`/categories/${createdCategory.id}`)
                        .send(send_data)
                        .expect(200);
                    const keysInResponse =
                        UpdateCategoryFixture.keysInResponse();

                    expect(Object.keys(res.body)).toEqual(['data']);
                    expect(Object.keys(res.body.data)).toStrictEqual(
                        keysInResponse,
                    );

                    const id = res.body.data.id;
                    const updatedCategory = await categoryRepo.findById(id);
                    const presenter = CategoriesController.categoryToResponse(
                        updatedCategory.toJSON(),
                    );
                    const serialized = instanceToPlain(presenter);

                    expect(res.body.data).toStrictEqual(serialized);

                    expect(res.body.data).toStrictEqual({
                        id: serialized.id,
                        created_at: serialized.created_at,
                        ...send_data,
                        ...expected,
                    });
                },
            );
        });
    });
});
