import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Share2, 
  Printer, 
  MessageSquare, 
  Check, 
  Send, 
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { Article, ArticleComment, TeacherAuth } from '../types/newspaper';

interface ArticleReaderModalProps {
  article: Article | null;
  onClose: () => void;
  comments: ArticleComment[];
  onAddComment: (comment: ArticleComment) => void;
  isLiked: boolean;
  onToggleLike: (articleId: string) => void;
  teacherAuth?: TeacherAuth;
  onDeleteArticle?: (articleId: string) => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  comments,
  onAddComment,
  isLiked,
  onToggleLike,
  teacherAuth,
  onDeleteArticle,
}) => {
  const [copied, setCopied] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentGrade, setCommentGrade] = useState('');
  const [commentText, setCommentText] = useState('');

  if (!article) return null;

  const articleComments = comments.filter(c => c.articleId === article.id);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment: ArticleComment = {
      id: `comm-${Date.now()}`,
      articleId: article.id,
      authorName: commentName.trim(),
      authorGrade: commentGrade.trim() || 'Comunidade Herdar',
      text: commentText.trim(),
      date: new Date().toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit' 
      }),
      timestamp: Date.now(),
    };

    onAddComment(newComment);
    setCommentText('');
  };

  const handleDelete = () => {
    if (onDeleteArticle) {
      onDeleteArticle(article.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FAF8F5] text-stone-900 border border-stone-300 w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col my-auto relative">
        
        {/* Top reader action bar */}
        <div className="p-3 sm:px-6 border-b border-stone-200 bg-white flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-700">{article.category}</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLike(article.id)}
              className={`px-3 py-1.5 text-xs flex items-center gap-1.5 transition-colors border ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-700 font-semibold'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
              title="Apoiar este artigo"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{article.likes + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-1.5 bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
              title="Copiar link da reportagem"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
              title="Imprimir artigo"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Direct delete button in reader */}
            {onDeleteArticle && (
              <button
                onClick={handleDelete}
                className="p-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors flex items-center gap-1 text-xs px-2"
                title="Excluir esta publicação"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Excluir</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors ml-1"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Narrative */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-10">
          <article className="max-w-2xl mx-auto">
            
            {/* Header info */}
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">
                {article.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif-title font-bold text-stone-900 tracking-tight leading-tight mt-2 mb-4" style={{ textWrap: 'balance' }}>
                {article.title}
              </h1>
              <p className="text-base sm:text-lg text-stone-600 font-serif-title italic leading-relaxed">
                {article.subtitle}
              </p>
            </div>

            {/* Author Byline */}
            <div className="flex items-center gap-3 py-4 border-y border-stone-200 mb-8">
              <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-serif-title font-semibold text-sm">
                {article.authorName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-stone-900">{article.authorName}</span>
                  {(article.authorRole === 'direcao' || article.authorRole === 'professor') && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-900 font-medium bg-amber-50 px-1.5 py-0.5 border border-amber-200">
                      <ShieldCheck className="w-3 h-3" /> Publicação Docente
                    </span>
                  )}
                </div>
                <div className="text-xs text-stone-500">
                  {article.authorGrade} · Jornal Herdar
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.coverImage && (
              <figure className="mb-8">
                <div className="overflow-hidden border border-stone-200 bg-stone-100">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full max-h-[460px] object-cover"
                  />
                </div>
                {article.imageCaption && (
                  <figcaption className="text-xs font-reading text-stone-500 italic mt-2 text-center">
                    {article.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Pull quote if exists */}
            {article.pullQuote && (
              <blockquote className="my-8 px-6 py-4 border-l-3 border-stone-900 bg-stone-100/60 font-serif-title text-xl text-stone-900 italic leading-snug">
                "{article.pullQuote}"
              </blockquote>
            )}

            {/* Article Prose with drop-cap on first paragraph */}
            <div className="text-stone-800 font-reading text-lg leading-relaxed space-y-6">
              {article.content.split('\n\n').map((paragraph, idx) => (
                <p 
                  key={idx}
                  className={idx === 0 ? "first-letter:text-5xl first-letter:font-serif-title first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-stone-900" : ""}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                <span className="font-semibold text-stone-700">Palavras-chave:</span>
                {article.tags.map((tag, i) => (
                  <span key={i} className="hover:text-stone-900">
                    #{tag}{i < article.tags.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            )}

            {/* Interactive Comment Section */}
            <section className="mt-12 pt-8 border-t-2 border-stone-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-stone-700" />
                  <h3 className="font-serif-title font-semibold text-xl text-stone-900">
                    Comentários da Comunidade ({articleComments.length})
                  </h3>
                </div>
              </div>

              {/* Add comment form */}
              <form onSubmit={handlePostComment} className="mb-8 p-4 bg-white border border-stone-200 space-y-3">
                <span className="text-xs uppercase tracking-wider text-stone-600 font-semibold block">
                  Deixe sua mensagem sobre esta matéria
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Seu Nome"
                    className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 focus:border-stone-800 focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    value={commentGrade}
                    onChange={(e) => setCommentGrade(e.target.value)}
                    placeholder="Sua Turma ou Função"
                    className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 focus:border-stone-800 focus:outline-hidden"
                  />
                </div>

                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva seu comentário..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:border-stone-800 focus:outline-hidden"
                  required
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-stone-900 text-stone-50 text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Comentário</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {articleComments.length === 0 ? (
                  <p className="text-xs text-stone-500 italic text-center py-4">
                    Nenhum comentário publicado ainda. Seja o primeiro a comentar!
                  </p>
                ) : (
                  articleComments.map((comm) => (
                    <div key={comm.id} className="p-4 bg-white border border-stone-200">
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                        <span className="font-semibold text-stone-800">{comm.authorName} ({comm.authorGrade})</span>
                        <span>{comm.date}</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed font-reading text-sm">
                        {comm.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

          </article>
        </div>

      </div>
    </div>
  );
};
