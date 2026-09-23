import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Star, 
  Trash2, 
  Key, 
  PlusCircle, 
  Printer, 
  Calendar, 
  FileText, 
  LogOut, 
  Eye, 
  Image as ImageIcon,
  Check,
  ShieldCheck
} from 'lucide-react';
import { Article, SchoolEvent, PhotoSubmission, TeacherAuth } from '../types/newspaper';
import { setTeacherSecretKey, getTeacherSecretKey, resetToDefaults } from '../utils/storage';

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
  const [activeTab, setActiveTab] = useState<'moderation' | 'announcement' | 'events' | 'photos' | 'security'>('moderation');
  
  // Official announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annSubtitle, setAnnSubtitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annTags, setAnnTags] = useState('Comunicado Oficial, Direção, Coordenação');
  const [annIsLead, setAnnIsLead] = useState(true);
  const [annSuccessMsg, setAnnSuccessMsg] = useState('');
  const [annError, setAnnError] = useState('');

  // Key change state
  const [currentSecret, setCurrentSecret] = useState(getTeacherSecretKey());
  const [newKey, setNewKey] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [keyFeedback, setKeyFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Deletion feedback state
  const [deleteNotice, setDeleteNotice] = useState<string>('');

  if (!isOpen) return null;

  // DIRECT DELETE ARTICLE WITHOUT WINDOW.CONFIRM (CRITICAL FIX FOR USER: "ele nn apaga")
  const handleDeleteArticle = (id: string, title: string) => {
    const updated = articles.filter(art => art.id !== id);
    onUpdateArticles(updated);
    setDeleteNotice(`Artigo "${title.slice(0, 30)}..." foi removido com sucesso.`);
    setTimeout(() => setDeleteNotice(''), 3000);
  };

  // DIRECT DELETE EVENT
  const handleDeleteEvent = (id: string, title: string) => {
    const updated = events.filter(ev => ev.id !== id);
    onUpdateEvents(updated);
    setDeleteNotice(`Evento "${title.slice(0, 30)}..." foi removido com sucesso.`);
    setTimeout(() => setDeleteNotice(''), 3000);
  };

  // DIRECT DELETE PHOTO
  const handleDeletePhoto = (id: string, title: string) => {
    if (onUpdatePhotos) {
      const updated = photos.filter(ph => ph.id !== id);
      onUpdatePhotos(updated);
      setDeleteNotice(`Foto "${title.slice(0, 30)}..." foi removida.`);
      setTimeout(() => setDeleteNotice(''), 3000);
    }
  };

  // Article moderation handlers
  const handleToggleApprove = (id: string) => {
    const updated = articles.map(art => {
      if (art.id === id) {
        return { ...art, isApproved: !art.isApproved };
      }
      return art;
    });
    onUpdateArticles(updated);
  };

  const handleToggleLeadStory = (id: string) => {
    const updated = articles.map(art => {
      if (art.id === id) {
        return { ...art, isLeadStory: !art.isLeadStory };
      }
      return { ...art, isLeadStory: false };
    });
    onUpdateArticles(updated);
  };

  const handleTogglePin = (id: string) => {
    const updated = articles.map(art => {
      if (art.id === id) {
        return { ...art, isPinned: !art.isPinned };
      }
      return art;
    });
    onUpdateArticles(updated);
  };

  // Publish official announcement as teacher
  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    setAnnError('');

    if (!annTitle.trim() || !annContent.trim()) {
      setAnnError('Preencha pelo menos o título e o texto do comunicado.');
      return;
    }

    const newArticle: Article = {
      id: `art-com-${Date.now()}`,
      title: annTitle.trim(),
      subtitle: annSubtitle.trim() || 'Aviso emitido pela coordenação e corpo docente do Instituto Herdar.',
      category: 'Comunicado Oficial',
      authorName: auth.teacherName || 'Corpo Docente',
      authorGrade: auth.role || 'Coordenação Pedagógica',
      authorRole: 'direcao',
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      timestamp: Date.now(),
      readTime: '2 min',
      coverImage: '',
      content: annContent.trim(),
      tags: annTags.split(',').map(t => t.trim()).filter(Boolean),
      isLeadStory: annIsLead,
      isApproved: true,
      isPinned: true,
      likes: 1,
      views: 1,
    };

    onUpdateArticles([newArticle, ...articles]);
    setAnnTitle('');
    setAnnSubtitle('');
    setAnnContent('');
    setAnnSuccessMsg('Comunicado oficial publicado com sucesso no Jornal Herdar!');
    setTimeout(() => {
      setAnnSuccessMsg('');
      setActiveTab('moderation');
    }, 1500);
  };

  // Change secret key
  const handleSaveNewKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKey.length < 4) {
      setKeyFeedback({ type: 'error', text: 'A chave deve ter no mínimo 4 caracteres.' });
      return;
    }
    if (newKey !== confirmKey) {
      setKeyFeedback({ type: 'error', text: 'A confirmação não coincide com a nova chave.' });
      return;
    }

    setTeacherSecretKey(newKey);
    setCurrentSecret(newKey);
    setNewKey('');
    setConfirmKey('');
    setKeyFeedback({ type: 'success', text: 'Chave docente alterada com sucesso!' });
    setTimeout(() => setKeyFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] text-stone-900 border border-stone-300 w-full max-w-5xl h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Sala dos Professores</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-emerald-700 font-medium">Autenticado como Docente</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-title font-semibold text-stone-900">
                Painel Docente & Moderação • Jornal Herdar
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-stone-600 font-medium">
              {auth.teacherName} ({auth.role})
            </span>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              title="Encerrar sessão docente"
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-red-700 border border-stone-200 hover:border-red-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-stone-200 bg-stone-100 flex items-center gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'moderation'
                ? 'border-stone-900 text-stone-900 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Matérias ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcement')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'announcement'
                ? 'border-stone-900 text-stone-900 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar como Professor / Comunicado</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
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
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'photos'
                ? 'border-stone-900 text-stone-900 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Fotos ({photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'border-stone-900 text-stone-900 font-semibold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Chave Secreta</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* Deletion confirmation notice */}
          {deleteNotice && (
            <div className="mb-4 p-3 bg-stone-900 text-white text-xs flex items-center justify-between">
              <span>{deleteNotice}</span>
              <button onClick={() => setDeleteNotice('')} className="text-stone-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 1: MODERATION */}
          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                <div>
                  <h3 className="font-serif-title text-lg font-semibold text-stone-900">
                    Moderação e Controle de Publicações
                  </h3>
                  <p className="text-xs text-stone-500">
                    Exclua matérias, aprove ou defina qual será a manchete principal da capa do Jornal Herdar.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-600">
                  <span>Total de artigos: <strong>{articles.length}</strong></span>
                </div>
              </div>

              {articles.length === 0 ? (
                <div className="p-12 text-center bg-white border border-stone-200">
                  <p className="text-stone-600 text-sm mb-4">Nenhum artigo publicado ainda.</p>
                  <button
                    onClick={() => setActiveTab('announcement')}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                  >
                    Publicar Primeiro Artigo como Professor
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-stone-200 border border-stone-200 bg-white">
                  {articles.map((art) => (
                    <div key={art.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                          <span className="font-semibold text-stone-700">{art.category}</span>
                          <span>·</span>
                          <span>{art.date}</span>
                          <span>·</span>
                          <span>Por: {art.authorName} ({art.authorGrade})</span>
                          {art.isLeadStory && (
                            <span className="text-amber-800 font-semibold">★ Manchete Principal</span>
                          )}
                        </div>
                        <h4 className="font-serif-title font-semibold text-base text-stone-900 line-clamp-1">
                          {art.title}
                        </h4>
                        <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                          {art.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => onOpenArticleReader(art)}
                          className="px-2.5 py-1.5 text-xs text-stone-700 hover:text-stone-900 border border-stone-300 hover:bg-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Ler artigo completo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </button>

                        <button
                          onClick={() => handleToggleLeadStory(art.id)}
                          className={`p-1.5 border transition-colors cursor-pointer ${
                            art.isLeadStory
                              ? 'bg-amber-100 text-amber-900 border-amber-400'
                              : 'text-stone-400 border-stone-200 hover:text-amber-600 hover:border-amber-300'
                          }`}
                          title="Tornar Manchete Principal da Capa"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>

                        {/* DIRECT DELETE BUTTON (NO WINDOW.CONFIRM) */}
                        <button
                          onClick={() => handleDeleteArticle(art.id, art.title)}
                          className="px-2.5 py-1.5 text-xs text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Excluir este artigo imediatamente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: OFFICIAL ANNOUNCEMENT / CREATE AS TEACHER */}
          {activeTab === 'announcement' && (
            <div className="max-w-2xl mx-auto bg-white p-6 border border-stone-200">
              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Coordenação & Corpo Docente
                </span>
                <h3 className="text-xl font-serif-title font-semibold text-stone-900 mt-1">
                  Publicar Comunicado ou Matéria como Professor
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Publicado com o nome do professor e destaque oficial da escola no Jornal Herdar.
                </p>
              </div>

              {annSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{annSuccessMsg}</span>
                </div>
              )}

              {annError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-800 text-xs">
                  {annError}
                </div>
              )}

              <form onSubmit={handlePublishAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Título da Publicação *
                  </label>
                  <input
                    type="text"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="Ex: Calendário Oficial de Provas e Orientações Pedagógicas"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Subtítulo / Resumo
                  </label>
                  <input
                    type="text"
                    value={annSubtitle}
                    onChange={(e) => setAnnSubtitle(e.target.value)}
                    placeholder="Breve resumo da matéria..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Texto do Comunicado / Artigo *
                  </label>
                  <textarea
                    rows={6}
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder="Digite o texto detalhado..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden font-reading text-base"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200">
                  <input
                    type="checkbox"
                    id="annLead"
                    checked={annIsLead}
                    onChange={(e) => setAnnIsLead(e.target.checked)}
                    className="w-4 h-4 text-stone-900 border-stone-300"
                  />
                  <label htmlFor="annLead" className="text-xs text-stone-700 font-medium cursor-pointer">
                    Destacar como Manchete Principal da Capa do Jornal Herdar
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
                  >
                    Publicar Matéria Docente Agora
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: EVENTS MANAGEMENT */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="font-serif-title text-lg font-semibold text-stone-900">
                    Gerenciar Eventos Escolares
                  </h3>
                  <p className="text-xs text-stone-500">
                    Exclua eventos passados ou indesejados.
                  </p>
                </div>
              </div>

              {events.length === 0 ? (
                <div className="p-8 text-center bg-white border border-stone-200 text-stone-500 text-xs">
                  Nenhum evento cadastrado no momento.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((ev) => (
                    <div key={ev.id} className="p-4 bg-white border border-stone-200 relative group">
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                        <span className="font-semibold text-stone-800">{ev.category}</span>
                        <span>{ev.date}</span>
                      </div>
                      <h4 className="font-serif-title font-semibold text-base text-stone-900 mb-1">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                        {ev.description}
                      </p>
                      <div className="text-xs text-stone-500 flex items-center justify-between border-t border-stone-100 pt-2">
                        <span>Local: {ev.location}</span>
                        <button
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          className="text-red-700 hover:text-red-900 flex items-center gap-1 font-medium cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PHOTOS MANAGEMENT */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="font-serif-title text-lg font-semibold text-stone-900">
                    Gerenciar Fotos da Galeria
                  </h3>
                  <p className="text-xs text-stone-500">
                    Exclua fotos enviadas pelos alunos ou professores.
                  </p>
                </div>
              </div>

              {photos.length === 0 ? (
                <div className="p-8 text-center bg-white border border-stone-200 text-stone-500 text-xs">
                  Nenhuma foto na galeria no momento.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((ph) => (
                    <div key={ph.id} className="p-3 bg-white border border-stone-200 flex flex-col justify-between">
                      <div>
                        <div className="aspect-video bg-stone-100 overflow-hidden mb-2">
                          <img src={ph.imageUrl} alt={ph.title} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-serif-title font-semibold text-sm text-stone-900 line-clamp-1">
                          {ph.title}
                        </h4>
                        <p className="text-xs text-stone-500">{ph.photographer} ({ph.grade})</p>
                      </div>
                      <div className="pt-2 border-t border-stone-100 flex justify-end mt-2">
                        <button
                          onClick={() => handleDeletePhoto(ph.id, ph.title)}
                          className="text-red-700 hover:text-red-900 text-xs flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir Foto</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SECURITY & SECRET KEY */}
          {activeTab === 'security' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="bg-white p-6 border border-stone-200">
                <div className="flex items-center gap-2 mb-4">
                  <Key className="w-5 h-5 text-amber-800" />
                  <h3 className="font-serif-title text-lg font-semibold text-stone-900">
                    Alterar Chave Secreta dos Professores
                  </h3>
                </div>

                <div className="mb-4 p-3 bg-stone-100 border border-stone-200 text-xs">
                  <span className="text-stone-500 block">Chave atual do Instituto Herdar:</span>
                  <span className="font-mono text-sm font-semibold text-stone-800 tracking-wider">
                    {currentSecret}
                  </span>
                </div>

                {keyFeedback && (
                  <div className={`mb-4 p-3 text-xs border ${
                    keyFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-red-50 border-red-300 text-red-800'
                  }`}>
                    {keyFeedback.text}
                  </div>
                )}

                <form onSubmit={handleSaveNewKey} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                      Nova Chave Secreta
                    </label>
                    <input
                      type="text"
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      placeholder="Ex: HERDAR_2026_DOCENTES"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                      Confirme a Nova Chave
                    </label>
                    <input
                      type="text"
                      value={confirmKey}
                      onChange={(e) => setConfirmKey(e.target.value)}
                      placeholder="Repita a nova chave..."
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:outline-hidden"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Salvar Nova Chave Secreta
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
