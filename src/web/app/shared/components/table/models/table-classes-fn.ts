import { Identifiable } from "../../../models/identifiable";

export type TableClassesFn<T extends Identifiable> = (item: T) => string;
