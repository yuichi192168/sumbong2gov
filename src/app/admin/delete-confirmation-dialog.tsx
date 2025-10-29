
"use client"

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteGrievance } from '@/app/actions';
import { Loader2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  grievanceId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteConfirmationDialog({ grievanceId, isOpen, onOpenChange }: DeleteConfirmationDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteGrievance(grievanceId);
      if (result.success) {
        toast({
          title: 'Grievance Deleted',
          description: 'The grievance has been permanently removed.',
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Deletion Failed',
          description: result.error || 'An unexpected error occurred.',
        });
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the grievance and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, delete it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
