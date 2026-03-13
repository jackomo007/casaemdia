import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface SpreadsheetColumn<TData> {
  key: keyof TData | string;
  header: string;
  render: (row: TData) => React.ReactNode;
}

export function SpreadsheetTable<TData>({
  columns,
  data,
}: {
  columns: SpreadsheetColumn<TData>[];
  data: TData[];
}) {
  return (
    <div className="border-border/70 overflow-hidden rounded-[28px] border bg-white/90 shadow-[0_20px_56px_-44px_rgba(80,64,153,0.3)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className="h-12 text-xs tracking-[0.2em] text-slate-500 uppercase"
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
