import { IconName } from "../../../models/icon-name";

export interface TableAction {
	classes?: string[];
	name: string;
	condition: boolean;
	icon: IconName;
	click: () => void;
}
