import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CategoriesController } from '../../src/categories/categories.controller';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CreateCategoryFixture } from '../../src/categories/fixtures';

describe('CategoriesController (e2e)', () => {

    describe('/categories (POST)', () => {

        describe('should return error 422 when the request body is invalid', () => {
            const app = startApp();
            const invalidRequest = CreateCategoryFixture.arrangeInvalidRequest();
            const arrange = Object.keys(invalidRequest).map((key) => ({
                label: key,
                value: invalidRequest[key],
            }));

            test.each(arrange)(
                'when the request body is $label',
                async ({ value }) => {
                    return request(app.app.getHttpServer())
                        .post('/categories')
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

            const validationError = CreateCategoryFixture.arrangeForEntityValidationError();
            const arrange = Object.keys(validationError).map((key) => ({
                label: key,
                value: validationError[key],
            }));

            test.each(arrange)(
                'when the request body is $label',
                async ({ value }) => {
                    return request(app.app.getHttpServer())
                        .post('/categories')
                        .send(value.send_data)
                        .expect(422)
                        .expect(value.expected);
                },
            );
        });

        describe('should create a category', () => {
            const app = startApp();
            const arrange = CreateCategoryFixture.arrangeForSave();
            let categoryRepo: CategoryRepository.Repository;
            beforeEach(async () => {
                categoryRepo = app.app.get<CategoryRepository.Repository>(
                    CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
                );
            });

            test.each(arrange)(
                'when body is $send_data',
                async ({ send_data, expected }) => {
                    const res = await request(app.app.getHttpServer())
                        .post('/categories')
                        .send(send_data)
                        .expect(201);
                    const keysInResponse = CreateCategoryFixture.keysInResponse();

                    expect(Object.keys(res.body)).toEqual(['data']);
                    expect(Object.keys(res.body.data)).toStrictEqual(
                        keysInResponse,
                    );

                    const id = res.body.data.id;
                    const createdCategory = await categoryRepo.findById(id);
                    const presenter = CategoriesController.categoryToResponse(
                        createdCategory.toJSON(),
                    );
                    const serialized = instanceToPlain(presenter);

                    expect(res.body.data).toMatchObject({
                        id: serialized.id,
                        ...send_data,
                        ...expected,
                    });
                },
            );
        });
    });
});
