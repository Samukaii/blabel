interface FormTypeFn {
	<T>(): T | null;

	<T>(initialValue: T): T;

	required: <T>() => T
}

export const formType = (<T>(initialValue?: T) => initialValue ?? null) as FormTypeFn;
formType.required = <T>() => null as T;
