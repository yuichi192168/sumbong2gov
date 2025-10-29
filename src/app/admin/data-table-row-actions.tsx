
"use client";

import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import type { GrievanceRecord } from '@/app/actions';
import { UpdateStatusDialog } from './update-status-dialog';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const grievance = row.original as GrievanceRecord;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Update Status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600">
            <Trash className="mr-2 h-3.5 w-3.5" />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {isUpdateOpen && (
         <UpdateStatusDialog
            grievance={grievance}
            isOpen={isUpdateOpen}
            onOpenChange={setIsUpdateOpen}
        />
      )}

      {isDeleteOpen && (
        <DeleteConfirmationDialog
            grievanceId={grievance.id!}
            isOpen={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
        />
      )}
    </>
  );
}
