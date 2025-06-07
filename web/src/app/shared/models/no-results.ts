import { IconName } from "./icon-name";

export interface NoResults {
    icon?: {
        name: IconName;
        classes?: string;
    };
    label: string;
    description?: string;
}