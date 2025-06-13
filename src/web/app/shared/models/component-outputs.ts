import { ComponentOutputNames } from "./component-output-names";
import { OutputEmitterRef } from "@angular/core";

export type ComponentOutputs<T> = {
    [Key in ComponentOutputNames<T>]: T[Key] extends OutputEmitterRef<infer OutputValue>
    ? (value: OutputValue) => void
    : never;
}
