export type PaginationOutputDto<Items = any> = {
	items: Items[];
	total: number;
	current_page: number;
	last_page: number;
	per_page: number;
};

export type PaginationOutputProps<Item> = {
	items: Item[];
	total: number;
	current_page: number;
	last_page: number;
	per_page: number;
};

export class PaginationOutputMapper {
	static toOutput<Item = any>(
		props: PaginationOutputProps<Item>
	): PaginationOutputDto<Item> {
		return {
			items: props.items,
			total: props.total,
			current_page: props.current_page,
			last_page: props.last_page,
			per_page: props.per_page,
		};
	}
}
