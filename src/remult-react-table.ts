import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  DeepKeys,
  PaginationState,
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const fetchIdRef = useRef(0);
  const [pageCount, setPageCount] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  useEffect(() => {
    console.log("useEffect");
    let where: any = {};
    let orderBy: any = {};
    const { pageSize: limit, pageIndex: page } = pagination;
    for (const f of columnFilters) {
      where[f.id] = {
        $contains: f.value,
      } as ContainsStringValueFilter;
    }
    for (const s of sorting) {
      orderBy[s.id] = s.desc ? "desc" : "asc";
    }
    (async () => {
      const fetchId = ++fetchIdRef.current;
      try {
        const [rows, count] = await Promise.all([
          repo.find({
            where,
            orderBy,
            limit,
            page: page + 1,
          }),
          repo.count(where),
        ]);
        if (fetchId === fetchIdRef.current) {
          setData(rows);
          setPageCount(Math.ceil(count / limit));
        }
      } finally {
        if (fetchId === fetchIdRef.current) {
        }
      }
    })();
  }, [columnFilters, sorting, pagination]);

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

            return result.toString();
          },
        });
      });

    return columns as ColumnDef<entityType>[];
  }, []);
  return {
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    pageCount,
  };
}

export declare type ReactDataFieldsAsColumns<entityType extends object> = {
  [Properties in keyof Partial<OmitEB<entityType>>]?: Column<entityType>;
};
