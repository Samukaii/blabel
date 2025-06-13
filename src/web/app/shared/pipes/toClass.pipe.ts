import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'toClass',
})
export class toClassPipe implements PipeTransform {
	transform(value: string[]) {
		return value.join(' ');
	}
}
