import { DestroyRef, DOCUMENT, ElementRef, inject } from "@angular/core";

export const outsideClickEffect = (fn: () => void) => {
	const elementRef = inject(ElementRef);
	const destroyRef = inject(DestroyRef);
	const document = inject(DOCUMENT);

	const handleClickOutside = (event: MouseEvent) => {
		const wrapper = elementRef.nativeElement;

		if (!wrapper.contains(event.target)) fn();
	};

	document.addEventListener('mousedown', handleClickOutside);

	const destroy = () => {
		document.removeEventListener('mousedown', handleClickOutside);
	};

	destroyRef.onDestroy(destroy);

	return {destroy}
}
