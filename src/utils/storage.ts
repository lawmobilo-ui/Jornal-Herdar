import { Article, SchoolEvent, PhotoSubmission, ArticleComment, TeacherAuth } from '../types/newspaper';
import { INITIAL_ARTICLES, INITIAL_EVENTS, INITIAL_PHOTOS, INITIAL_COMMENTS, DEFAULT_TEACHER_KEY } from '../data/initialData';

const STORAGE_KEYS = {
  ARTICLES: 'jornal_herdar_v2_articles',
  EVENTS: 'jornal_herdar_v2_events',
  PHOTOS: 'jornal_herdar_v2_photos',
  COMMENTS: 'jornal_herdar_v2_comments',
  TEACHER_KEY: 'jornal_herdar_v2_teacher_key',
  TEACHER_AUTH: 'jornal_herdar_v2_teacher_session',
  LIKED_ARTICLES: 'jornal_herdar_v2_liked_articles',
  JOINED_EVENTS: 'jornal_herdar_v2_joined_events',
  LIKED_PHOTOS: 'jornal_herdar_v2_liked_photos',
};

// Clean legacy v1 keys if present
try {
  localStorage.removeItem('herdar_jornal_articles_v1');
  localStorage.removeItem('herdar_jornal_events_v1');
  localStorage.removeItem('herdar_jornal_photos_v1');
  localStorage.removeItem('herdar_jornal_comments_v1');
} catch (e) {
  // Ignore
}

export const getStoredArticles = (): Article[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (!raw) {
      return INITIAL_ARTICLES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load articles from storage', err);
    return INITIAL_ARTICLES;
  }
};

export const saveStoredArticles = (articles: Article[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  } catch (err) {
    console.error('Failed to save articles to storage', err);
  }
};

export const getStoredEvents = (): SchoolEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      return INITIAL_EVENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load events from storage', err);
    return INITIAL_EVENTS;
  }
};

export const saveStoredEvents = (events: SchoolEvent[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save events to storage', err);
  }
};

export const getStoredPhotos = (): PhotoSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    if (!raw) {
      return INITIAL_PHOTOS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load photos from storage', err);
    return INITIAL_PHOTOS;
  }
};

export const saveStoredPhotos = (photos: PhotoSubmission[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  } catch (err) {
    console.error('Failed to save photos to storage', err);
  }
};

export const getStoredComments = (): ArticleComment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (!raw) {
      return INITIAL_COMMENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load comments from storage', err);
    return INITIAL_COMMENTS;
  }
};

export const saveStoredComments = (comments: ArticleComment[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  } catch (err) {
    console.error('Failed to save comments to storage', err);
  }
};

export const getTeacherSecretKey = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TEACHER_KEY) || DEFAULT_TEACHER_KEY;
  } catch {
    return DEFAULT_TEACHER_KEY;
  }
};

export const setTeacherSecretKey = (newKey: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHER_KEY, newKey.trim());
  } catch (err) {
    console.error('Failed to update teacher key', err);
  }
};

export const getTeacherAuthSession = (): TeacherAuth => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHER_AUTH);
    if (!raw) return { isAuthenticated: false, teacherName: '', role: '' };
    return JSON.parse(raw);
  } catch {
    return { isAuthenticated: false, teacherName: '', role: '' };
  }
};

export const setTeacherAuthSession = (auth: TeacherAuth): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHER_AUTH, JSON.stringify(auth));
  } catch (err) {
    console.error('Failed to save teacher auth', err);
  }
};

export const clearTeacherAuthSession = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TEACHER_AUTH);
  } catch (err) {
    console.error('Failed to clear teacher auth', err);
  }
};

export const getLikedArticles = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LIKED_ARTICLES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleLikedArticle = (articleId: string): boolean => {
  try {
    const current = getLikedArticles();
    const exists = current.includes(articleId);
    const updated = exists ? current.filter(id => id !== articleId) : [...current, articleId];
    localStorage.setItem(STORAGE_KEYS.LIKED_ARTICLES, JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
};

export const getJoinedEvents = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOINED_EVENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleJoinedEvent = (eventId: string): boolean => {
  try {
    const current = getJoinedEvents();
    const exists = current.includes(eventId);
    const updated = exists ? current.filter(id => id !== eventId) : [...current, eventId];
    localStorage.setItem(STORAGE_KEYS.JOINED_EVENTS, JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
};

export const resetToDefaults = (): void => {
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(INITIAL_PHOTOS));
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
  localStorage.setItem(STORAGE_KEYS.TEACHER_KEY, DEFAULT_TEACHER_KEY);
};
