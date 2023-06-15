import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Column, Filters, SortingRule, TableState } from "react-table";
import { ContainsStringValueFilter, OmitEB, Repository } from "remult";

export function useRemultReactTable<entityType extends object>(
  repo: Repository<entityType>
) {
  const [data, setData] = useState<entityType[]>(() => []);
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState([] as Filters<entityType>);
  //  const [sort, setSort] = useState([] as Array<SortingRule<entityType>>);
  const [loading, setLoading] = useState(false);
  const fetchIdRef = useRef(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [sortBy, setSort] = useReducer(
    (x: Array<SortingRule<entityType>>, y: Array<SortingRule<entityType>>) => {
      return y;
    },
    [] as Array<SortingRule<entityType>>
  );

  useEffect(() => {
    let where: any = {};
    let orderBy: any = {};

    for (const f of filters) {
      where[f.id] = {
        $contains: f.value,
      } as ContainsStringValueFilter;
    }
    for (const s of sortBy) {
      orderBy[s.id] = s.desc ? "desc" : "asc";
    }
    (async () => {
      const fetchId = ++fetchIdRef.current;
      setLoading(true);
      try {
        const [rows, count] = await Promise.all([
          repo.find({
            where,
            orderBy,
            limit,
            page,
          }),
          repo.count(where),
        ]);
        if (fetchId === fetchIdRef.current) {
          setData(rows);
          setPageCount(Math.ceil(count / limit));
          setCount(count);
        }
      } finally {
        if (fetchId === fetchIdRef.current) {
          setLoading(false);
        }
      }
    })();
  }, [filters, sortBy, limit, page]);
  const { columns, fields } = useMemo(() => {
    let buildFields: any = {};
    const columns = repo.metadata.fields.toArray().map(
      (f) =>
        (buildFields[f.key] = {
          Header: f.caption,
          accessor: (row: entityType) => {
            //@ts-ignore
            const val = row[f.key];
            let result = val;
            if (f.options.displayValue)
              result = f.options.displayValue(row, val);
            else if (f.valueConverter.displayValue)
              result = f.valueConverter.displayValue(val);
            if (typeof result === "string") return result;
            if (result) return result.toString();
          },
          id: f.key,
        } as Column<entityType>)
    );
    const fields: ReactDataFieldsAsColumns<entityType> = buildFields;
    return { fields, columns };
  }, []);
  return {
    data,
    columns,
    manualFilters: true,
    initialState: {
      filters,
      pageSize: 10,
      pageIndex: 0,
    } as Partial<TableState<entityType>>,
    setReactTableState: (state: TableState<entityType>) => {
      if (state.filters !== filters) setFilters(state.filters);
      if (state.pageIndex !== page - 1) setPage(state.pageIndex + 1);
      if (state.pageSize !== limit) setLimit(state.pageSize);
      if (state.sortBy !== sortBy) setSort(state.sortBy);
      return state;
    },
    loading,
    count,
    manualPagination: true,
    pageCount,
    manualSortBy: true,
    fields,
  };
}

export declare type ReactDataFieldsAsColumns<entityType extends object> = {
  [Properties in keyof Partial<OmitEB<entityType>>]?: Column<entityType>;
};
export interface RemultReactTableOptions<entityType extends object> {
  data: entityType[];
  columns: Column<entityType>[];
  manualFilters: boolean;
  initialState: Partial<TableState<entityType>>;
  setReactTableState: (state: TableState<entityType>) => TableState<entityType>;
  loading: boolean;
  count: number;
  manualPagination: boolean;
  pageCount: number;
  manualSortBy: boolean;
  fields: ReactDataFieldsAsColumns<entityType>;
}
