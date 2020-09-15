export interface Pagination {
	currentItemCount: number,
	itemsPerPage: number;
	totalItems: number,
	pageIndex: number;
	totalPages: number,
	sorts: string;
	filters?: string;
	search?: string;
}

export interface APIData extends Pagination {
	kind: string;
	items: any[];
	[key: string]: any;
}

export interface APIErrors {
	location: string;
	locationType: string;
	message: string;
}

export interface APIResponse {
	apiVersion: string;
	data: APIData;
	error?: {
		code: number;
		message: string;
		expiredToken?: boolean;
		errors?: APIErrors[];
	}
}