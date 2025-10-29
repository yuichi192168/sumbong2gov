
"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import { statuses } from "./data"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const agencies = Array.from(new Set(table.getCoreRowModel().rows.map(row => (row.original as any).agencies?.name).filter(Boolean)))
    .map(name => ({ label: name, value: name }));


  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex flex-1 items-center flex-wrap gap-2">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-full sm:w-[250px] lg:w-[300px]"
        />
        {table.getColumn("agencies") && agencies.length > 0 && (
          <DataTableFacetedFilter
            column={table.getColumn("agencies")}
            title="Agency"
            options={agencies}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
