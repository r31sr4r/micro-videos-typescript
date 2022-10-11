import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../../src/app.module';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CategoryFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '../../src/global-config';

describe('CategoriesController (e2e)', () => {
    let app: INestApplication;
    let categoryRepo: CategoryRepository.Repository;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        categoryRepo = moduleFixture.get<CategoryRepository.Repository>(
            CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        applyGlobalConfig(app);
        await app.init();
    });

    describe('POST /categories', () => {
        it('validates the request body', async () => {
            const response = await request(app.getHttpServer())
                .post('/categories')
                .send({});
            expect(response.status).toBe(422);
        });

        describe('should return error 422 when the request body is invalid', () => {
            const invalidRequest = CategoryFixture.arrangeInvalidRequest();
            const arrange = Object.keys(invalidRequest).map((key) => ({
                label: key,
                value: invalidRequest[key],
            }));

            test.each(arrange)(
                'when the request body is $label',
                ({ value }) => {
                    return request(app.getHttpServer())
                        .post('/categories')
                        .send(value.send_data)
                        .expect(422)
                        .expect(value.expected);
                },
            );
        });

        describe('should create a category', () => {
            const arrange = CategoryFixture.arrangeForSave();

            test.each(arrange)(
                'when body is $send_data',
                async ({ send_data, expected }) => {
                    const res = await request(app.getHttpServer())
                        .post('/categories')
                        .send(send_data)
                        .expect(201);
                    const keysInResponse = CategoryFixture.keysInResponse();

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
