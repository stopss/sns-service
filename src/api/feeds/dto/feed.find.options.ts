export interface FeedFindOptions {
  search?: string;
  order?: OrderOption;
  sort?: SortOption;
  filter?: string;
  page?: number;
  pageCount?: number;
}

export enum OrderOption {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum SortOption {
  CREATEDAT = 'createdAt',
  VIEWCOUNT = 'viewCount',
  LIKECOUNT = 'likeCount',
}
