import { InputSignal } from "@angular/core";

export type ComponentInputNames<T> = {
    [Key in keyof T]: T[Key] extends InputSignal<any> ? Key : never;
}[keyof T];