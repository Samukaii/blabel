import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getElectron } from 'web/app/shared/di/functions/get-electron';
import { IconComponent } from "../../../shared/components/icon/icon.component";

@Component({
  selector: 'app-title-bar',
  imports: [IconComponent],
  templateUrl: './title-bar.component.html',
  styleUrl: './title-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleBarComponent {
	private electron = getElectron();

	openDevTools() {
		this.electron.development.openDevTools();
	}

	close() {
		this.electron.window.close();
	}
	maximize() {
		this.electron.window.maximize();
	}
	minimize() {
		this.electron.window.minimize();
	}
}
