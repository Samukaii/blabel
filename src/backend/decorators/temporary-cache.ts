import { disableAPICache, enableAPICache } from '../core/api/api';

export function TemporaryCache(): MethodDecorator {
	return function (
		_: Object,
		__: string | symbol,
		descriptor: TypedPropertyDescriptor<any>
	) {
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: any[]) {
			enableAPICache();
			try {
				const result = originalMethod.apply(this, args);
				if (result && typeof result.then === 'function') {
					return result.finally(() => {
						disableAPICache();
					});
				} else {
					disableAPICache();
					return result;
				}
			} catch (err) {
				disableAPICache();
				throw err;
			}
		};

		return descriptor;
	};
}
