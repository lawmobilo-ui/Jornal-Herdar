import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Star, 
  Plus, 
  Calendar, 
  FileText, 
  LogOut, 
  Eye, 
  Image as ImageIcon,
  ShieldCheck
} from 'lucide-react';
import { Article, SchoolEvent, PhotoSubmission, TeacherAuth, ArticleCategory } from '../types/newspaper';

interface TeacherPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  auth: TeacherAuth;
  onLogout: () => void;
  articles: Article[];
  events: SchoolEvent[];
  photos?: PhotoSubmission[];
  onUpdateArticles: (articles: Article[]) => void;
  onUpdateEvents: (events: SchoolEvent[]) => void;
  onUpdatePhotos?: (photos: PhotoSubmission[]) => void;
  onOpenArticleReader: (article: Article) => void;
}

export const TeacherPortalModal: React.FC<TeacherPortalModalProps> = ({
  isOpen,
  onClose,
  auth,
  onLogout,
  articles,
  events,
  photos = [],
  onUpdateArticles,
  onUpdateEvents,
  onUpdatePhotos,
  onOpenArticleReader,
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'events' | 'photos' | 'createOfficial'>('articles');
  const [feedbackNotice, setFeedbackNotice] = useState<string>('');

  // Formulário de aviso/comunicado
  const [officialTitle, setOfficialTitle] = useState('');
  const [officialCategory, setOfficialCategory] = useState<ArticleCategory>('Comunicados');
  const [officialContent, setOfficialContent] = useState('');
  const [officialIsLead, setOfficialIsLead] = useState(false);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(''), 3000);
  };

  // Alternar manchete da capa
  const handleToggleLead = (articleId: string) => {
    const updated = articles.map(a => {
      if (a.id === articleId) {
        return { ...a, isLeadStory: !a.isLeadStory };
      }
      return { ...a, isLeadStory: false };
    });
    onUpdateArticles(updated);
    showNotice('Destaque da capa atualizado.');
  };

  // Excluir notícia
  const handleDeleteArticle = (articleId: string) => {
    const updated = articles.filter(a => a.id !== articleId);
    onUpdateArticles(updated);
    showNotice('Notícia excluída com sucesso.');
  };

  // Excluir evento
  const handleDeleteEvent = (eventId: string) => {
    const updated = events.filter(e => e.id !== eventId);
    onUpdateEvents(updated);
    showNotice('Evento removido do calendário.');
  };

  // Excluir foto
  const handleDeletePhoto = (photoId: string) => {
    if (onUpdatePhotos) {
      const updated = photos.filter(p => p.id !== photoId);
      onUpdatePhotos(updated);
      showNotice('Foto removida do mural.');
    }
  };

  // Criar aviso direto como professor
  const handleCreateOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialTitle.trim() || !officialContent.trim()) return;

    const newArticle: Article = {
      id: `doc-${Date.now()}`,
      title: officialTitle.trim(),
      subtitle: `Aviso postado por ${auth.teacherName || 'Professor(a)'} (${auth.role || 'Instituto Herdar'}).`,
      category: officialCategory,
      authorName: auth.teacherName || 'Professor(a)',
      authorGrade: auth.role || 'Professor(a)',
      authorRole: 'professor',
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      timestamp: Date.now(),
      readTime: '1 min',
      coverImage: '',
      content: officialContent.trim(),
      tags: ['Aviso', 'Escola', 'Instituto Herdar'],
      isLeadStory: officialIsLead,
      isApproved: true,
      isPinned: true,
      likes: 1,
      views: 1,
    };

    let updatedArticles = [newArticle, ...articles];
    if (officialIsLead) {
      updatedArticles = updatedArticles.map(a => a.id === newArticle.id ? a : { ...a, isLeadStory: false });
    }

    onUpdateArticles(updatedArticles);
    setOfficialTitle('');
    setOfficialContent('');
    setOfficialIsLead(false);
    setActiveTab('articles');
    showNotice('Aviso publicado no jornal!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] text-stone-900 border border-stone-300 w-full max-w-5xl h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Jornal Herdar</span>
                <span className="text-[11px] bg-stone-900 text-amber-300 px-2 py-0.5 font-semibold">
                  Modo Professor
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-title font-semibold text-stone-900">
                Painel dos Professores
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="text-xs px-3 py-1.5 border border-stone-300 hover:bg-stone-100 text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sair do modo professor"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Notificação temporária */}
        {feedbackNotice && (
          <div className="bg-stone-900 text-amber-300 text-xs px-6 py-2 flex items-center justify-between animate-fade-in">
            <span>{feedbackNotice}</span>
            <button onClick={() => setFeedbackNotice('')} className="text-stone-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Abas */}
        <div className="px-6 border-b border-stone-200 bg-stone-100 flex items-center gap-1 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('articles')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'articles'
                ? 'border-stone-900 text-stone-900 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notícias ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'events'
                ? 'border-stone-900 text-stone-900 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Eventos ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'photos'
                ? 'border-stone-900 text-stone-900 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Fotos ({photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('createOfficial')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'createOfficial'
                ? 'border-stone-900 text-stone-900 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Aviso da Escola</span>
          </button>
        </div>

        {/* Conteúdo das abas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* ABA 1: NOTÍCIAS */}
          {activeTab === 'articles' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-stone-600 font-semibold">
                  Notícias Publicadas no Jornal
                </span>
                <span className="text-xs text-stone-500">
                  Todas as alterações salvam na hora para todos.
                </span>
              </div>

              {articles.length === 0 ? (
                <div className="text-center py-12 bg-white border border-stone-200">
                  <FileText className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs text-stone-600">Nenhuma notícia publicada ainda.</p>
                </div>
              ) : (
                <div className="bg-white border border-stone-200 divide-y divide-stone-100 overflow-hidden">
                  {articles.map((art) => (
                    <div key={art.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                          <span className="font-semibold text-stone-800">{art.category}</span>
                          <span>·</span>
                          <span>{art.authorName} ({art.authorGrade})</span>
                          <span>·</span>
                          <span>{art.date}</span>
                          {art.isLeadStory && (
                            <span className="text-amber-800 font-semibold flex items-center gap-0.5">
                              ★ Destaque
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif-title font-semibold text-stone-900 text-base">
                          {art.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onOpenArticleReader(art)}
                          className="p-1.5 border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs flex items-center gap-1 cursor-pointer"
                          title="Ler notícia"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Ver</span>
                        </button>

                        <button
                          onClick={() => handleToggleLead(art.id)}
                          className={`p-1.5 border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                            art.isLeadStory 
                              ? 'bg-amber-100 border-amber-300 text-amber-900 font-medium' 
                              : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                          title="Colocar como destaque da capa"
                        >
                          <Star className={`w-3.5 h-3.5 ${art.isLeadStory ? 'fill-current' : ''}`} />
                          <span className="hidden sm:inline">Destaque</span>
                        </button>

                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs flex items-center gap-1 cursor-pointer"
                          title="Excluir notícia"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Excluir</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA 2: EVENTOS */}
          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-stone-600 font-semibold">
                  Eventos do Calendário
                </span>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-12 bg-white border border-stone-200">
                  <Calendar className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs text-stone-600">Nenhum evento cadastrado no momento.</p>
                </div>
              ) : (
                <div className="bg-white border border-stone-200 divide-y divide-stone-100">
                  {events.map((ev) => (
                    <div key={ev.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-stone-500 mb-1">
                          {ev.date} · {ev.time} · {ev.location}
                        </div>
                        <h4 className="font-serif-title font-semibold text-stone-900">
                          {ev.title}
                        </h4>
                        <span className="text-xs text-stone-500">
                          Por: {ev.organizer} ({ev.organizerRole})
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                        title="Excluir evento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA 3: FOTOS */}
          {activeTab === 'photos' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-stone-600 font-semibold">
                  Fotos do Mural
                </span>
              </div>

              {photos.length === 0 ? (
                <div className="text-center py-12 bg-white border border-stone-200">
                  <ImageIcon className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs text-stone-600">Nenhuma foto postada no momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {photos.map((ph) => (
                    <div key={ph.id} className="bg-white border border-stone-200 overflow-hidden relative group">
                      <img src={ph.imageUrl} alt={ph.title} className="w-full aspect-video object-cover" />
                      <div className="p-3">
                        <p className="font-serif-title font-semibold text-xs text-stone-900 truncate">{ph.title}</p>
                        <p className="text-[11px] text-stone-500">{ph.photographer} ({ph.grade})</p>
                      </div>
                      <button
                        onClick={() => handleDeletePhoto(ph.id)}
                        className="absolute top-2 right-2 p-1.5 bg-stone-900/80 text-white hover:bg-red-700 transition-colors"
                        title="Excluir foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA 4: PUBLICAR AVISO */}
          {activeTab === 'createOfficial' && (
            <form onSubmit={handleCreateOfficial} className="max-w-2xl mx-auto space-y-4 bg-white p-6 sm:p-8 border border-stone-200">
              <div>
                <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Aviso Rápido</span>
                <h3 className="text-xl font-serif-title font-semibold text-stone-900 mt-1">
                  Publicar Aviso da Escola
                </h3>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Título do Aviso *
                </label>
                <input
                  type="text"
                  value={officialTitle}
                  onChange={(e) => setOfficialTitle(e.target.value)}
                  placeholder="Ex: Informações sobre as provas da próxima semana"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Assunto
                </label>
                <select
                  value={officialCategory}
                  onChange={(e) => setOfficialCategory(e.target.value as ArticleCategory)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                >
                  <option value="Comunicados">Comunicados da Escola</option>
                  <option value="Notícias da Escola">Notícias da Escola</option>
                  <option value="Projetos & Aulas">Projetos & Aulas</option>
                  <option value="Cultura & Artes">Cultura & Artes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Texto do Aviso *
                </label>
                <textarea
                  rows={6}
                  value={officialContent}
                  onChange={(e) => setOfficialContent(e.target.value)}
                  placeholder="Escreva a mensagem que você quer passar para os alunos e famílias..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden font-reading text-base"
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200">
                <input
                  type="checkbox"
                  id="leadOfficial"
                  checked={officialIsLead}
                  onChange={(e) => setOfficialIsLead(e.target.checked)}
                  className="w-4 h-4 text-stone-900 border-stone-300"
                />
                <label htmlFor="leadOfficial" className="text-xs text-stone-700 font-medium cursor-pointer">
                  Destacar como notícia principal na capa do jornal
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Publicar Aviso Agora
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
