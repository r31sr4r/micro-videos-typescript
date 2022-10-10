import { Category } from '@fc/micro-videos/category/domain';

export class CategoryFixture {
    static keysInResponse() {
        return ['id', 'name', 'description', 'is_active', 'created_at'];
    }

    static arrangeForSave() {
        const faker = Category.fake().aCategory().withName('Category 1');
        return [
            {
                send_data: {
                    name: faker.name,
                },
                expected: {
                    description: null,
                    is_active: true,
                },
            },
            {
                send_data: {
                    name: faker.name,
                    description: null,
                },
                expected: {
                    is_active: true,
                },
            },
            {
                send_data: {
                    name: faker.name,
                    is_active: false,
                },
                expected: {
                    description: null,
                    is_active: false,
                },
            },
            {
                send_data: {
                    name: faker.name,
                    description: faker.description,
                    is_active: false,
                },
                expected: {
                    is_active: false,
                },
            },
        ];
    }
}
