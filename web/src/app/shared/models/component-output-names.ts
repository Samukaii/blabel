import { OutputEmitterRef } from "@angular/core";

export type ComponentOutputNames<T> = {
    [Key in keyof T]: T[Key] extends OutputEmitterRef<any> ? Key : never;
}[keyof T];
