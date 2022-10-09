import { instanceToPlain } from "class-transformer";
import { PaginationPresenter } from "../pagination.presenter";

describe('PaginationPresenter Unit Tests', () => {
    describe('constructor', () => {
        it('should set values', () => {
            const presenter = new PaginationPresenter({
                current_page: 1,
                per_page: 10,
                last_page: 1,
                total: 1,
            });

            expect(presenter.current_page).toBe(1);
            expect(presenter.per_page).toBe(10);
            expect(presenter.last_page).toBe(1);
            expect(presenter.total).toBe(1);
        });

        it('should set string number values', () => {
            const presenter = new PaginationPresenter({
                current_page: '1' as any,
                per_page: '10' as any,
                last_page: '1' as any,
                total: '1' as any,
            });

            expect(presenter.current_page).toBe('1');
            expect(presenter.per_page).toBe('10');
            expect(presenter.last_page).toBe('1');
            expect(presenter.total).toBe('1');
        });
    });

    it('should presenter data', () => {
        let presenter = new PaginationPresenter({
            current_page: 1,
            per_page: 10,
            last_page: 1,
            total: 1,
        });

        let data = instanceToPlain(presenter);
        expect(data).toStrictEqual({
            current_page: 1,
            per_page: 10,
            last_page: 1,
            total: 1,
        });

        presenter = new PaginationPresenter({
            current_page: '1' as any,
            per_page: '10' as any,
            last_page: '1' as any,
            total: '1' as any,
        });

        data = instanceToPlain(presenter);

        expect(data).toStrictEqual({
            current_page: 1,
            per_page: 10,
            last_page: 1,
            total: 1,
        });
    });
});