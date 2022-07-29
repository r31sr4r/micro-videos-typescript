import ValidatorRules from '../../../@seedwork/validators/validator-rules';
import Entity from '../../../@seedwork/domain/entity/entity';
import UniqueEntityId from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';
import CategoryValidatorFactory from '../validators/category.validator';

export type CategoryProperties = {
	name: string;
	description?: string;
	is_active?: boolean;
	created_at?: Date;
};

export class Category extends Entity<CategoryProperties> {
	constructor(
		public readonly props: CategoryProperties,
		id?: UniqueEntityId
	) {
		Category.validate(props);
		super(props, id);
		this.description = this.props.description;
		this.is_active = this.props.is_active;
		this.props.created_at = this.props.created_at ?? new Date();
	}

	update(name: string, description: string): Category {
		Category.validate({ name, description });
		this.name = name;
		this.description = description;
		return this;
	}

	static validate(props: CategoryProperties): void {
		const validator = CategoryValidatorFactory.create();
		validator.validate(props);
	}

	// static validate(props: Omit<CategoryProperties, 'created_at'>): void {
	// 	ValidatorRules.values(props.name, 'name')
	// 		.required()
	// 		.string()
	// 		.maxlength(255);
	// 	ValidatorRules.values(props.description, 'description').string();
	// 	ValidatorRules.values(props.is_active, 'is_active').boolean();
	// }

	activate(): Category {
		this.is_active = true;
		return this;
	}

	deactivate(): Category {
		this.is_active = false;
		return this;
	}

	get name(): string {
		return this.props.name;
	}

	private set name(value) {
		this.props.name = value;
	}

	get description(): string {
		return this.props.description;
	}

	private set description(value) {
		this.props.description = value ?? null;
	}

	get is_active(): boolean {
		return this.props.is_active;
	}

	private set is_active(value) {
		this.props.is_active = value ?? true;
	}

	get created_at(): Date {
		return this.props.created_at;
	}
}
