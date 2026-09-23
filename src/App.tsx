import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Printer, 
  ShieldCheck, 
  BookOpen, 
  X,
  Plus,
  CheckCircle2,
  Wifi,
  UserCheck
} from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { 
  Article, 
  SchoolEvent, 
  PhotoSubmission, 
  ArticleComment, 
  TeacherAuth 
} from './types/newspaper';
import { 
  subscribeToArticles, 
  saveArticleToCloud, 
  deleteArticleFromCloud,
  toggleArticleLeadStoryInCloud,
  toggleArticleApprovalInCloud,
  likeArticleInCloud,
  subscribeToEvents, 
  saveEventToCloud, 
  deleteEventFromCloud,
  joinEventInCloud,
  subscribeToPhotos, 
  savePhotoToCloud, 
  deletePhotoFromCloud,
  likePhotoInCloud,
  subscribeToComments, 
  saveCommentToCloud 
} from './services/newspaperDb';
import { 
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
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { TeacherPortalModal } from './components/TeacherPortalModal';
import { StudentSubmitModal } from './components/StudentSubmitModal';
import { ArticleReaderModal } from './components/ArticleReaderModal';

export default function App() {
  // Dados em tempo real vindos do Firebase
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [photos, setPhotos] = useState<PhotoSubmission[]>([]);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  
  // Estado do professor
  const [teacherAuth, setTeacherAuth] = useState<TeacherAuth>({
    isAuthenticated: false,
    teacherName: '',
    role: '',
  });

  // Interações locais (curtidas, presenças em eventos)
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  const [likedPhotos, setLikedPhotos] = useState<string[]>([]);

  // Filtros e busca
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mensagem de aviso
  const [toastMessage, setToastMessage] = useState<string>('');

  // Modais
  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState<boolean>(false);
  const [isTeacherPortalOpen, setIsTeacherPortalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [submitDefaultTab, setSubmitDefaultTab] = useState<'article' | 'photo' | 'event'>('article');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. Sincronização em tempo real com o Firebase
  useEffect(() => {
    setTeacherAuth(getTeacherAuthSession());
    setLikedArticles(getLikedArticles());
    setJoinedEvents(getJoinedEvents());

    // Reconhece login Google automaticamente
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docAuth: TeacherAuth = {
          isAuthenticated: true,
          teacherName: user.displayName || 'Professor(a) Herdar',
          role: 'Professor(a)',
        };
        setTeacherAuth(docAuth);
        setTeacherAuthSession(docAuth);
      }
    });

    const unsubArticles = subscribeToArticles((items) => {
      setArticles(items);
    });

    const unsubEvents = subscribeToEvents((items) => {
      setEvents(items);
    });

    const unsubPhotos = subscribeToPhotos((items) => {
      setPhotos(items);
    });

    const unsubComments = subscribeToComments((items) => {
      setComments(items);
    });

    return () => {
      unsubscribeAuth();
      unsubArticles();
      unsubEvents();
      unsubPhotos();
      unsubComments();
    };
  }, []);

  const handleUpdateArticles = async (newArticles: Article[]) => {
    setArticles(newArticles);
  };

  const handleUpdateEvents = async (newEvents: SchoolEvent[]) => {
    setEvents(newEvents);
  };

  const handleUpdatePhotos = async (newPhotos: PhotoSubmission[]) => {
    setPhotos(newPhotos);
  };

  // Excluir notícia (apaga na nuvem para todos)
  const handleDeleteArticle = async (id: string) => {
    const target = articles.find(a => a.id === id);
    setArticles(prev => prev.filter(a => a.id !== id));
    if (activeArticle?.id === id) {
      setActiveArticle(null);
    }
    await deleteArticleFromCloud(id);
    showToast(`Notícia "${target?.title.slice(0, 25) || ''}..." apagada com sucesso.`);
  };

  // Excluir evento
  const handleDeleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    await deleteEventFromCloud(id);
    showToast('Evento apagado do calendário.');
  };

  // Excluir foto
  const handleDeletePhoto = async (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    await deletePhotoFromCloud(id);
    showToast('Foto apagada do mural.');
  };

  // Adicionar comentário
  const handleAddComment = async (newComment: ArticleComment) => {
    setComments(prev => [newComment, ...prev]);
    await saveCommentToCloud(newComment);
    showToast('Comentário enviado!');
  };

  // Login de professor sem senha
  const handleTeacherLoginSuccess = (authData: TeacherAuth) => {
    setTeacherAuth(authData);
    setTeacherAuthSession(authData);
    showToast(`Conectado como ${authData.teacherName}`);
  };

  // Sair do modo professor
  const handleTeacherLogout = async () => {
    await signOut(auth).catch(() => {});
    const emptyAuth: TeacherAuth = { isAuthenticated: false, teacherName: '', role: '' };
    setTeacherAuth(emptyAuth);
    clearTeacherAuthSession();
    showToast('Você saiu do modo professor.');
  };

  // Curtir notícia
  const handleToggleLike = async (articleId: string) => {
    const isNowLiked = toggleLikedArticle(articleId);
    if (isNowLiked) {
      setLikedArticles([...likedArticles, articleId]);
      await likeArticleInCloud(articleId, 1);
    } else {
      setLikedArticles(likedArticles.filter(id => id !== articleId));
      await likeArticleInCloud(articleId, -1);
    }
  };

  // Participar de evento
  const handleToggleJoin = async (eventId: string) => {
    const isNowJoined = toggleJoinedEvent(eventId);
    if (isNowJoined) {
      setJoinedEvents([...joinedEvents, eventId]);
      await joinEventInCloud(eventId, 1);
    } else {
      setJoinedEvents(joinedEvents.filter(id => id !== eventId));
      await joinEventInCloud(eventId, -1);
    }
  };

  // Curtir foto
  const handleTogglePhotoLike = async (photoId: string) => {
    if (likedPhotos.includes(photoId)) {
      setLikedPhotos(likedPhotos.filter(id => id !== photoId));
      await likePhotoInCloud(photoId, -1);
    } else {
      setLikedPhotos([...likedPhotos, photoId]);
      await likePhotoInCloud(photoId, 1);
    }
  };

  // Adicionar notícia na nuvem
  const handleAddArticle = async (article: Article) => {
    setArticles(prev => [article, ...prev]);
    await saveArticleToCloud(article);
    setActiveArticle(article);
    showToast('Notícia publicada para toda a escola!');
  };

  // Adicionar foto na nuvem
  const handleAddPhoto = async (photo: PhotoSubmission) => {
    setPhotos(prev => [photo, ...prev]);
    await savePhotoToCloud(photo);
    showToast('Foto colocada no mural!');
  };

  // Adicionar evento na nuvem
  const handleAddEvent = async (event: SchoolEvent) => {
    setEvents(prev => [event, ...prev]);
    await saveEventToCloud(event);
    showToast('Evento cadastrado no calendário!');
  };

  const handleToggleApprove = async (id: string) => {
    const target = articles.find(a => a.id === id);
    if (target) {
      await toggleArticleApprovalInCloud(id, !target.isApproved);
    }
  };

  const handleToggleLeadStory = async (id: string) => {
    const currentLead = articles.find(a => a.isLeadStory);
    await toggleArticleLeadStoryInCloud(id, currentLead?.id);
    showToast('Destaque da capa atualizado.');
  };

  // Filtragem simples de notícias (sem vida escolar, sem esporte, sem opiniao/cronicas)
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

  // Notícia de destaque na capa
  const leadArticle = useMemo(() => {
    if (visibleArticles.length === 0) return null;
    const explicitLead = visibleArticles.find(a => a.isLeadStory);
    return explicitLead || visibleArticles[0];
  }, [visibleArticles]);

  const secondaryArticles = useMemo(() => {
    if (!leadArticle) return visibleArticles;
    return visibleArticles.filter(a => a.id !== leadArticle.id);
  }, [visibleArticles, leadArticle]);

  // Categorias limpas e sem palavras difíceis
  const categories: string[] = [
    'Todas',
    'Notícias da Escola',
    'Projetos & Aulas',
    'Cultura & Artes',
    'Comunicados',
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col selection:bg-[#E5D7C3]">
      
      {/* Aviso de notificação */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-60 bg-stone-900 text-stone-100 px-4 py-2.5 text-xs shadow-xl border border-stone-700 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="ml-2 text-stone-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Cabeçalho */}
      <Masthead
        teacherAuth={teacherAuth}
        onOpenTeacherAuth={() => setIsTeacherAuthOpen(true)}
        onOpenTeacherPortal={() => setIsTeacherPortalOpen(true)}
        onOpenSubmitModal={(tab = 'article') => {
          setSubmitDefaultTab(tab);
          setIsSubmitModalOpen(true);
        }}
      />

      {/* Faixa quando professor estiver conectado */}
      {teacherAuth.isAuthenticated && (
        <aside aria-label="Modo professor ativo" className="no-print bg-stone-900 text-stone-100 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-xs">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>
                <strong>Modo Professor Ativo:</strong> Conectado como {teacherAuth.teacherName} ({teacherAuth.role})
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
                + Publicar como Professor
              </button>
              <span>·</span>
              <button
                onClick={() => setIsTeacherPortalOpen(true)}
                className="text-stone-300 hover:text-white cursor-pointer"
              >
                Painel dos Professores
              </button>
              <span>·</span>
              <button
                onClick={handleTeacherLogout}
                className="text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Área Principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8">
        
        {/* Barra de Filtros e Busca */}
        <section id="noticias" className="no-print mb-8 pb-4 border-b border-stone-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
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

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar notícias..."
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
              <span>Nova Notícia</span>
            </button>
          </div>
        </section>

        {/* Notícia em Destaque */}
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

        {/* Título da Seção */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 bg-stone-900"></span>
            <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-stone-900">
              {searchQuery
                ? `Resultados para "${searchQuery}" (${visibleArticles.length})`
                : selectedCategory === 'Todas'
                ? 'Notícias da Escola'
                : `${selectedCategory} (${visibleArticles.length})`}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium hidden sm:flex">
            <Wifi className="w-3 h-3 text-emerald-600" />
            <span>Conectado · Instituto Herdar</span>
          </div>
        </div>

        {/* Lista de Notícias */}
        {visibleArticles.length === 0 ? (
          <div className="bg-white border border-stone-300 p-8 sm:p-14 text-center my-6">
            <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="font-serif-title text-2xl font-semibold text-stone-800 mb-2">
              Ainda não tem notícias publicadas
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
              Qualquer aluno ou professor pode publicar matérias, fotos e avisos da nossa escola.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitDefaultTab('article');
                  setIsSubmitModalOpen(true);
                }}
                className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Escrever Primeira Notícia
              </button>

              {!teacherAuth.isAuthenticated && (
                <button
                  onClick={() => setIsTeacherAuthOpen(true)}
                  className="px-4 py-2.5 border border-stone-300 hover:border-stone-800 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-stone-500" />
                  <span>Área dos Professores</span>
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

        {/* 2. Calendário de Eventos */}
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

        {/* 3. Fotos da Escola */}
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

      </main>

      {/* Rodapé Simples e Bonito */}
      <footer className="border-t-2 border-stone-800 bg-[#FAF7F2] text-stone-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-300">
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold block">
                Comunidade Escolar
              </span>
              <h3 className="text-2xl font-serif-title font-bold text-stone-950">
                Jornal Herdar
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-reading text-sm max-w-sm">
                O jornal feito por alunos e professores do Instituto Herdar para divulgar notícias, fotos e avisos da nossa escola.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2">
              <span className="text-xs uppercase tracking-wider text-stone-800 font-bold block mb-3">
                Seções do Jornal
              </span>
              <ul className="space-y-1.5 text-xs text-stone-600">
                <li><a href="#capa" className="hover:text-stone-950 transition-colors">Capa</a></li>
                <li><a href="#noticias" className="hover:text-stone-950 transition-colors">Notícias</a></li>
                <li><a href="#eventos" className="hover:text-stone-950 transition-colors">Eventos</a></li>
                <li><a href="#fotos" className="hover:text-stone-950 transition-colors">Fotos</a></li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3">
              <span className="text-xs uppercase tracking-wider text-stone-800 font-bold block mb-3">
                Área dos Professores
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                Professores podem publicar comunicados oficiais e gerenciar o jornal entrando com sua conta Google ou se identificando com 1 clique.
              </p>

              <div className="pt-2">
                <button
                  onClick={teacherAuth.isAuthenticated ? () => setIsTeacherPortalOpen(true) : () => setIsTeacherAuthOpen(true)}
                  className="text-xs text-stone-600 hover:text-stone-950 border-b border-stone-400 hover:border-stone-900 pb-0.5 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-stone-600" />
                  <span>
                    {teacherAuth.isAuthenticated 
                      ? 'Painel dos Professores (Aberto)' 
                      : 'Acessar Área do Professor'}
                  </span>
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => window.print()}
                  className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Jornal</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
            <div>
              © Jornal Herdar · Instituto Herdar.
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Online</span>
              </span>
              <span>Instituto Herdar</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Modais */}
      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        onSuccess={handleTeacherLoginSuccess}
      />

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
