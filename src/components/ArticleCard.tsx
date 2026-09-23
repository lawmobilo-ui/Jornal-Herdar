import React from 'react';
import { Heart, Star, Trash2 } from 'lucide-react';
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
  onToggleLeadStory,
  onDelete,
  variant = 'standard',
}) => {
  const isEducator = teacherAuth?.isAuthenticated;

  return (
    <article 
      onClick={() => onRead(article)}
      className="group bg-white dark:bg-[#1A1916] border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
    >
      <div>
        {/* Foto de capa */}
        {article.coverImage && variant !== 'compact' && (
          <div className="aspect-16/10 overflow-hidden bg-stone-100 dark:bg-stone-900 relative">
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
            />
            {article.isLeadStory && (
              <div className="absolute top-2 left-2 bg-stone-900/90 dark:bg-black/90 backdrop-blur-xs text-amber-300 text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 border border-stone-800 dark:border-stone-700">
                ★ Destaque
              </div>
            )}
            {article.category === 'Comunicados' && (
              <div className="absolute top-2 right-2 bg-amber-900/90 text-amber-100 text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 border border-amber-800">
                Aviso
              </div>
            )}
          </div>
        )}

        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
            <span className="font-semibold text-stone-800 dark:text-amber-400">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.date}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          <h3 
            className="font-serif-title font-semibold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-amber-300 transition-colors tracking-tight leading-snug mb-2 text-lg sm:text-xl"
            style={{ textWrap: 'balance' }}
          >
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
            {article.subtitle}
          </p>
        </div>
      </div>

      {/* Rodapé do card */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <div className="truncate pr-2">
          <span className="font-medium text-stone-800 dark:text-stone-200">{article.authorName}</span>
          <span className="text-stone-400 dark:text-stone-500"> ({article.authorGrade})</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike?.(article.id);
            }}
            className={`flex items-center gap-1 hover:text-rose-600 dark:hover:text-rose-400 transition-colors ${
              isLiked ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-stone-500 dark:text-stone-400'
            }`}
            title="Curtir notícia"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{article.likes + (isLiked ? 1 : 0)}</span>
          </button>

          {/* Botão de excluir aparece SOMENTE para educadores autenticados */}
          {isEducator && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(article.id);
              }}
              className="p-1 text-stone-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors rounded-xs"
              title="Excluir notícia (Modo Educador)"
              aria-label="Excluir notícia"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="group-hover:translate-x-0.5 transition-transform text-stone-800 dark:text-stone-200 group-hover:text-stone-950 dark:group-hover:text-amber-400 font-medium inline-flex items-center gap-1">
            Ler <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>

      {/* Barra do Educador */}
      {isEducator && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="bg-stone-100 dark:bg-[#22201D] px-4 py-2 border-t border-stone-300 dark:border-stone-800 flex items-center justify-between text-xs"
        >
          <span className="text-[11px] text-stone-600 dark:text-stone-300 uppercase font-semibold">
            Opções do Educador
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLeadStory?.(article.id)}
              className={`p-1 rounded-xs transition-colors ${
                article.isLeadStory ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
              title="Destacar na Capa"
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(article.id)}
                className="p-1 text-stone-400 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                title="Excluir notícia"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
