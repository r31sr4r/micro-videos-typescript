import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import { Category } from '../../domain/entities/category';
import CategoryRepository from '../../domain/repository/category.repository';
import { CategoryOutput, CategoryOutputMapper } from '../dto/category-output';

export namespace CreateCategoryUseCase {
	export class UseCase
		implements DefaultUseCase<Input, Output>
	{
		constructor(
			private categoryRepository: CategoryRepository.Repository
		) {}

		async execute(input: Input): Promise<Output> {
			const entity = new Category(input);
			await this.categoryRepository.insert(entity);
			return CategoryOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		name: string;
		description?: string;
		is_active?: boolean;
	};

	export type Output = CategoryOutput;
}

export default CreateCategoryUseCase;
