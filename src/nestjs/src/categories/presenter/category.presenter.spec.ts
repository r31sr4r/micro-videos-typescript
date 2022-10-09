import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../../@share/presenters/pagination.presenter';
import {
    CategoryCollectionPresenter,
    CategoryPresenter,
} from './category.presenter';

describe('CategoryPresenter Unit Tests', () => {
    describe('constructor', () => {
        it('should set values', () => {
            const created_at = new Date();
            const presenter = new CategoryPresenter({
                id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                name: 'Category 1',
                description: 'Category 1 description',
                is_active: true,
                created_at,
            });

            expect(presenter.id).toBe('c1ae4284-b7d0-4f4f-b038-f3926a55cdfb');
            expect(presenter.name).toBe('Category 1');
            expect(presenter.description).toBe('Category 1 description');
            expect(presenter.is_active).toBe(true);
            expect(presenter.created_at).toStrictEqual(created_at);
        });
    });

    it('should presenter data', () => {
        const created_at = new Date();
        const presenter = new CategoryPresenter({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'Category 1',
            description: 'Category 1 description',
            is_active: true,
            created_at,
        });

        const data = instanceToPlain(presenter);
        expect(data).toStrictEqual({
            id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
            name: 'Category 1',
            description: 'Category 1 description',
            is_active: true,
            created_at: created_at.toISOString(),
        });
    });
});

describe('CategoryCollectionPresenter Unit Tests', () => {
    describe('constructor', () => {
        it('should set values', () => {
            const created_at = new Date();
            const presenter = new CategoryCollectionPresenter({
                items: [
                    {
                        id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                        name: 'Category 1',
                        description: 'Category 1 description',
                        is_active: true,
                        created_at,
                    },
                ],
                current_page: 1,
                per_page: 10,
                last_page: 1,
                total: 1,
            });

            expect(presenter.meta).toBeInstanceOf(PaginationPresenter);

            expect(presenter.meta).toEqual(
                new PaginationPresenter({
                    current_page: 1,
                    per_page: 10,
                    last_page: 1,
                    total: 1,
                }),
            );

            expect(presenter.data).toStrictEqual([
                new CategoryPresenter({
                    id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                    name: 'Category 1',
                    description: 'Category 1 description',
                    is_active: true,
                    created_at,
                }),
            ]);
        });
    });

    it('should presenter data', () => {
        const created_at = new Date();
        let presenter = new CategoryCollectionPresenter({
            items: [
                {
                    id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                    name: 'Category 1',
                    description: 'Category 1 description',
                    is_active: true,
                    created_at,
                },
            ],
            current_page: 1,
            per_page: 10,
            last_page: 1,
            total: 1,
        });

        expect(instanceToPlain(presenter)).toStrictEqual({
            meta: {
                current_page: 1,
                per_page: 10,
                last_page: 1,
                total: 1,
            },
            data: [
                {
                    id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                    name: 'Category 1',
                    description: 'Category 1 description',
                    is_active: true,
                    created_at: created_at.toISOString(),
                },
            ],
        });

        presenter = new CategoryCollectionPresenter({
            items: [
                {
                    id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                    name: 'Category 1',
                    description: 'Category 1 description',
                    is_active: true,
                    created_at,
                },
            ],
            current_page: '1' as any,
            per_page: '10' as any,
            last_page: '1' as any,
            total: '1' as any,
        });

        expect(instanceToPlain(presenter)).toStrictEqual({
            meta: {
                current_page: 1,
                per_page: 10,
                last_page: 1,
                total: 1,
            },
            data: [
                {
                    id: 'c1ae4284-b7d0-4f4f-b038-f3926a55cdfb',
                    name: 'Category 1',
                    description: 'Category 1 description',
                    is_active: true,
                    created_at: created_at.toISOString(),
                },
            ],
        });

    });
});
