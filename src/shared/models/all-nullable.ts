export type AllNullable<T> = {
	[K in keyof T]: T[K] | null;
};
