
"use client"

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateGrievanceStatus } from '@/app/actions';
import type { GrievanceRecord } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UpdateStatusDialogProps {
  grievance: GrievanceRecord;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateStatusDialog({ grievance, isOpen, onOpenChange }: UpdateStatusDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      status: grievance.status || 'pending',
      admin_notes: '',
    },
  });

  const onSubmit = (values: { status: string; admin_notes?: string }) => {
    startTransition(async () => {
        if (!grievance.id) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Grievance ID is missing. Cannot update.',
            });
            return;
        }

        const result = await updateGrievanceStatus(
            grievance.id,
            values.status,
            values.admin_notes
        );

        if (result?.success) {
            toast({
                title: 'Grievance Updated',
                description: `The grievance status has been successfully updated.`,
            });
            onOpenChange(false);
            router.refresh();
        } else {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: result?.error || 'An unexpected error occurred while updating.',
            });
        }
    });
};
  

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col p-0 max-h-[90vh]">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Update Grievance</DialogTitle>
          <DialogDescription>
            Change the status and add notes for: "{grievance.title}"
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow min-h-0 flex flex-col">
            <ScrollArea className="flex-grow">
                <div className="space-y-4 px-6 py-4">
                    <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="admin_notes"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Admin Notes (Optional)</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Add internal notes..." {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </ScrollArea>
            <DialogFooter className="p-6 border-t bg-background rounded-b-lg mt-auto">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Grievance
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
