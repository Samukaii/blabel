import 'reflect-metadata';
import { InjectableOptions } from '../models/injectable-options';
import { ClassType } from '../models/class-type';

const container = new Map<ClassType, any>();

const rootProviders = new Set<ClassType>();

export function Injectable(options?: InjectableOptions): ClassDecorator {
	return (target: any) => {
		Reflect.defineMetadata('injectable', true, target);

		if (options?.providedIn === 'root') {
			rootProviders.add(target);
		}
	};
}

export function inject<T>(token: ClassType<T>): T {
	if (container.has(token)) {
		return container.get(token);
	}

	if (!Reflect.getMetadata('injectable', token)) {
		throw new Error(`Class ${token.name} is not marked as @Injectable`);
	}

	const paramTypes: ClassType[] = Reflect.getMetadata('design:paramtypes', token) || [];
	const dependencies = paramTypes.map(dep => inject(dep));

	const instance = new token(...dependencies);
	container.set(token, instance);
	return instance;
}

interface ModuleMetadata {
	providers?: ClassType[];
}

export class AppModule {
	static register({ providers = [] }: ModuleMetadata) {
		const all = [...new Set([...providers, ...rootProviders])];

		for (const provider of all) {
			inject(provider);
		}
	}
}
