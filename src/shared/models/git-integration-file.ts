export interface GitIntegrationFile {
	status: 'found' | 'not-found' | 'not-checked';
	result?: { downloadUrl: string; name: string; content?: string };
}
