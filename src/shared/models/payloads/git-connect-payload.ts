import { GitProvider } from '@shared/models/git-provider';

export interface GitConnectPayload {
	provider: GitProvider;
	token: string;
	projectId: string;
}
