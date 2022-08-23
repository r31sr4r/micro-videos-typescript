import { instanceToPlain } from "class-transformer";
import { CategoryPresenter } from "./category.presenter";

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