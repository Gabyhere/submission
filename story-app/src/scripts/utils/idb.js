import { openDB } from 'idb';

const dbPromise = openDB('story-app-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('saved-stories')) {
      db.createObjectStore('saved-stories', { keyPath: 'id' });
    }
  },
});

export async function saveStory(story) {
  const db = await dbPromise;
  return db.put('saved-stories', story);
}

export async function getSavedStories() {
  const db = await dbPromise;
  return db.getAll('saved-stories');
}

export async function deleteSavedStory(id) {
  const db = await dbPromise;
  return db.delete('saved-stories', id);
}
