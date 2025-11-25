import { Doctor, Appointment } from '../types';

const DB_NAME = 'clinigest_db';
const STORE_NAME = 'store';

// Helper simple para IndexedDB
const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

async function get<T>(key: string): Promise<T | undefined> {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function set(key: string, val: any): Promise<void> {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(val, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Default Data
const DOCTORS_KEY = 'clinigest_doctors';
const SPECIALTIES_KEY = 'clinigest_specialties';
const APPOINTMENTS_KEY = 'clinigest_appointments';

const DEFAULT_SPECIALTIES = [
  "Medicina General", "Pediatría", "Cardiología", 
  "Dermatología", "Traumatología", "Ginecología", 
  "Oftalmología", "Psiquiatría", "Neurología"
];

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'DOC-001',
    name: 'Dr. Alejandro Ruiz',
    specialty: 'Cardiología',
    room: '101',
    mutuas: ['Adeslas', 'Sanitas'],
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    isActive: true
  },
  {
    id: 'DOC-002',
    name: 'Dra. Elena Costa',
    specialty: 'Pediatría',
    room: '204',
    mutuas: ['DKV', 'Mapfre', 'Asisa'],
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    isActive: true
  }
];

export const StorageService = {
  getDoctors: async (): Promise<Doctor[]> => {
    try {
      const stored = await get<Doctor[]>(DOCTORS_KEY);
      if (!stored) {
        await set(DOCTORS_KEY, INITIAL_DOCTORS);
        return INITIAL_DOCTORS;
      }
      return stored;
    } catch (e) {
      console.error("Error loading doctors", e);
      return [];
    }
  },

  saveDoctors: async (doctors: Doctor[]) => {
    await set(DOCTORS_KEY, doctors);
  },

  getSpecialties: async (): Promise<string[]> => {
    try {
      const stored = await get<string[]>(SPECIALTIES_KEY);
      if (!stored) {
        await set(SPECIALTIES_KEY, DEFAULT_SPECIALTIES);
        return DEFAULT_SPECIALTIES;
      }
      return stored;
    } catch (e) {
      return DEFAULT_SPECIALTIES;
    }
  },

  saveSpecialties: async (specialties: string[]) => {
    await set(SPECIALTIES_KEY, specialties);
  },
  
  // Keep sync signature just in case to prevent crash, but warn
  getAppointments: () => [],
  saveAppointments: () => {} 
};