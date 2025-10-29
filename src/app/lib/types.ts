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
  support_count?: number;
}

export type GrievanceSupport = {
  id: string;
  created_at: string;
  grievance_id: string;
  supporter_ip: string;
};

export type GrievanceWithSupportCount = Grievance & {
  support_count: number;
};
