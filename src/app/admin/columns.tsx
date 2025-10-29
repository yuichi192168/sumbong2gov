
"use client";

import { ColumnDef } from '@tanstack/react-table';
import type { GrievanceRecord } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { formatDistanceToNow } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';

const statusConfig: { [key: string]: { label: string; className: string } } = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100/80' },
  in_review: { label: 'In Review', className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100/80' },
  resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100/80' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100/80' },
};

export const columns: ColumnDef<GrievanceRecord>[] = [
    {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue('title')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'agencies',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Agency" />,
    cell: ({ row }) => {
      const record = row.original as GrievanceRecord & { agencies: { name: string } | null };
      return <span>{record.agencies?.name || 'N/A'}</span>;
    },
    filterFn: (row, id, value) => {
        const record = row.original as GrievanceRecord & { agencies: { name: string } | null };
        return value.includes(record.agencies?.name);
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const config = statusConfig[status] || { label: 'Unknown', className: 'bg-gray-100 text-gray-800' };
      return <Badge variant="outline" className={`font-medium ${config.className}`}>{config.label}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return <span>{formatDistanceToNow(date, { addSuffix: true })}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
