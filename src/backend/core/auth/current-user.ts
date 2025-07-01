import Store from 'electron-store';
import { User } from '@shared/models/user';

type StoreType = {
  user: User | null;
}

let store: Store<StoreType>;

const getStore = () => {
  if (store) return store;

  store = new Store<StoreType>({encryptionKey: process.env['JWT_ENCRYPTION_KEY']});

  return store;
};

export const currentUser = {
  get() {
    return getStore().get('user', null);
  },
  set(token: User): void {
    getStore().set('user', token);
  },
  clear(): void {
    getStore().delete('user');
  }
};
