import { Category } from "../../domain/entities/category";
import { CategoryOutputMapper } from "./category-output";

describe('CategoryOutput Unit Tests', () => {
    describe('CategoryOutputMapper Unit Tests', () => {
        it('should convert a category to output', () => {
            const created_at = new Date();
            const category = new Category({
                name: 'Category 1',
                description: 'Description 1',
                is_active: true,
                created_at
            });

            const spyToJSON = jest.spyOn(category, 'toJSON');
            const output = CategoryOutputMapper.toOutput(category);

            expect(spyToJSON).toHaveBeenCalled();
            expect(output).toStrictEqual({
                id: category.id,
                name: 'Category 1',
                description: 'Description 1',
                is_active: true,
                created_at
            });
        });
    });
});