export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
