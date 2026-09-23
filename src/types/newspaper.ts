export type ArticleCategory = 
  | 'Notícias da Escola'
  | 'Projetos & Aulas'
  | 'Cultura & Artes'
  | 'Comunicados';

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  authorName: string;
  authorGrade: string; // e.g. "3º Ano A", "Prof. Thiago"
  authorRole: 'aluno' | 'professor' | 'gremio' | 'direcao';
  date: string;
  timestamp: number;
  readTime: string;
  coverImage: string;
  imageCaption?: string;
  content: string;
  tags: string[];
  isLeadStory?: boolean;
  isApproved: boolean;
  isPinned?: boolean;
  likes: number;
  views: number;
  pullQuote?: string;
  authorId?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Aulas & Projetos' | 'Festas & Cultura' | 'Esportes' | 'Avisos & Reuniões';
  description: string;
  organizer: string;
  organizerRole: string;
  isOfficial: boolean;
  attendingCount: number;
}

export interface PhotoSubmission {
  id: string;
  title: string;
  imageUrl: string;
  photographer: string;
  grade: string;
  eventTag: string;
  date: string;
  likes: number;
}

export interface ArticleComment {
  id: string;
  articleId: string;
  authorName: string;
  authorGrade: string;
  text: string;
  date: string;
  timestamp: number;
}

export interface TeacherAuth {
  isAuthenticated: boolean;
  teacherName: string;
  role: string;
  loginTime?: string;
}
