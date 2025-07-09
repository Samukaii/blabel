import { PlanType } from '@shared/models/plan-type';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: {
    key: PlanType;
    label: string
  };
}
