
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import type { ControllerRenderProps } from 'react-hook-form';

const ImgurTutorial = () => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="item-1">
      <AccordionTrigger className="text-sm text-muted-foreground py-2 hover:no-underline">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> How to get an Image URL?
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="prose prose-sm dark:prose-invert text-muted-foreground p-4 bg-muted/50 rounded-lg space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Go to{' '}
              <a
                href="https://imgur.com/upload"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                imgur.com/upload
              </a>.
            </li>
            <li>Click "Choose Photo/Video" to upload your image.</li>
            <li>After uploading, right-click (or long-press on mobile) on the image and select <strong>"Copy Image Address"</strong>.</li>
            <li>Make sure the URL starts with `https://i.imgur.com` and ends with `.png` or `.jpg`.</li>
            <li>Paste the copied link below.</li>
          </ol>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

interface ImageUrlFieldProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: ControllerRenderProps<any, 'imageUrl'>;
}

export default function ImageUrlField({ field }: ImageUrlFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="image_url">Image URL</Label>
      <Input
        id="image_url"
        placeholder="https://i.imgur.com/..."
        {...field}
      />
      <ImgurTutorial />
    </div>
  );
}

    