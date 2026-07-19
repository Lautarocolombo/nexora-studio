const DB_NAME = 'outfitmatic_db';
const DB_VERSION = 1;

type StoreName = 'garments' | 'outfits' | 'logs' | 'lang';

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('garments')) {
        db.createObjectStore('garments', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('outfits')) {
        db.createObjectStore('outfits', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('logs')) {
        db.createObjectStore('logs', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('lang')) {
        db.createObjectStore('lang', { keyPath: 'key' });
      }
    };
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };
    request.onerror = () => reject(request.error);
  });
}

function tx(storeName: StoreName, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
  return openDB().then(db => db.transaction(storeName, mode).objectStore(storeName));
}

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const db = {
  async getAll(storeName: StoreName): Promise<any[]> {
    const store = await tx(storeName);
    return promisifyRequest(store.getAll());
  },

  async get(storeName: StoreName, key: string): Promise<any | undefined> {
    const store = await tx(storeName);
    return promisifyRequest(store.get(key));
  },

  async put(storeName: StoreName, value: any): Promise<void> {
    const store = await tx(storeName, 'readwrite');
    await promisifyRequest(store.put(value));
  },


  async putAll(storeName: StoreName, values: any[]): Promise<void> {
    const store = await tx(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const transaction = store.transaction!;
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      for (const value of values) {
        store.put(value);
      }
    });
  },

  async delete(storeName: StoreName, key: string): Promise<void> {
    const store = await tx(storeName, 'readwrite');
    return promisifyRequest(store.delete(key));
  },

  async clear(storeName: StoreName): Promise<void> {
    const store = await tx(storeName, 'readwrite');
    return promisifyRequest(store.clear());
  },
};
