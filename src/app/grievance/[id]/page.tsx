
import { AppHeader } from '@/components/app/header';
import { getGrievanceById } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format, formatDistanceToNow } from 'date-fns';
import type { GrievanceRecord } from '@/app/actions';
import { User, UserX, Landmark, Clock, Calendar, CheckCircle2, Hourglass, XCircle, MapPin, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  in_review: { icon: Hourglass, label: 'In Review', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  resolved: { icon: CheckCircle2, label: 'Resolved', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  rejected: { icon: XCircle, label: 'Rejected', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
};

async function getGrievanceData(id: string) {
    const { data, error } = await getGrievanceById(id);
    if (error) {
        // Handle not found or other errors
        return null;
    }
    return data as GrievanceRecord & { agencies: { name: string } | null };
}


export default async function GrievanceDetailsPage({ params }: { params: { id: string } }) {
    const grievance = await getGrievanceData(params.id);

    if (!grievance) {
        return (
            <div className="min-h-screen w-full flex flex-col">
                 <AppHeader />
                 <main className="flex-grow container mx-auto px-4 md:px-6 py-6 md:py-8 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Grievance Not Found</h2>
                        <p className="text-muted-foreground mb-6">The grievance you are looking for does not exist or has been removed.</p>
                        <Button asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                 </main>
            </div>
        );
    }
    
    const status = grievance.status || 'pending';
    const statusInfo = statusConfig[status] || statusConfig.pending;
    const StatusIcon = statusInfo.icon;
    const createdAt = grievance.created_at ? new Date(grievance.created_at) : new Date();

    return (
        <div className="min-h-screen w-full flex flex-col bg-muted/5">
             <AppHeader />
             <main className="flex-grow container mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Button variant="outline" size="sm" asChild>
                             <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to All Grievances
                            </Link>
                        </Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <CardTitle className="text-2xl md:text-3xl font-headline">{grievance.title}</CardTitle>
                                <Badge className={`border-0 shrink-0 ${statusInfo.className}`}>
                                    <StatusIcon className="mr-2 h-4 w-4" />
                                    {statusInfo.label}
                                </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-2">
                                <div className="flex items-center gap-2">
                                    {grievance.submitter_name ? (
                                        <><User className="h-4 w-4" /><span>{grievance.submitter_name}</span></>
                                    ) : (
                                        <><UserX className="h-4 w-4" /><span>Anonymous</span></>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Landmark className="h-4 w-4" />
                                    <span>{grievance.agencies?.name || 'Unknown Agency'}</span>
                                </div>
                                {grievance.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{grievance.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 flex-wrap" title={format(createdAt, 'PPpp')}>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{format(createdAt, 'MMMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>({formatDistanceToNow(createdAt, { addSuffix: true })})</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {grievance.image_url && (
                                <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border">
                                    <Image
                                        src={grievance.image_url}
                                        alt={grievance.title || 'Grievance image'}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold mb-2 text-foreground">Full Description</h3>
                                <p className="text-base text-foreground/80 whitespace-pre-wrap bg-secondary/30 p-4 rounded-md">
                                    {grievance.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
             </main>
        </div>
    );
}
