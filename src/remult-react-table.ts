import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  DeepKeys,
  Row,
  RowModel,
  SortingState,
  TableState,
  createColumnHelper,
} from "@tanstack/react-table";
import { ContainsStringValueFilter, OmitEB, Repository } from "remult";

export function useRemultReactTable<entityType extends object>(
  repo: Repository<entityType>
) {
  const [data, setData] = useState<entityType[]>([]);
  const [count, setCount] = useState(0);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [loading, setLoading] = useState(false);
  const fetchIdRef = useRef(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);

  //   useEffect(() => {
  //     let where: any = {};
  //     let orderBy: any = {};

  //     for (const f of filters) {
  //       where[f.id] = {
  //         $contains: f.value,
  //       } as ContainsStringValueFilter;
  //     }
  //     for (const s of sorting) {
  //       orderBy[s.id] = s.desc ? "desc" : "asc";
  //     }
  //     (async () => {
  //       const fetchId = ++fetchIdRef.current;
  //       setLoading(true);
  //       try {
  //         const [rows, count] = await Promise.all([
  //           repo.find({
  //             where,
  //             orderBy,
  //             limit,
  //             page,
  //           }),
  //           repo.count(where),
  //         ]);
  //         if (fetchId === fetchIdRef.current) {
  //           setData(rows);
  //           setPageCount(Math.ceil(count / limit));
  //           setCount(count);
  //         }
  //       } finally {
  //         if (fetchId === fetchIdRef.current) {
  //           setLoading(false);
  //         }
  //       }
  //     })();
  //   }, [filters, sorting, limit, page]);

  useEffect(() => {
    let where: any = {};
    for (const f of columnFilters) {
      where[f.id] = {
        $contains: f.value,
      } as ContainsStringValueFilter;
    }

    repo.find({ where }).then(setData);
  }, [columnFilters]);

  //   console.log(data);
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<entityType>();
    const columns = repo.metadata.fields
      .toArray()
      .filter((f) => f.key !== "id")
      .map((f) => {
        return columnHelper.accessor(f.key as DeepKeys<entityType>, {
          header: f.caption,
          cell: (row: { getValue: () => any }) => {
            //@ts-ignore
            const val = row.getValue();
            let result = val;
            if (f.options.displayValue)
              result = f.options.displayValue(row, val);
            else if (f.valueConverter.displayValue)
              result = f.valueConverter.displayValue(val);
            if (typeof result === "string") return result;
            if (result) return result.toString();
          },
        });
      });

    return columns as ColumnDef<entityType>[];
  }, []);
  return {
    data,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    // manualFilters: true,
    // initialState: {
    //   filters,
    //   pageSize: 10,
    //   pageIndex: 0,
    // } as Partial<TableState<entityType>>,
    // setReactTableState: (state: TableState<entityType>) => {
    //   if (state.filters !== filters) setFilters(state.filters);
    //   if (state.pageIndex !== page - 1) setPage(state.pageIndex + 1);
    //   if (state.pageSize !== limit) setLimit(state.pageSize);
    //   if (state.sortBy !== sortBy) setSort(state.sortBy);
    //   return state;
    // },
    // loading,
    // count,
    // manualPagination: true,
    // pageCount,
    // manualSortBy: true,
    // fields,
  };
}

export declare type ReactDataFieldsAsColumns<entityType extends object> = {
  [Properties in keyof Partial<OmitEB<entityType>>]?: Column<entityType>;
};
