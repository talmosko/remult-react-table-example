import { useEffect, useState } from "react";
import { remult } from "remult";
import { Company } from "./shared/Company";

import { useRemultReactTable } from "./remult-react-table";
import Table from "./Table";

const companiesRepo = remult.repo(Company);

export default function App() {
  const remultReactTable = useRemultReactTable(companiesRepo);

  return (
    <div>
      <Table {...remultReactTable} />
    </div>
  );
}
