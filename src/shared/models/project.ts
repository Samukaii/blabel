export interface Project {
  id: string;
  organizationId: string;
  name: string;
  targetBranch: string;
  sourceBranch: string;
  repository: string;
  description: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
