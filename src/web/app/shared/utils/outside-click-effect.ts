import { DestroyRef, DOCUMENT, ElementRef, inject } from "@angular/core";

interface OutsideClickEffectOptions {
	excludeIds?: string[];
}

export const outsideClickEffect = (fn: () => void, options?: OutsideClickEffectOptions) => {
	const elementRef = inject(ElementRef);
	const destroyRef = inject(DestroyRef);
	const document = inject(DOCUMENT);

	const handleClickOutside = (event: MouseEvent) => {
		const wrapper = elementRef.nativeElement;

		const excludedElements = options?.excludeIds
			?.map(id => document.getElementById(id))
			?.filter(element => !!element) ?? [];

		const isAnExcludedElement = excludedElements.some(excluded => excluded.contains(event.target as HTMLElement));

		if(isAnExcludedElement) return;

		if (!wrapper.contains(event.target)) fn();
	};

	document.addEventListener('mousedown', handleClickOutside);

	const destroy = () => {
		document.removeEventListener('mousedown', handleClickOutside);
	};

	destroyRef.onDestroy(destroy);

	return {destroy}
}
