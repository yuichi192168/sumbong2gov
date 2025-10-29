
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { GrievanceRecord } from '@/app/actions';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Landmark, User, UserX, Hourglass, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface GrievanceCardProps {
  grievance: GrievanceRecord & { agencies: { name: string } | null, image_url?: string | null };
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-100/80' },
  in_review: { icon: Hourglass, label: 'In Review', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100/80' },
  resolved: { icon: CheckCircle2, label: 'Resolved', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-100/80' },
  rejected: { icon: XCircle, label: 'Rejected', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-100/80' },
};

export function GrievanceCard({ grievance }: GrievanceCardProps) {
  const [timeAgo, setTimeAgo] = useState('');
  
  const status = grievance.status || 'pending';
  const statusInfo = statusConfig[status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  useEffect(() => {
    if (grievance.created_at) {
      const date = new Date(grievance.created_at);
      setTimeAgo(formatDistanceToNow(date, { addSuffix: true }));
    }
  }, [grievance.created_at]);

  return (
    <Link href={`/grievance/${grievance.id}`} className="block h-full">
        <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 bg-card">
          {grievance.image_url && (
            <div className="relative w-full h-48">
              <Image
                src={grievance.image_url}
                alt={grievance.title || 'Grievance image'}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          )}
            <div className="flex flex-col flex-grow">
              <CardHeader>
                  <CardTitle className="text-lg font-headline line-clamp-2">{grievance.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-2">
                    {grievance.submitter_name ? (
                      <>
                        <User className="h-4 w-4" />
                        <span>{grievance.submitter_name}</span>
                      </>
                    ) : (
                      <>
                        <UserX className="h-4 w-4" />
                        <span>Anonymous</span>
                      </>
                    )}
                  </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-foreground/80 line-clamp-3">
                  {grievance.description}
                </p>
              </CardContent>
            </div>
          <CardFooter className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t mt-auto">
             <div className="text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4" />
                    <span>{grievance.agencies?.name || 'Unknown Agency'}</span>
                </div>
                <div className="flex items-center gap-2" title={grievance.created_at}>
                    <Clock className="h-4 w-4" />
                    <span>{timeAgo}</span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className={`border-0 text-xs ${statusInfo.className}`}>
                    <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
                    {statusInfo.label}
                </Badge>
            </div>
          </CardFooter>
        </Card>
      </Link>
  );
}
