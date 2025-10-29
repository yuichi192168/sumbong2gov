
import { AppHeader } from '@/components/app/header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Github, Globe, Shield } from 'lucide-react';
import Link from 'next/link';
import { GrievanceList } from '@/components/app/grievance-list';

export default async function Home() {

  return (
    <div className="min-h-screen w-full flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold font-headline tracking-tight">Public Sumbong Dashboard</h2>
          <p className="mt-3 md:mt-4 max-w-2xl mx-auto text-md md:text-lg text-muted-foreground">
            Tracking community issues transparently. Here’s the current status of all reported grievances.
          </p>
        </div>
        
        <GrievanceList />

      </main>
      <footer className="py-6 md:py-8 mt-8 md:mt-12 border-t">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-xs md:text-sm text-muted-foreground">
            <div className="flex gap-6">
             {/* <Link href="/admin" className="flex items-center gap-2 hover:text-foreground">
                <Shield className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link> */} 
              <Link href="https://bettergov.ph/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground">
                <Globe className="h-4 w-4" />
                <span>BetterGovPH</span>
              </Link>
              <Link href="https://github.com/yuichi192168/sumbong2gov.git" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground">
                <Github className="h-4 w-4" />
                <span>Repo</span>
              </Link>
            </div>
            <p>&copy; {new Date().getFullYear()} Sumbong2Gov. A project for better governance.</p>
        </div>
      </footer>
    </div>
  );
}
