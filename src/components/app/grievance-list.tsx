
"use client";

import { useState, useEffect, useMemo } from 'react';
import { getGrievances } from '@/app/actions';
import type { GrievanceRecord } from '@/app/actions';
import { GrievanceCard } from './grievance-card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

export function GrievanceList() {
    const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        async function loadGrievances() {
            try {
                setIsLoading(true);
                const { data, error: fetchError } = await getGrievances();
                if (fetchError) {
                    setError(fetchError);
                } else {
                    setGrievances(data as GrievanceRecord[]);
                }
            } catch (err) {
                setError('An unexpected error occurred.');
            } finally {
                setIsLoading(false);
            }
        }
        loadGrievances();
    }, []);

    const categories = useMemo(() => {
        if (!grievances) return [];
        const uniqueCategories = [...new Set(grievances.map(g => g.category).filter(Boolean))];
        return uniqueCategories;
    }, [grievances]);

    const filteredGrievances = useMemo(() => {
        if (!grievances) return [];
        return grievances.filter(grievance => {
            const matchesCategory = !selectedCategory || grievance.category === selectedCategory;
            const matchesSearch = !searchQuery ||
                grievance.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                grievance.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [grievances, searchQuery, selectedCategory]);
    
    return (
        <div>
            <div className="mb-8 space-y-4">
                <div className="relative">
                    <Input
                        placeholder="Search by title or description..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>

                {isMobile ? (
                    <Select onValueChange={(value) => setSelectedCategory(value === 'All' ? null : value)} value={selectedCategory || 'All'}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by category..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                            {categories.map(category => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant={!selectedCategory ? 'default' : 'secondary'}
                            onClick={() => setSelectedCategory(null)}
                            className="cursor-pointer"
                        >
                            All
                        </Badge>
                        {categories.map(category => (
                            <Badge
                                key={category}
                                variant={selectedCategory === category ? 'default' : 'secondary'}
                                onClick={() => setSelectedCategory(category)}
                                className="cursor-pointer"
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <Alert variant="destructive" className="mb-8">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error Fetching Grievances</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[125px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredGrievances && filteredGrievances.length > 0 ? (
                    filteredGrievances.map((grievance) => (
                    <GrievanceCard 
                    key={grievance.id} 
                    grievance={grievance as any}
                    />
                ))) : (
                    <div className="text-muted-foreground col-span-full text-center py-16">
                        <h3 className="text-xl font-semibold">No Matching Sumbong Found</h3>
                        <p className="mt-2">Try adjusting your search or filter.</p>
                    </div>
                )}
                </div>
            )}
        </div>
    );
}
