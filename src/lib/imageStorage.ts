/*
  Almacenamiento local de imágenes en el navegador usando IndexedDB.
  - Guardar: devuelve un id
  - Cargar: devuelve un Blob

  Uso esperado:
    imageUrl puede ser:
      - URL remota: "https://..."
      - Local: "local://<id>"
*/

const DB_NAME = 'outfitmatic_images_db';
const DB_VERSION = 1;
const STORE_NAME = 'images';

function promisifyRequest<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onerror = () => reject(req.error);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    req.onsuccess = () => resolve(req.result);
  });
}

export function isLocalImageUrl(imageUrl: string | undefined | null): boolean {
  return typeof imageUrl === 'string' && imageUrl.startsWith('local://');
}

export function getLocalImageId(imageUrl: string): string {
  return imageUrl.replace('local://', '');
}

export async function saveImageBlob(blob: Blob, suggestedId?: string): Promise<string> {
  if (!blob || typeof Blob === 'undefined') {
    throw new Error('saveImageBlob: blob inválido');
  }

  const id = suggestedId ? suggestedId : `img-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const db = await openDb();

  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await promisifyRequest(store.put({ id, blob }));

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });

    return id;
  } finally {
    db.close();
  }
}

export async function loadImageBlobById(id: string): Promise<Blob> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const record = await promisifyRequest<{ id: string; blob: Blob }>(store.get(id));

    if (!record || !record.blob) {
      throw new Error(`No existe imagen local con id=${id}`);
    }

    return record.blob;
  } finally {
    db.close();
  }
}

export async function deleteImageById(id: string): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

