import { remult } from "remult";
import { Company } from "./shared/Company";
import { useRemultReactTable } from "./02-remult/remult-react-table";
import Table from "./02-remult/Table";

const companiesRepo = remult.repo(Company);

export default function App() {
  const remultReactTable = useRemultReactTable(companiesRepo);

  return (
    <div>
      <Table {...remultReactTable} />
    </div>
  );
}
