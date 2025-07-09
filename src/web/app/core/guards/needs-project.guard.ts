import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getElectron } from '../../shared/di/functions/get-electron';

export const needsProjectGuard: CanActivateFn = async (_, state) => {
	const electron = getElectron();
	const router = inject(Router);
	const isConfigured = await electron.projects.isConfigured()

	if (isConfigured) return true;

	return router.createUrlTree(['/select-project'], {
		queryParams: {
			returnUrl: state.url
		}
	});
};
