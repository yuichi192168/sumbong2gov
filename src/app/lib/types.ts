export type GrievanceStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';

export interface Agency {
  id: string;
  name: string;
}

export interface Grievance {
  id: string;
  grievanceText: string;
  agencyId: string;
  status: GrievanceStatus;
  submittedAt: Date;
  submitterName?: string;
  submitterEmail?: string;
}
