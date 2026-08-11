import { DB_KEY } from './constants';

export function loadDB() {
  try {
    return (
      JSON.parse(localStorage.getItem(DB_KEY)) || {
        currentEmail: null,
        users: {},
      }
    );
  } catch {
    return {
      currentEmail: null,
      users: {},
    };
  }
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function clearDB() {
  localStorage.removeItem(DB_KEY);
}

export function createUid() {
  return Math.random().toString(36).slice(2, 10);
}