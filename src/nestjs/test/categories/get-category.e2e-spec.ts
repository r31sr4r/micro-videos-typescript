import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@share/testing/helpers';
import { CategoriesController } from '../../src/categories/categories.controller';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CategoryFixture } from '../../src/categories/fixtures';

describe('CategoriesController (e2e)', () => {
    const nestApp = startApp();

    describe('/categories/:id (GET)', () => {
        describe('should return error 404 when the category does not exist or id is invalid', () => {
            const arrange = [
                {
                    id: 'e36e81a9-7b70-4e73-a917-cb2e7ed94d2f',
                    expected: {
                        message:
                            'Entity not found using ID e36e81a9-7b70-4e73-a917-cb2e7ed94d2f',
                        statusCode: 404,
                        error: 'Not Found',
                    },
                },
                {
                    id: 'invalid-id',
                    expected: {
                        message: 'Validation failed (uuid  is expected)',
                        statusCode: 422,
                        error: 'Unprocessable Entity',
                    },
                },
            ];

            test.each(arrange)(
                'when id is $id',
                async ({ id, expected }) => {
                    return request(nestApp.app.getHttpServer())
                        .get(`/categories/${id}`)
                        .expect(expected.statusCode)
                        .expect(expected);
                },
            );
        });

        it('should return a category', async () => {
            const categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
                CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
            );
            const category = Category.fake().aCategory().build();
            await categoryRepo.insert(category);

            const res = await request(nestApp.app.getHttpServer())
                .get(`/categories/${category.id}`)
                .expect(200);

            const keysInResponse = CategoryFixture.keysInResponse();
            expect(Object.keys(res.body)).toEqual(['data']);
            expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

            const presenter = CategoriesController.categoryToResponse(
                category.toJSON(),
            );

            const serialized = instanceToPlain(presenter);
            expect(res.body.data).toStrictEqual(serialized);


        });
    });
});
