import React from 'react';
import { Feather, Heart, Quote, ArrowRight } from 'lucide-react';
import { Article } from '../types/newspaper';

interface StudentVoiceSectionProps {
  articles: Article[];
  onRead: (article: Article) => void;
  likedArticles: string[];
  onToggleLike: (articleId: string) => void;
  onOpenSubmit: () => void;
}

export const StudentVoiceSection: React.FC<StudentVoiceSectionProps> = ({
  articles,
  onRead,
  likedArticles,
  onToggleLike,
  onOpenSubmit,
}) => {
  // Filter for Opinion, Chronicles, or Cultural essays
  const voiceArticles = articles.filter(
    a => a.category === 'Opinião & Crônicas' || a.category === 'Vida Escolar'
  );

  return (
    <section id="voz-discente" className="my-14 pt-10 border-t-2 border-stone-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-semibold mb-1">
            <Feather className="w-3.5 h-3.5 text-stone-700" />
            <span>Tribuna Aberta & Espaço Literário</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900">
            Voz Discente: Ensaios & Opinião
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Reflexões críticas, crônicas do dia a dia e produções textuais assinadas pelos alunos do Herdar.
          </p>
        </div>

        <button
          onClick={onOpenSubmit}
          className="px-4 py-2 border border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Feather className="w-3.5 h-3.5" />
          <span>Escrever para a Coluna</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {voiceArticles.slice(0, 4).map((art) => {
          const isLiked = likedArticles.includes(art.id);
          const totalLikes = art.likes + (isLiked ? 1 : 0);

          return (
            <article 
              key={art.id}
              onClick={() => onRead(art)}
              className="bg-white border border-stone-200 p-6 sm:p-8 cursor-pointer hover:border-stone-400 transition-all flex flex-col justify-between shadow-xs group"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-stone-800">{art.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{art.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{art.readTime}</span>
                </div>

                <h3 
                  className="font-serif-title font-bold text-xl text-stone-900 group-hover:text-stone-700 transition-colors leading-snug mb-3"
                  style={{ textWrap: 'balance' }}
                >
                  {art.title}
                </h3>

                {art.pullQuote ? (
                  <blockquote className="my-4 pl-3 border-l-2 border-stone-600 text-xs sm:text-sm font-reading text-stone-700 italic">
                    "{art.pullQuote}"
                  </blockquote>
                ) : (
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-reading line-clamp-3 mb-4">
                    {art.subtitle}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <div>
                  <span className="font-semibold text-stone-800">{art.authorName}</span>
                  <span className="text-stone-500 block text-[11px]">{art.authorGrade}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(art.id);
                    }}
                    className={`flex items-center gap-1 transition-colors p-1 ${
                      isLiked ? 'text-rose-600 font-medium' : 'text-stone-400 hover:text-stone-700'
                    }`}
                    title="Apoiar artigo"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="tabular-nums">{totalLikes}</span>
                  </button>

                  <span className="font-medium text-stone-800 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Ler ensaio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
