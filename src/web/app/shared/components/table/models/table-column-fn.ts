import { TableColumn } from "./table-column";
import { Identifiable } from '../../../models/identifiable';

export type TableColumnFn<T extends Identifiable> = (item: T) => TableColumn[]
