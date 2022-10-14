import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../../src/app.module';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../src/categories/category.providers';
import { CreateCategoryFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '../../src/global-config';
import { getConnectionToken } from '@nestjs/sequelize';

function startApp({ beforeInit, }: { beforeInit?: (app: INestApplication) => void } = {}) {
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

    describe('POST /categories', () => {

        describe('should return error 422 when the request body is invalid', () => {
            const app = startApp();
            const invalidRequest = CreateCategoryFixture.arrangeInvalidRequest();
            const arrange = Object.keys(invalidRequest).map((key) => ({
                label: key,
                value: invalidRequest[key],
            }));

            test.each(arrange)(
                'when the request body is $label',
                ({ value }) => {
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
                ({ value }) => {
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
                // const sequelize = app.app.get(getConnectionToken());
                // await sequelize.sync({ force: true });
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

                    //expect(res.body.data).toStrictEqual(serialized);

                    expect(res.body.data).toMatchObject({
                        id: serialized.id,
                        //created_at: serialized.created_at,
                        ...send_data,
                        ...expected,
                    });
                },
            );
        });
    });
});