import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  PenSquare, 
  Printer, 
  ShieldCheck, 
  KeyRound, 
  BookOpen, 
  X,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { 
  Article, 
  SchoolEvent, 
  PhotoSubmission, 
  ArticleComment, 
  TeacherAuth 
} from './types/newspaper';
import { 
  getStoredArticles, 
  saveStoredArticles, 
  getStoredEvents, 
  saveStoredEvents, 
  getStoredPhotos, 
  saveStoredPhotos, 
  getStoredComments, 
  saveStoredComments, 
  getTeacherAuthSession, 
  setTeacherAuthSession, 
  clearTeacherAuthSession, 
  getLikedArticles, 
  toggleLikedArticle, 
  getJoinedEvents, 
  toggleJoinedEvent
} from './utils/storage';
import { Masthead } from './components/Masthead';
import { LeadArticleHero } from './components/LeadArticleHero';
import { ArticleCard } from './components/ArticleCard';
import { EventsSection } from './components/EventsSection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { StudentVoiceSection } from './components/StudentVoiceSection';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { TeacherPortalModal } from './components/TeacherPortalModal';
import { StudentSubmitModal } from './components/StudentSubmitModal';
import { ArticleReaderModal } from './components/ArticleReaderModal';

export default function App() {
  // Data state
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [photos, setPhotos] = useState<PhotoSubmission[]>([]);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  
  // Teacher auth state
  const [teacherAuth, setTeacherAuth] = useState<TeacherAuth>({
    isAuthenticated: false,
    teacherName: '',
    role: '',
  });

  // User interactions
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [likedPhotos, setLikedPhotos] = useState<string[]>([]);

  // Filtering & search
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast / notification message
  const [toastMessage, setToastMessage] = useState<string>('');

  // Modals state
  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState<boolean>(false);
  const [isTeacherPortalOpen, setIsTeacherPortalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [submitDefaultTab, setSubmitDefaultTab] = useState<'article' | 'photo' | 'event'>('article');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Initialize from storage
  useEffect(() => {
    setArticles(getStoredArticles());
    setEvents(getStoredEvents());
    setPhotos(getStoredPhotos());
    setComments(getStoredComments());
    setTeacherAuth(getTeacherAuthSession());
    setLikedArticles(getLikedArticles());
    setJoinedEvents(getJoinedEvents());
  }, []);

  // Update articles & persist
  const handleUpdateArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    saveStoredArticles(newArticles);
  };

  // Update events & persist
  const handleUpdateEvents = (newEvents: SchoolEvent[]) => {
    setEvents(newEvents);
    saveStoredEvents(newEvents);
  };

  // Update photos & persist
  const handleUpdatePhotos = (newPhotos: PhotoSubmission[]) => {
    setPhotos(newPhotos);
    saveStoredPhotos(newPhotos);
  };

  // DIRECT DELETE ARTICLE WITHOUT WINDOW.CONFIRM (CRITICAL FIX FOR USER: "ele nn apaga")
  const handleDeleteArticle = (id: string) => {
    const target = articles.find(a => a.id === id);
    const updated = articles.filter(a => a.id !== id);
    handleUpdateArticles(updated);
    if (activeArticle?.id === id) {
      setActiveArticle(null);
    }
    showToast(`Matéria "${target?.title.slice(0, 25) || ''}..." excluída com sucesso.`);
  };

  // DIRECT DELETE EVENT
  const handleDeleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    handleUpdateEvents(updated);
    showToast('Evento removido do calendário.');
  };

  // DIRECT DELETE PHOTO
  const handleDeletePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    handleUpdatePhotos(updated);
    showToast('Foto removida da galeria.');
  };

  // Update comments & persist
  const handleAddComment = (newComment: ArticleComment) => {
    const updated = [newComment, ...comments];
    setComments(updated);
    saveStoredComments(updated);
  };

  // Teacher login success
  const handleTeacherLoginSuccess = (auth: TeacherAuth) => {
    setTeacherAuth(auth);
    setTeacherAuthSession(auth);
    showToast(`Conectado como ${auth.teacherName} (Docente)`);
  };

  // Teacher logout
  const handleTeacherLogout = () => {
    const emptyAuth: TeacherAuth = { isAuthenticated: false, teacherName: '', role: '' };
    setTeacherAuth(emptyAuth);
    clearTeacherAuthSession();
    showToast('Sessão docente encerrada.');
  };

  // Toggle like on article
  const handleToggleLike = (articleId: string) => {
    const isNowLiked = toggleLikedArticle(articleId);
    if (isNowLiked) {
      setLikedArticles([...likedArticles, articleId]);
    } else {
      setLikedArticles(likedArticles.filter(id => id !== articleId));
    }
  };

  // Toggle event join
  const handleToggleJoin = (eventId: string) => {
    const isNowJoined = toggleJoinedEvent(eventId);
    if (isNowJoined) {
      setJoinedEvents([...joinedEvents, eventId]);
    } else {
      setJoinedEvents(joinedEvents.filter(id => id !== eventId));
    }
  };

  // Toggle photo like
  const handleTogglePhotoLike = (photoId: string) => {
    if (likedPhotos.includes(photoId)) {
      setLikedPhotos(likedPhotos.filter(id => id !== photoId));
    } else {
      setLikedPhotos([...likedPhotos, photoId]);
    }
  };

  // Add new article (handles both student and teacher!)
  const handleAddArticle = (article: Article) => {
    const updated = [article, ...articles];
    handleUpdateArticles(updated);
    setActiveArticle(article);
    showToast('Matéria publicada com sucesso no Jornal Herdar!');
  };

  // Add new photo
  const handleAddPhoto = (photo: PhotoSubmission) => {
    const updated = [photo, ...photos];
    handleUpdatePhotos(updated);
    showToast('Foto adicionada à galeria do Jornal Herdar!');
  };

  // Add new event
  const handleAddEvent = (event: SchoolEvent) => {
    const updated = [event, ...events];
    handleUpdateEvents(updated);
    showToast('Evento cadastrado no calendário escolar!');
  };

  // Quick moderation actions
  const handleToggleApprove = (id: string) => {
    const updated = articles.map(a => a.id === id ? { ...a, isApproved: !a.isApproved } : a);
    handleUpdateArticles(updated);
  };

  const handleToggleLeadStory = (id: string) => {
    const updated = articles.map(a => {
      if (a.id === id) {
        return { ...a, isLeadStory: !a.isLeadStory };
      }
      return { ...a, isLeadStory: false };
    });
    handleUpdateArticles(updated);
  };

  // Filtered and searched articles
  const visibleArticles = useMemo(() => {
    let list = articles;

    if (selectedCategory !== 'Todas') {
      list = list.filter(a => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [articles, selectedCategory, searchQuery]);

  // Lead story calculation
  const leadArticle = useMemo(() => {
    if (visibleArticles.length === 0) return null;
    const explicitLead = visibleArticles.find(a => a.isLeadStory);
    return explicitLead || visibleArticles[0];
  }, [visibleArticles]);

  // Secondary articles (excluding lead)
  const secondaryArticles = useMemo(() => {
    if (!leadArticle) return visibleArticles;
    return visibleArticles.filter(a => a.id !== leadArticle.id);
  }, [visibleArticles, leadArticle]);

  const categories: string[] = [
    'Todas',
    'Vida Escolar',
    'Ciência & Tecnologia',
    'Esportes & Grêmio',
    'Cultura & Artes',
    'Opinião & Crônicas',
    'Comunicado Oficial',
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col selection:bg-[#E5D7C3]">
      
      {/* Toast Notification Bar */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-60 bg-stone-900 text-stone-100 px-4 py-2.5 text-xs shadow-xl border border-stone-700 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-2 text-stone-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header & Broadsheet Masthead */}
      <Masthead
        teacherAuth={teacherAuth}
        onOpenTeacherAuth={() => setIsTeacherAuthOpen(true)}
        onOpenTeacherPortal={() => setIsTeacherPortalOpen(true)}
        onOpenSubmitModal={(tab = 'article') => {
          setSubmitDefaultTab(tab);
          setIsSubmitModalOpen(true);
        }}
      />

      {/* Teacher Session Banner when logged in */}
      {teacherAuth.isAuthenticated && (
        <aside aria-label="Sessão docente ativa" className="no-print bg-stone-900 text-stone-100 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-xs">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>
                <strong>Modo Docente Ativo</strong>: Conectado como {teacherAuth.teacherName} ({teacherAuth.role})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSubmitDefaultTab('article');
                  setIsSubmitModalOpen(true);
                }}
                className="text-amber-300 hover:underline font-semibold cursor-pointer"
              >
                + Criar Artigo como Professor
              </button>
              <span>·</span>
              <button
                onClick={() => setIsTeacherPortalOpen(true)}
                className="text-stone-300 hover:text-white cursor-pointer"
              >
                Painel de Moderação
              </button>
              <span>·</span>
              <button
                onClick={handleTeacherLogout}
                className="text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                Encerrar Sessão
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8">
        
        {/* Navigation / Filter / Search Strip */}
        <section id="reportagens" className="no-print mb-8 pb-4 border-b border-stone-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-stone-200/60 border border-stone-300">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-stone-950 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box & Quick post button */}
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar matérias..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-stone-300 focus:border-stone-800 focus:outline-hidden"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setSubmitDefaultTab('article');
                setIsSubmitModalOpen(true);
              }}
              className="px-3 py-2 bg-stone-900 text-white text-xs font-medium flex items-center gap-1 hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Matéria</span>
            </button>
          </div>
        </section>

        {/* Lead Story (Pattern C: Visual Rank Hierarchy) */}
        {leadArticle && !searchQuery && selectedCategory === 'Todas' && (
          <div id="capa">
            <LeadArticleHero
              article={leadArticle}
              onRead={(art) => setActiveArticle(art)}
              isLiked={likedArticles.includes(leadArticle.id)}
              onToggleLike={handleToggleLike}
            />
          </div>
        )}

        {/* Articles Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 bg-stone-900"></span>
            <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-stone-900">
              {searchQuery
                ? `Resultados da busca por "${searchQuery}" (${visibleArticles.length})`
                : selectedCategory === 'Todas'
                ? 'Edição Atual: Notícias & Artigos'
                : `Seção: ${selectedCategory} (${visibleArticles.length})`}
            </h2>
          </div>

          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            Jornal Herdar • Instituto Herdar
          </span>
        </div>

        {/* Articles Grid or Clean Empty State */}
        {visibleArticles.length === 0 ? (
          <div className="bg-white border border-stone-300 p-8 sm:p-14 text-center my-6">
            <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="font-serif-title text-2xl font-semibold text-stone-800 mb-2">
              Nenhuma matéria publicada ainda
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
              O espaço está aberto para alunos e professores postarem artigos, comunicados, reportagens e crônicas do Instituto Herdar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitDefaultTab('article');
                  setIsSubmitModalOpen(true);
                }}
                className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Escrever Primeira Matéria
              </button>

              {!teacherAuth.isAuthenticated && (
                <button
                  onClick={() => setIsTeacherAuthOpen(true)}
                  className="px-4 py-2.5 border border-stone-300 hover:border-stone-800 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                  <span>Acesso Professor (Chave Secreta)</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(!searchQuery && selectedCategory === 'Todas' ? secondaryArticles : visibleArticles).map((art) => (
              <ArticleCard
                key={art.id}
                article={art}
                onRead={(item) => setActiveArticle(item)}
                isLiked={likedArticles.includes(art.id)}
                onToggleLike={handleToggleLike}
                teacherAuth={teacherAuth}
                onToggleApprove={handleToggleApprove}
                onToggleLeadStory={handleToggleLeadStory}
                onDelete={handleDeleteArticle}
              />
            ))}
          </div>
        )}

        {/* 2. School Events Mural */}
        <EventsSection
          events={events}
          joinedEvents={joinedEvents}
          onToggleJoin={handleToggleJoin}
          onOpenNewEvent={() => {
            setSubmitDefaultTab('event');
            setIsSubmitModalOpen(true);
          }}
          onDeleteEvent={handleDeleteEvent}
          teacherAuth={teacherAuth}
        />

        {/* 3. Photo Gallery */}
        <PhotoGallerySection
          photos={photos}
          likedPhotos={likedPhotos}
          onTogglePhotoLike={handleTogglePhotoLike}
          onOpenNewPhoto={() => {
            setSubmitDefaultTab('photo');
            setIsSubmitModalOpen(true);
          }}
          onDeletePhoto={handleDeletePhoto}
          teacherAuth={teacherAuth}
        />

        {/* 4. Student Voice & Literary Essays (if essays exist) */}
        {articles.some(a => a.category === 'Opinião & Crônicas' || a.category === 'Vida Escolar') && (
          <StudentVoiceSection
            articles={articles}
            onRead={(item) => setActiveArticle(item)}
            likedArticles={likedArticles}
            onToggleLike={handleToggleLike}
            onOpenSubmit={() => {
              setSubmitDefaultTab('article');
              setIsSubmitModalOpen(true);
            }}
          />
        )}

      </main>

      {/* Institutional BroadSheet Footer */}
      <footer className="border-t-2 border-stone-800 bg-[#FAF7F2] text-stone-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-300">
            {/* School Profile */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold block">
                Comunidade Escolar
              </span>
              <h3 className="text-2xl font-serif-title font-bold text-stone-950">
                Jornal Herdar
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-reading text-sm max-w-sm">
                Espaço digital oficial do Instituto Herdar para publicação de reportagens, fotografias, eventos e avisos do corpo docente e discente.
              </p>
            </div>

            {/* Quick sections */}
            <div className="md:col-span-3 space-y-2">
              <span className="text-xs uppercase tracking-wider text-stone-800 font-bold block mb-3">
                Seções do Jornal
              </span>
              <ul className="space-y-1.5 text-xs text-stone-600">
                <li><a href="#capa" className="hover:text-stone-950 transition-colors">Capa & Destaque</a></li>
                <li><a href="#reportagens" className="hover:text-stone-950 transition-colors">Todas as Matérias</a></li>
                <li><a href="#eventos" className="hover:text-stone-950 transition-colors">Mural de Eventos</a></li>
                <li><a href="#galeria" className="hover:text-stone-950 transition-colors">Mural de Fotos</a></li>
              </ul>
            </div>

            {/* Staff & Faculty Discreet Entry */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs uppercase tracking-wider text-stone-800 font-bold block mb-3">
                Acesso aos Professores
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                Professores e coordenação podem utilizar a chave secreta para publicar comunicados oficiais e gerenciar o mural.
              </p>

              {/* Discreet Teacher Portal Link in footer */}
              <div className="pt-2">
                <button
                  onClick={teacherAuth.isAuthenticated ? () => setIsTeacherPortalOpen(true) : () => setIsTeacherAuthOpen(true)}
                  className="text-xs text-stone-600 hover:text-stone-950 border-b border-stone-400 hover:border-stone-900 pb-0.5 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-stone-600" />
                  <span>
                    {teacherAuth.isAuthenticated 
                      ? 'Painel da Sala dos Professores (Ativo)' 
                      : 'Entrar com Chave Secreta dos Professores'}
                  </span>
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => window.print()}
                  className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Edição do Jornal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
            <div>
              © Jornal Herdar · Instituto Herdar. Publicação aberta da comunidade escolar.
            </div>
            <div className="flex items-center gap-4">
              <span>Instituto Herdar</span>
            </div>
          </div>

        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Teacher Passkey Auth Modal */}
      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        onSuccess={handleTeacherLoginSuccess}
      />

      {/* 2. Teacher Full Moderation Portal */}
      <TeacherPortalModal
        isOpen={isTeacherPortalOpen}
        onClose={() => setIsTeacherPortalOpen(false)}
        auth={teacherAuth}
        onLogout={handleTeacherLogout}
        articles={articles}
        events={events}
        photos={photos}
        onUpdateArticles={handleUpdateArticles}
        onUpdateEvents={handleUpdateEvents}
        onUpdatePhotos={handleUpdatePhotos}
        onOpenArticleReader={(art) => {
          setIsTeacherPortalOpen(false);
          setActiveArticle(art);
        }}
      />

      {/* 3. Universal Submit Modal (Articles, Photos, Events for Students AND Teachers) */}
      <StudentSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        defaultTab={submitDefaultTab}
        teacherAuth={teacherAuth}
        onAddArticle={handleAddArticle}
        onAddPhoto={handleAddPhoto}
        onAddEvent={handleAddEvent}
        onTeacherLogin={handleTeacherLoginSuccess}
      />

      {/* 4. Full Article Reader Modal */}
      <ArticleReaderModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
        comments={comments}
        onAddComment={handleAddComment}
        isLiked={activeArticle ? likedArticles.includes(activeArticle.id) : false}
        onToggleLike={handleToggleLike}
        teacherAuth={teacherAuth}
        onDeleteArticle={handleDeleteArticle}
      />

    </div>
  );
}
