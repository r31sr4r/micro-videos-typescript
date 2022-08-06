import { CategoryRepository } from "#category/domain";
import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";

export namespace DeleteCategoryUseCase {
    export class UseCase implements DefaultUseCase<Input, Output> {
        constructor(
            private categoryRepository: CategoryRepository.Repository
        ) {}

        async execute(input: Input): Promise<Output> {
            const entity = await this.categoryRepository.findById(input.id);
            await this.categoryRepository.delete(entity.id);
        }
    }

    export type Input = {
        id: string;
    };

    export type Output = void;
}

export default DeleteCategoryUseCase;