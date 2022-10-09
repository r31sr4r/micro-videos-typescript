import { instanceToPlain } from "class-transformer";
import { CollectionPresenter } from "../collection.presenter";
import { PaginationPresenter } from "../pagination.presenter";


class StubCollectionPresenter extends CollectionPresenter {
    data = [1, 2, 3];
}

describe('CollectionPresenter Unit Tests', () => {
    describe('constructor', () => {
        it('should set values', () => {
            const presenter = new StubCollectionPresenter({
                current_page: 1,
                per_page: 10,
                last_page: 1,
                total: 1,
            });

            expect(presenter['paginationPresenter']).toBeInstanceOf(
                PaginationPresenter,
            );

            expect(presenter['paginationPresenter'].current_page).toBe(1);
            expect(presenter['paginationPresenter'].per_page).toBe(10);
            expect(presenter['paginationPresenter'].last_page).toBe(1);
            expect(presenter['paginationPresenter'].total).toBe(1);
            expect(presenter.meta).toEqual(presenter['paginationPresenter']);
        });
    });

    it('should presenter data', () => {
        let presenter = new StubCollectionPresenter({
            current_page: 1,
            per_page: 10,
            last_page: 1,
            total: 1,
        });

        let data = instanceToPlain(presenter);
        expect(data).toStrictEqual({
            data: [1, 2, 3],
            meta: {
                current_page: 1,
                per_page: 10,
                last_page: 1,
                total: 1,
            },
        });

        presenter = new StubCollectionPresenter({
            current_page: '1' as any,
            per_page: '10' as any,
            last_page: '1' as any,
            total: '1' as any,
        });

        data = instanceToPlain(presenter);

        expect(data).toStrictEqual({
            data: [1, 2, 3],
            meta: {
                current_page: 1,
                per_page: 10,
                last_page: 1,
                total: 1,
            },
        });
    });
});