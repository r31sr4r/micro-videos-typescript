import UniqueEntityId from '../../../@seedwork/domain/unique-entity-id.vo';

export type CategoryProperties = {
    name: string,
    description?: string,
    is_active?: boolean,
    created_at?: Date,     
}

export class Category {

    public readonly id: UniqueEntityId;

    constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
        this.id = id || new UniqueEntityId();
        this.description = this.props.description;
        this.is_active = this.props.is_active;
        this.props.created_at = this.props.created_at ?? new Date();
    } 

    get name(): string {
        return this.props.name
    }

    get description(): string {
        return this.props.description
    }

    private set description(value){
        this.props.description = value ?? null;
    }

    get is_active(): boolean {
        return this.props.is_active
    }    

    private set is_active(value){
        this.props.is_active = value ?? true;
    }

    get created_at(): Date {
        return this.props.created_at
    }
}

