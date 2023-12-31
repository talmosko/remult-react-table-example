import { useEffect, useState } from "react";
import { Repository } from "remult";
import { Company } from "../shared/Company";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

export function useRemultReactTable(repo: Repository<Company>) {
  const [data, setData] = useState<Company[]>([]);

  const columnHelper = createColumnHelper<Company>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (cell) => cell.getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("stage", {
      header: "Stage",
      cell: (cell) => cell.getValue().id,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("numberOfEmployees", {
      header: "Number Of Employees",
      cell: (cell) => cell.getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("shortDescription", {
      header: "Short Description",
      cell: (cell) => cell.getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("avgYearlyRevenue", {
      header: "Avg Yearly Revenue",
      cell: (cell) => cell.getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("hiring", {
      header: "Hiring",
      cell: (cell) => cell.getValue(),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("location", {
      header: "Location",
      cell: (cell) => cell.getValue(),
      footer: (props) => props.column.id,
    }),
  ] as ColumnDef<Company>[];

  useEffect(() => {
    repo.find().then(setData);
  }, []);

  return { data, columns };
}
