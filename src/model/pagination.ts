export type ResultModelPagination<T> = {
  data: T[];
  pagination: {
    total_count: number;
    total_page: number;
  };
};

export type ResultModelTotalCount<T> = {
  data: T[];
  total_count: number;
};

export type SortByField = {
  field: string;
  direction: "asc" | "desc";
};
