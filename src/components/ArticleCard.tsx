import React from 'react';
import { Heart, Star, CheckCircle2, Trash2 } from 'lucide-react';
import { Article, TeacherAuth } from '../types/newspaper';

interface ArticleCardProps {
  article: Article;
  onRead: (article: Article) => void;
  isLiked?: boolean;
  onToggleLike?: (articleId: string) => void;
  teacherAuth?: TeacherAuth;
  onToggleApprove?: (articleId: string) => void;
  onToggleLeadStory?: (articleId: string) => void;
  onDelete?: (articleId: string) => void;
  variant?: 'standard' | 'compact' | 'featured';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onRead,
  isLiked = false,
  onToggleLike,
  teacherAuth,
  onToggleApprove,
  onToggleLeadStory,
  onDelete,
  variant = 'standard',
}) => {
  const isTeacher = teacherAuth?.isAuthenticated;

  return (
    <article 
      onClick={() => onRead(article)}
      className="group bg-white border border-stone-200 hover:border-stone-400 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
    >
      <div>
        {/* Cover image if available */}
        {article.coverImage && variant !== 'compact' && (
          <div className="aspect-16/10 overflow-hidden bg-stone-100 relative">
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
            />
            {article.isLeadStory && (
              <div className="absolute top-2 left-2 bg-stone-900/90 backdrop-blur-xs text-amber-300 text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 border border-stone-800">
                ★ Manchete Principal
              </div>
            )}
            {article.category === 'Comunicado Oficial' && (
              <div className="absolute top-2 right-2 bg-amber-900/90 text-amber-100 text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 border border-amber-800">
                Aviso Oficial
              </div>
            )}
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* Static metadata line - ZERO PILL DISCIPLINE */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="font-semibold text-stone-800">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.date}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          {/* Headline */}
          <h3 
            className="font-serif-title font-semibold text-stone-900 group-hover:text-stone-700 transition-colors tracking-tight leading-snug mb-2 text-lg sm:text-xl"
            style={{ textWrap: 'balance' }}
          >
            {article.title}
          </h3>

          {/* Subtitle / Excerpt */}
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {article.subtitle}
          </p>
        </div>
      </div>

      {/* Card Footer: Author and engagement */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div className="truncate pr-2">
          <span className="font-medium text-stone-800">{article.authorName}</span>
          <span className="text-stone-400"> ({article.authorGrade})</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike?.(article.id);
            }}
            className={`flex items-center gap-1 hover:text-rose-600 transition-colors ${
              isLiked ? 'text-rose-600 font-medium' : 'text-stone-500'
            }`}
            title="Apoiar artigo"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{article.likes + (isLiked ? 1 : 0)}</span>
          </button>

          {/* Direct Delete button accessible for quick removal */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(article.id);
              }}
              className="p-1 text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors rounded-xs"
              title="Excluir matéria"
              aria-label="Excluir matéria"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="group-hover:translate-x-0.5 transition-transform text-stone-800 font-medium inline-flex items-center gap-1">
            Ler <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>

      {/* Teacher moderation bar when teacher mode is active */}
      {isTeacher && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="bg-stone-100 px-4 py-2 border-t border-stone-300 flex items-center justify-between text-xs"
        >
          <span className="text-[11px] text-stone-600 uppercase font-semibold">
            Moderação Docente
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLeadStory?.(article.id)}
              className={`p-1 rounded-xs transition-colors ${
                article.isLeadStory ? 'text-amber-600' : 'text-stone-400 hover:text-amber-600'
              }`}
              title="Fixar como Manchete Principal"
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => onDelete?.(article.id)}
              className="p-1 text-stone-400 hover:text-red-700 transition-colors"
              title="Excluir matéria"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
