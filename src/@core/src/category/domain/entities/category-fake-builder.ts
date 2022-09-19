import { Category } from './category';
import { Chance } from 'chance';
import { UniqueEntityId } from '#seedwork/domain';

type PropOrFactory<T> = T | ((index) => T);

export class CategoryFakeBuilder<TBuild = any> {
	// auto generated in entity
	private unique_entity_id = undefined;
	private chance: Chance.Chance;
	private name: PropOrFactory<string> = (_index) => this.chance.word();
	private description: PropOrFactory<string | null> = (_index) =>
		this.chance.paragraph();
	private is_active: PropOrFactory<boolean> = (_index) => true;
	// auto generated in entity
	private created_at = undefined;
	private countObjs = 1;

	constructor(countObjs: number = 1) {
		this.chance = Chance();
		this.countObjs = countObjs;
	}

	static aCategory() {
		return new CategoryFakeBuilder<Category>();
	}

	static theCategories(countObjs: number) {
		return new CategoryFakeBuilder<Category[]>(countObjs);
	}

	withUniqueEntityId(valueOrFactory: PropOrFactory<UniqueEntityId>) {
		this.unique_entity_id = valueOrFactory;
		return this;
	}

	withName(valueOrFactory: PropOrFactory<string>) {
		this.name = valueOrFactory;
		return this;
	}

	withInvalidNameEmpty(value: '' | null | undefined) {
		this.name = value as any;
		return this;
	}

	withInvalidNameNotAStr(value: any) {
		this.name = value ?? 5;
		return this;
	}

	withInvalidNameTooLong(value: string) {
		this.name = value ?? this.chance.word({ length: 256 });
		return this;
	}

	withDescription(valueOrFactory: PropOrFactory<string | null>) {
		this.description = valueOrFactory;
		return this;
	}

	withInvalidDescriptionNotAStr(value: any) {
		this.description = value ?? 5;
		return this;
	}

	activate() {
		this.is_active = true;
		return this;
	}

	deactivate() {
		this.is_active = false;
		return this;
	}

	withInvalidIsActiveNotABool(value: any) {
		this.is_active = value ?? 5;
		return this;
	}

	withInvalidIsActiveEmpty(value: '' | null | undefined) {
		this.is_active = value as any;
		return this;
	}

	withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
		this.created_at = valueOrFactory;
		return this;
	}

	build(): TBuild {
		const categories = new Array(this.countObjs).fill(undefined).map(
			(_, index) =>
				new Category({
					...(this.unique_entity_id && {
						unique_entity_id: this.callFactory(
							this.unique_entity_id,
							index
						),
					}),
					name: this.callFactory(this.name, index),
					description: this.callFactory(this.description, index),
					is_active: this.callFactory(this.is_active, index),
					...(this.created_at && {
						created_at: this.callFactory(this.created_at, index),
					}),
				})
		);
		return this.countObjs === 1 ? (categories[0] as any) : categories;
	}

	private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
		return typeof factoryOrValue === 'function'
			? factoryOrValue(index)
			: factoryOrValue;
	}
}
