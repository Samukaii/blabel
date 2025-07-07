import { GitProvider } from '@shared/models/git-provider';

interface GitProviderInfoConnected {
	status: 'connected' | 'disconnected';
	info: {
		provider: GitProvider;
		login: string;
		bio: string;
		name: string;
		avatarUrl: string;
	}
}

interface GitProviderInfoDisconnected {
	status: 'disconnected';
}

export type GitConnectionResponse = GitProviderInfoConnected | GitProviderInfoDisconnected;

