import { PlanType } from '@shared/models/plan-type';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: {
    id: PlanType;
    name: string
  };
}
