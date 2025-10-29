
"use client";

import React, { useTransition, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { submitGrievance, getAgencies } from '@/app/actions';
import { grievanceFormSchema } from '@/app/lib/schemas';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUrlField from './image-url-field';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface GrievanceFormProps {
  onFormSubmit: () => void;
}

type GrievanceFormValues = z.infer<typeof grievanceFormSchema>;
type Agency = { id: string; name: string };

const categories = [
    "Road Maintenance",
    "Public Safety",
    "Waste Management",
    "Public Transportation",
    "Utilities (Water/Electricity)",
    "Parks and Recreation",
    "Other"
];

export function GrievanceForm({ onFormSubmit }: GrievanceFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [agencies, setAgencies] = useState<Agency[]>([]);

  useEffect(() => {
    async function fetchAgencies() {
      const { data, error } = await getAgencies();
      if (data) {
        setAgencies(data);
      }
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load agencies. Please try again later.',
        });
      }
    }
    fetchAgencies();
  }, [toast]);

  const form = useForm<GrievanceFormValues>({
    resolver: zodResolver(grievanceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      agencyId: '',
      category: '',
      location: '',
      isAnonymous: true,
      submitterName: '',
      submitterEmail: '',
      imageUrl: '',
    },
  });
  
  const imageRef = form.register("image");
  const isAnonymous = form.watch('isAnonymous');

  function onSubmit(data: GrievanceFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      
      // Append all form fields to formData
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value && value.length > 0) {
          formData.append(key, value[0]);
        } else if (value !== undefined && value !== null && key !== 'imageUrl') {
          formData.append(key, String(value));
        }
      });
      // a little bit of a hack to get the imageUrl to the server
      if (data.imageUrl) {
        formData.append('imageUrl', data.imageUrl);
      }

      const result = await submitGrievance(formData);
      
      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        onFormSubmit();
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'There was a problem with your submission.',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 py-6 px-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sumbong Title</FormLabel>
              <FormControl>
                <Input placeholder="NIRE-REPAIR ANG MGA KALSADANG HINDI PA SIRA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sumbong Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the issue in detail. What happened? Where and when did it occur?"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agencyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Concerned Agency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a government agency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {agencies.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      {agency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                        {category}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormDescription>
                    Categorize the issue to help route it to the correct department.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />


        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                 <Input placeholder="Calamba Laguna Malapit sa Bahay ni Rizal" {...field} />
              </FormControl>
               <FormDescription>
                Provide the street address or general area where the issue is located.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
            <FormLabel>Attach Image (Optional)</FormLabel>
            <Tabs defaultValue="upload">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                    <TabsTrigger value="url">Use URL</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="pt-2">
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type="file" accept="image/*" {...imageRef} />
                                </FormControl>
                                <FormDescription>
                                    Upload a picture of the issue (Max 5MB).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </TabsContent>
                <TabsContent value="url" className="pt-2">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ImageUrlField field={field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </TabsContent>
            </Tabs>
        </div>


        <FormField
          control={form.control}
          name="isAnonymous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Submit Anonymously</FormLabel>
                <FormDescription>
                  Your personal information will not be recorded or displayed publicly.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        {!isAnonymous && (
          <div className="space-y-4 rounded-md border p-4 bg-background/50">
             <p className="text-sm font-medium text-foreground">Your Information</p>
            <FormField
              control={form.control}
              name="submitterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Crisostomo Vergara" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="submitterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="crisostomovergara@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    We may contact you for more details if needed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <Button type="submit" className="w-full !mt-8" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Sumbong
        </Button>
      </form>
    </Form>
  );
}

    

    