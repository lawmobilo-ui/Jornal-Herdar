import React from 'react';
import { Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { Article } from '../types/newspaper';

interface LeadArticleHeroProps {
  article: Article;
  onRead: (article: Article) => void;
  isLiked?: boolean;
  onToggleLike?: (articleId: string) => void;
}

export const LeadArticleHero: React.FC<LeadArticleHeroProps> = ({
  article,
  onRead,
  isLiked = false,
  onToggleLike,
}) => {
  return (
    <section className="mb-12 border-b-2 border-stone-300 dark:border-stone-800 pb-10 transition-colors">
      <div 
        onClick={() => onRead(article)}
        className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cursor-pointer bg-white dark:bg-[#1A1916] p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-stone-400 dark:hover:border-stone-600 transition-all"
      >
        {/* Coluna da esquerda */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold mb-3">
              <span className="text-amber-800 dark:text-amber-400 font-bold">Destaque na Capa</span>
              <span aria-hidden="true">·</span>
              <span>{article.category}</span>
            </div>

            <h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-serif-title font-bold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-amber-300 transition-colors tracking-tight leading-tight mb-4"
              style={{ textWrap: 'balance' }}
            >
              {article.title}
            </h2>

            <p className="text-stone-600 dark:text-stone-300 font-serif-title text-base sm:text-lg italic leading-relaxed mb-6">
              {article.subtitle}
            </p>

            {article.pullQuote && (
              <blockquote className="my-4 pl-4 border-l-2 border-stone-800 dark:border-amber-400 text-xs sm:text-sm font-reading text-stone-700 dark:text-stone-300 italic">
                "{article.pullQuote}"
              </blockquote>
            )}
          </div>

          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200">{article.authorName}</span>
              <span className="text-stone-500 dark:text-stone-400"> · {article.authorGrade}</span>
              <div className="text-stone-400 dark:text-stone-500 mt-0.5">{article.date} · {article.readTime}</div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike?.(article.id);
                }}
                className={`flex items-center gap-1.5 transition-colors p-2 border ${
                  isLiked 
                    ? 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40' 
                    : 'text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{article.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <span className="inline-flex items-center gap-1.5 font-medium text-stone-900 dark:text-stone-100 group-hover:translate-x-1 transition-transform">
                <span>Ler Notícia Completa</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Coluna da foto */}
        <div className="lg:col-span-6">
          <div className="aspect-16/10 sm:aspect-16/11 overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 relative">
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            />
            {article.category === 'Comunicados' && (
              <div className="absolute top-3 left-3 bg-stone-900/90 text-amber-300 text-xs uppercase tracking-wider font-semibold px-2.5 py-1 border border-stone-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Aviso da Escola</span>
              </div>
            )}
          </div>
          {article.imageCaption && (
            <p className="text-xs font-reading text-stone-500 dark:text-stone-400 italic mt-2 text-right">
              {article.imageCaption}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
