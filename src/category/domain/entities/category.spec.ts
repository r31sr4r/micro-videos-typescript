import { Category, CategoryProperties } from "./category";
import { omit } from "lodash";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";

describe('Category Unit Tests', () => {
    test('constructor of category', () => {        
        let category = new Category({name: 'Movie'});
        let props = omit(category.props, 'created_at');
        expect(props).toStrictEqual({
            name: 'Movie',
            description: null,
            is_active: true            
        })
        expect(category.created_at).toBeInstanceOf(Date);

        let created_at = new Date();        
        category = new Category({
            name: 'Movie',  
            description: 'Movie description', 
            is_active: false,  
            created_at       
        });
        expect(category.props).toStrictEqual({
            name: 'Movie',
            description: 'Movie description',
            is_active: false,
            created_at
        })

        category = new Category({
            name: 'Movie', 
            description: 'Other description',                     
        });
        expect(category.props).toMatchObject({
            name: 'Movie',
            description: 'Other description'
        })

        category = new Category({
            name: 'Movie', 
            is_active: true,                     
        });
        expect(category.props).toMatchObject({
            name: 'Movie',
            is_active: true
        })

        created_at = new Date();
        category = new Category({
            name: 'Movie', 
            created_at,                     
        });
        expect(category.props).toMatchObject({
            name: 'Movie',
            created_at
        })
    });   

    test('id field', () => {
        type CategoryData = {props: CategoryProperties, id?: UniqueEntityId};
        const data: CategoryData[] = [
            { props: {name: 'Movie'} },
            { props: {name: 'Movie'}, id: null },
            { props: {name: 'Movie'}, id: undefined },
            { props: {name: 'Movie'}, id: new UniqueEntityId },
        ]

        data.forEach(i => {
            const category = new Category(i.props, i.id as any)            
            expect(category.id).not.toBeNull();            
        })       
    });

    test('getter of name prop', () => {
        const category = new Category({name: 'Movie'});
        expect(category.name).toBe('Movie');
    });

    test('getter and setter of description prop', () => {
        let category = new Category({name: 'Movie'});
        expect(category.description).toBe(null);
     
        category = new Category({name: 'Movie', description: 'Some description'});
        expect(category.description).toBe('Some description');

        category = new Category({name: 'Movie'});        
        category['description'] = 'Other description';
        expect(category.description).toBe('Other description');
        category['description'] =  undefined;
        expect(category.description).toBeNull();
        category['description'] =  null;
        expect(category.description).toBeNull();

    });

    test('getter and setter of is_active prop', () => {
        let category = new Category({name: 'Movie'});
        expect(category.is_active).toBeTruthy();
     
        category = new Category({name: 'Movie', is_active: false});
        expect(category.is_active).toBeFalsy();

        category = new Category({name: 'Movie'});        
        category['is_active'] = false;
        expect(category.is_active).toBeFalsy();
        category['is_active'] =  undefined;
        expect(category.is_active).toBeTruthy();
        category['is_active'] =  null;
        expect(category.is_active).toBeTruthy();
    });

    test('getter and setter of created_at prop', () => {
        let category = new Category({name: 'Movie'});
        expect(category.created_at).toBeInstanceOf(Date);
     
        category = new Category({name: 'Movie', created_at: new Date()});
        expect(category.created_at).toBeInstanceOf(Date);

    });

    it('should update name, description and is active', () => {
        const category = new Category({name: 'Movie'});
        category.update('Movie 2', 'Movie 2 description', false);
        expect(category.props).toMatchObject({
            name: 'Movie 2',
            description: 'Movie 2 description',
            is_active: false
        })
    });
    
    it('should update name and description', () => {
        const category = new Category({name: 'Movie'});
        category.update('Movie 2', 'Movie 2 description', category.is_active);
        expect(category.props).toMatchObject({
            name: 'Movie 2',
            description: 'Movie 2 description'
        });
    });

    it('should update name and is active', () => {
        const category = new Category({name: 'Movie'});
        category.update('Movie 2', category.description, false);
        expect(category.props).toMatchObject({
            name: 'Movie 2',
            is_active: false
        });
    });

    it('should update name', () => {
        const category = new Category({name: 'Movie'});
        category.update('Movie 2', category.description, category.is_active);
        expect(category.props).toMatchObject({
            name: 'Movie 2'
        });
    });

    it('should activate a category', () => {
        const category = new Category({name: 'Movie'});
        category.activate();
        expect(category.props).toMatchObject({
            is_active: true
        });
        expect(category.is_active).toBeTruthy();
    });

    it('should deactivate a category', () => {
        const category = new Category({name: 'Movie', is_active: true});
        category.deactivate();
        expect(category.props).toMatchObject({
            is_active: false
        });
        expect(category.is_active).toBeFalsy();
    });
    
});