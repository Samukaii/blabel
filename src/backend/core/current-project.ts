import Store from 'electron-store';

type StoreType = {
	projectId: string | null;
}

let store: Store<StoreType>;

const getStore = () => {
	if (store) return store;

	store = new Store<StoreType>({encryptionKey: process.env['JWT_ENCRYPTION_KEY']});

	return store;
};

export const currentProject = {
	get() {
		return getStore().get('projectId', null);
	},
	set(id: string): void {
		getStore().set('projectId', id);
	},
	clear(): void {
		getStore().delete('projectId');
	}
};
