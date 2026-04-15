export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Nullable<T> = T | null;

export type ID = number;

export type SearchParams = Record<string, string | string[] | undefined>;

export type PageProps<P = Record<string, string>, S = SearchParams> = {
  params: Promise<P>;
  searchParams?: Promise<S>;
};
