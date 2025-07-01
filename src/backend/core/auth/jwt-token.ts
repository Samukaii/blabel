import Store from 'electron-store';

type StoreType = {
  jwt: string | null
}

let store: Store<StoreType>;

const getStore = () => {
  if (store) return store;

  store = new Store<StoreType>({encryptionKey: process.env['JWT_ENCRYPTION_KEY']});

  return store;
};

export const jwtToken = {
  get(): string | null {
    return getStore().get('jwt', null);
  },
  set(token: string): void {
    getStore().set('jwt', token);
  },
  clear(): void {
    getStore().delete('jwt');
  }
};
