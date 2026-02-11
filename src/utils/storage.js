const STORAGE_KEY = 'timetracker_weeks';
const DB_NAME = 'TimeTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'weeks';

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  
  if (!window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported'));
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });

  return dbPromise;
}

async function requestPersistence() {
  if (navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      if (isPersisted) {
        console.log('Storage persistence granted');
      } else {
        console.log('Storage persistence not granted');
      }
    } catch (error) {
      console.warn('Could not request persistence:', error);
    }
  }
}

async function loadFromIndexedDB() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(STORAGE_KEY);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB load failed:', error);
    return null;
  }
}

async function saveToIndexedDB(weeks) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(weeks, STORAGE_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('IndexedDB save failed:', error);
  }
}

function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(weeks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weeks));
  } catch (error) {
    console.warn('localStorage save failed:', error);
  }
}

export async function loadWeeks() {
  await requestPersistence();
  
  const indexedDBData = await loadFromIndexedDB();
  if (indexedDBData !== null) {
    return indexedDBData;
  }
  
  return loadFromLocalStorage();
}

export async function saveWeeks(weeks) {
  await saveToIndexedDB(weeks);
  saveToLocalStorage(weeks);
}

export function exportWeeks(weeks) {
  const dataStr = JSON.stringify(weeks, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `timetracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function importWeeks(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) {
          resolve(data);
        } else {
          reject(new Error('Invalid data format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
