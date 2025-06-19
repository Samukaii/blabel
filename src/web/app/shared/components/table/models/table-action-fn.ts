import { Identifiable } from "../../../models/identifiable";
import { TableAction } from "./table-action";

export type TableActionFn<T extends Identifiable> = (item: T) => TableAction[];
