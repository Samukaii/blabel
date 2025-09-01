import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getElectron } from 'web/app/shared/di/functions/get-electron';
import { AsyncPipe } from '@angular/common';
import { FktIconComponent } from '@frakton-ng/core';

@Component({
	selector: 'app-title-bar',
	imports: [AsyncPipe, FktIconComponent],
	templateUrl: './title-bar.component.html',
	styleUrl: './title-bar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleBarComponent {
	private electron = getElectron();
	protected isDebugAllowed = this.electron.development.isDebugAllowed();

	protected openDevTools() {
		this.electron.development.openDevTools();
	}

	protected close() {
		this.electron.window.close();
	}

	protected maximize() {
		this.electron.window.maximize();
	}

	protected minimize() {
		this.electron.window.minimize();
	}
}
