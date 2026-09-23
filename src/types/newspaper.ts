export type ArticleCategory = 
  | 'Ciência & Tecnologia'
  | 'Cultura & Artes'
  | 'Esportes & Grêmio'
  | 'Opinião & Crônicas'
  | 'Vida Escolar'
  | 'Comunicado Oficial';

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  authorName: string;
  authorGrade: string; // e.g. "3º Ano EM A", "Prof. Ricardo", "Grêmio Herdar"
  authorRole: 'aluno' | 'professor' | 'gremio' | 'direcao';
  date: string;
  timestamp: number;
  readTime: string;
  coverImage: string;
  imageCaption?: string;
  content: string; // Markdown or paragraph formatted text
  tags: string[];
  isLeadStory?: boolean;
  isApproved: boolean; // Teachers can moderate
  isPinned?: boolean;
  likes: number;
  views: number;
  pullQuote?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Acadêmico' | 'Esportivo' | 'Cultural' | 'Vestibular & ENEM' | 'Comunidade';
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
