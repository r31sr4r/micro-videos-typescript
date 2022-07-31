import { Category } from "../../domain/entities/category";
import CategoryInMemoryRepository from "./category-in-memory.repository";

describe('CategoryInMemoryRepository Unit Tests', () => {
    let repository: CategoryInMemoryRepository;
    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
    });


    it('should return items without filter', async () => {
        const items = [
            new Category({ name: 'Category 1' }), 
            new Category({ name: 'Category 2' })
        ];

        const spyFilterMethod = jest.spyOn(items, 'filter' as any);

        const filterdItems = await repository['applyFilter'](items, null);
        expect(filterdItems).toStrictEqual(items);
        expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should return filtered items when filter is not null', async () => {
        const items = [ 
            new Category({ name: 'Category 1' }),
            new Category({ name: 'Test 2' }),
            new Category({ name: 'Some Category 3' }),
            new Category({ name: 'other 4' }),
            new Category({ name: 'another one 5' }),
            new Category({ name: 'Category 6' }),
        ];

        const spyFilterMethod = jest.spyOn(items, 'filter' as any);
        let filterdItems = await repository['applyFilter'](items, 'Category');
        expect(filterdItems).toStrictEqual([items[0], items[2], items[5]]);
        expect(spyFilterMethod).toHaveBeenCalledTimes(1);

        filterdItems = await repository['applyFilter'](items, '5');
        expect(filterdItems).toStrictEqual([items[4]]);
        expect(spyFilterMethod).toHaveBeenCalledTimes(2);

        filterdItems = await repository['applyFilter'](items, 'no-filter');
        expect(filterdItems).toHaveLength(0);
        expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });

    it('should return all categories with created_at sort when sort is null', async () => {
        const created_at = new Date();
        const created_at2 = new Date('2020-01-01');
        const created_at3 = new Date('2021-04-02');

        const items = [
            new Category({ name: 'Category 1', created_at: created_at }),
            new Category({ name: 'Category 2', created_at: created_at2 }),
            new Category({ name: 'Category 3', created_at: created_at3 }),
        ];

        let sortedItems = await repository['applySort'](items, null, null);
        expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);
    });



    it('should return sorted categories when sort is not null', async () => {
        const items = [
            new Category({ name: 'Category 1', description: 'desc 1' }),
            new Category({ name: 'Some Category', description: 'desc 2' }),
            new Category({ name: 'Other', description: 'desc 3' }),
            new Category({ name: 'another one', description: 'desc 4', is_active: false }),
            new Category({ name: 'caTegoRY ', description: 'desc 5' }),
        ]

        let sortedItems = await repository['applySort'](items, 'name', 'asc');

        expect(sortedItems).toStrictEqual([
            items[0],
            items[2],
            items[1],
            items[3],
            items[4],
        ]);      
        
        sortedItems = await repository['applySort'](items, 'name', 'desc');
        expect(sortedItems).toStrictEqual([
            items[4],
            items[3],
            items[1],
            items[2],
            items[0],
        ]);
        
    });
});