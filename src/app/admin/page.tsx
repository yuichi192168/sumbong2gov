
import { getGrievances } from '@/app/actions';
import type { GrievanceRecord } from '@/app/actions';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AdminHeader } from '@/components/app/admin-header';

async function getData(): Promise<GrievanceRecord[]> {
  const { data, error } = await getGrievances();
  if (error) {
    console.error(error);
    return [];
  }
  return data as GrievanceRecord[];
}

export default async function AdminDashboard() {
  const data = await getData();

  return (
    <div className="min-h-screen w-full flex flex-col bg-muted/40">
        <AdminHeader />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-6 md:py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold">Grievance Management</h2>
                <p className="text-muted-foreground">Review, update, and resolve submissions.</p>
            </div>
            <div className="bg-background rounded-lg border shadow-sm">
                <DataTable columns={columns} data={data} />
            </div>
        </main>
    </div>
  );
}
