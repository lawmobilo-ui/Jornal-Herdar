import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  increment 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Article, SchoolEvent, PhotoSubmission, ArticleComment } from '../types/newspaper';

// Collections paths
const ARTICLES_PATH = 'articles';
const EVENTS_PATH = 'events';
const PHOTOS_PATH = 'photos';
const COMMENTS_PATH = 'comments';

// 1. ARTICLES
export function subscribeToArticles(onData: (articles: Article[]) => void) {
  try {
    const q = query(collection(db, ARTICLES_PATH), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items: Article[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Article, 'id'>) });
      });
      onData(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, ARTICLES_PATH);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ARTICLES_PATH);
    return () => {};
  }
}

export async function saveArticleToCloud(article: Article): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_PATH, article.id);
    await setDoc(docRef, {
      title: article.title,
      subtitle: article.subtitle,
      category: article.category,
      authorName: article.authorName,
      authorGrade: article.authorGrade,
      authorRole: article.authorRole,
      date: article.date,
      timestamp: article.timestamp || Date.now(),
      readTime: article.readTime,
      coverImage: article.coverImage || '',
      imageCaption: article.imageCaption || '',
      pullQuote: article.pullQuote || '',
      content: article.content,
      tags: article.tags || [],
      isLeadStory: article.isLeadStory || false,
      isApproved: article.isApproved ?? true,
      isPinned: article.isPinned || false,
      likes: article.likes || 0,
      views: article.views || 0,
      authorId: article.authorId || '',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${ARTICLES_PATH}/${article.id}`);
  }
}

export async function deleteArticleFromCloud(articleId: string): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_PATH, articleId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ARTICLES_PATH}/${articleId}`);
  }
}

export async function toggleArticleLeadStoryInCloud(articleId: string, currentLeadId?: string): Promise<void> {
  try {
    // If there is currently another lead story, unmark it
    if (currentLeadId && currentLeadId !== articleId) {
      await updateDoc(doc(db, ARTICLES_PATH, currentLeadId), { isLeadStory: false });
    }
    const docRef = doc(db, ARTICLES_PATH, articleId);
    await updateDoc(docRef, { isLeadStory: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ARTICLES_PATH}/${articleId}`);
  }
}

export async function toggleArticleApprovalInCloud(articleId: string, isApproved: boolean): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_PATH, articleId);
    await updateDoc(docRef, { isApproved });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ARTICLES_PATH}/${articleId}`);
  }
}

export async function likeArticleInCloud(articleId: string, incrementBy: number): Promise<void> {
  try {
    const docRef = doc(db, ARTICLES_PATH, articleId);
    await updateDoc(docRef, { likes: increment(incrementBy) });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ARTICLES_PATH}/${articleId}`);
  }
}

// 2. EVENTS
export function subscribeToEvents(onData: (events: SchoolEvent[]) => void) {
  try {
    const colRef = collection(db, EVENTS_PATH);
    return onSnapshot(colRef, (snapshot) => {
      const items: SchoolEvent[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<SchoolEvent, 'id'>) });
      });
      onData(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, EVENTS_PATH);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, EVENTS_PATH);
    return () => {};
  }
}

export async function saveEventToCloud(event: SchoolEvent): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_PATH, event.id);
    await setDoc(docRef, {
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      description: event.description,
      organizer: event.organizer,
      organizerRole: event.organizerRole,
      isOfficial: event.isOfficial || false,
      attendingCount: event.attendingCount || 0,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${EVENTS_PATH}/${event.id}`);
  }
}

export async function deleteEventFromCloud(eventId: string): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_PATH, eventId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${EVENTS_PATH}/${eventId}`);
  }
}

export async function joinEventInCloud(eventId: string, incrementBy: number): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_PATH, eventId);
    await updateDoc(docRef, { attendingCount: increment(incrementBy) });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${EVENTS_PATH}/${eventId}`);
  }
}

// 3. PHOTOS
export function subscribeToPhotos(onData: (photos: PhotoSubmission[]) => void) {
  try {
    const colRef = collection(db, PHOTOS_PATH);
    return onSnapshot(colRef, (snapshot) => {
      const items: PhotoSubmission[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<PhotoSubmission, 'id'>) });
      });
      onData(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, PHOTOS_PATH);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PHOTOS_PATH);
    return () => {};
  }
}

export async function savePhotoToCloud(photo: PhotoSubmission): Promise<void> {
  try {
    const docRef = doc(db, PHOTOS_PATH, photo.id);
    await setDoc(docRef, {
      title: photo.title,
      imageUrl: photo.imageUrl,
      photographer: photo.photographer,
      grade: photo.grade,
      eventTag: photo.eventTag,
      date: photo.date,
      likes: photo.likes || 0,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PHOTOS_PATH}/${photo.id}`);
  }
}

export async function deletePhotoFromCloud(photoId: string): Promise<void> {
  try {
    const docRef = doc(db, PHOTOS_PATH, photoId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PHOTOS_PATH}/${photoId}`);
  }
}

export async function likePhotoInCloud(photoId: string, incrementBy: number): Promise<void> {
  try {
    const docRef = doc(db, PHOTOS_PATH, photoId);
    await updateDoc(docRef, { likes: increment(incrementBy) });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PHOTOS_PATH}/${photoId}`);
  }
}

// 4. COMMENTS
export function subscribeToComments(onData: (comments: ArticleComment[]) => void) {
  try {
    const q = query(collection(db, COMMENTS_PATH), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items: ArticleComment[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<ArticleComment, 'id'>) });
      });
      onData(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COMMENTS_PATH);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COMMENTS_PATH);
    return () => {};
  }
}

export async function saveCommentToCloud(comment: ArticleComment): Promise<void> {
  try {
    const docRef = doc(db, COMMENTS_PATH, comment.id);
    await setDoc(docRef, {
      articleId: comment.articleId,
      authorName: comment.authorName,
      authorGrade: comment.authorGrade,
      text: comment.text,
      date: comment.date,
      timestamp: comment.timestamp || Date.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COMMENTS_PATH}/${comment.id}`);
  }
}
