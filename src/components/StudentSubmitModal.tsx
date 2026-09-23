import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  PenTool, 
  Camera, 
  CalendarPlus, 
  Upload, 
  Check, 
  Eye, 
  FileText, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { Article, ArticleCategory, SchoolEvent, PhotoSubmission, TeacherAuth } from '../types/newspaper';

interface StudentSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'article' | 'photo' | 'event';
  teacherAuth: TeacherAuth;
  onAddArticle: (article: Article) => void;
  onAddPhoto: (photo: PhotoSubmission) => void;
  onAddEvent: (event: SchoolEvent) => void;
  onTeacherLogin?: (auth: TeacherAuth) => void;
}

export const StudentSubmitModal: React.FC<StudentSubmitModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'article',
  teacherAuth,
  onAddArticle,
  onAddPhoto,
  onAddEvent,
  onTeacherLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'article' | 'photo' | 'event'>(defaultTab);
  const [previewMode, setPreviewMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Tipo de quem publica: Aluno ou Professor
  const [authorType, setAuthorType] = useState<'aluno' | 'professor'>(
    teacherAuth.isAuthenticated ? 'professor' : 'aluno'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (teacherAuth.isAuthenticated) {
      setAuthorType('professor');
      if (teacherAuth.teacherName) {
        setArtAuthorName(teacherAuth.teacherName);
        setArtAuthorGrade(teacherAuth.role);
      }
    }
  }, [teacherAuth.isAuthenticated, teacherAuth.teacherName, teacherAuth.role, isOpen]);

  // Form de Notícia
  const [artTitle, setArtTitle] = useState('');
  const [artSubtitle, setArtSubtitle] = useState('');
  const [artCategory, setArtCategory] = useState<ArticleCategory>(
    teacherAuth.isAuthenticated ? 'Comunicados' : 'Notícias da Escola'
  );
  const [artAuthorName, setArtAuthorName] = useState(
    teacherAuth.isAuthenticated ? teacherAuth.teacherName : ''
  );
  const [artAuthorGrade, setArtAuthorGrade] = useState(
    teacherAuth.isAuthenticated ? teacherAuth.role : ''
  );
  const [artCoverImage, setArtCoverImage] = useState<string>('');
  const [artCaption, setArtCaption] = useState('');
  const [artPullQuote, setArtPullQuote] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artTags, setArtTags] = useState('Escola, Instituto Herdar');
  const [artIsLead, setArtIsLead] = useState(false);

  // Form de Foto
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoAuthor, setPhotoAuthor] = useState(
    teacherAuth.isAuthenticated ? teacherAuth.teacherName : ''
  );
  const [photoGrade, setPhotoGrade] = useState(
    teacherAuth.isAuthenticated ? teacherAuth.role : ''
  );
  const [photoTag, setPhotoTag] = useState('Dia a dia');

  // Form de Evento
  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evTime, setEvTime] = useState('');
  const [evLocation, setEvLocation] = useState('');
  const [evCategory, setEvCategory] = useState<'Aulas & Projetos' | 'Festas & Cultura' | 'Esportes' | 'Avisos & Reuniões'>('Aulas & Projetos');
  const [evDescription, setEvDescription] = useState('');
  const [evOrganizer, setEvOrganizer] = useState(
    teacherAuth.isAuthenticated ? teacherAuth.teacherName : ''
  );
  const [evRole, setEvRole] = useState(
    teacherAuth.isAuthenticated ? 'Professores' : 'Alunos'
  );

  if (!isOpen) return null;

  // Carregar foto do computador/celular para o artigo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setArtCoverImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Carregar foto para o mural de fotos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Enviar Artigo
  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!artTitle.trim() || !artContent.trim()) {
      setErrorMessage('Por favor, escreva o título e o texto da notícia.');
      return;
    }

    const isPublishingAsTeacher = authorType === 'professor';

    if (isPublishingAsTeacher && !teacherAuth.isAuthenticated) {
      onTeacherLogin?.({
        isAuthenticated: true,
        teacherName: artAuthorName.trim() || 'Professor(a) Herdar',
        role: artAuthorGrade.trim() || 'Professor(a)',
      });
    }

    const authorNameFinal = artAuthorName.trim() || (isPublishingAsTeacher ? 'Professor(a)' : 'Aluno(a)');
    const authorGradeFinal = artAuthorGrade.trim() || (isPublishingAsTeacher ? 'Professor(a)' : 'Aluno(a) Herdar');

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      title: artTitle.trim(),
      subtitle: artSubtitle.trim() || (isPublishingAsTeacher ? 'Aviso da equipe de professores do Instituto Herdar.' : 'Publicação feita para o Jornal Herdar.'),
      category: artCategory,
      authorName: authorNameFinal,
      authorGrade: authorGradeFinal,
      authorRole: isPublishingAsTeacher ? 'professor' : 'aluno',
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      timestamp: Date.now(),
      readTime: `${Math.max(1, Math.round(artContent.split(/\s+/).length / 140))} min`,
      coverImage: artCoverImage || '',
      imageCaption: artCaption.trim() || undefined,
      pullQuote: artPullQuote.trim() || undefined,
      content: artContent.trim(),
      tags: artTags.split(',').map(t => t.trim()).filter(Boolean),
      isLeadStory: artIsLead,
      isApproved: true,
      isPinned: isPublishingAsTeacher,
      likes: 1,
      views: 1,
    };

    onAddArticle(newArticle);
    onClose();
  };

  // Enviar Foto
  const handleSubmitPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!photoTitle.trim()) {
      setErrorMessage('Por favor, escreva uma legenda para a foto.');
      return;
    }

    if (!photoUrl) {
      setErrorMessage('Por favor, escolha uma foto do celular/computador ou coloque o link.');
      return;
    }

    const newPhoto: PhotoSubmission = {
      id: `ph-${Date.now()}`,
      title: photoTitle.trim(),
      imageUrl: photoUrl,
      photographer: photoAuthor.trim() || (authorType === 'professor' ? 'Professor(a)' : 'Aluno(a)'),
      grade: photoGrade.trim() || (authorType === 'professor' ? 'Professor(a)' : 'Aluno(a)'),
      eventTag: photoTag.trim() || 'Escola',
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }),
      likes: 1,
    };

    onAddPhoto(newPhoto);
    onClose();
  };

  // Enviar Evento
  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!evTitle.trim() || !evDate.trim() || !evLocation.trim()) {
      setErrorMessage('Preencha pelo menos o nome do evento, o dia e o local.');
      return;
    }

    const isTeacher = authorType === 'professor' || teacherAuth.isAuthenticated;

    const newEvent: SchoolEvent = {
      id: `ev-${Date.now()}`,
      title: evTitle.trim(),
      date: evDate.trim(),
      time: evTime.trim() || 'A combinar',
      location: evLocation.trim(),
      category: evCategory,
      description: evDescription.trim() || 'Evento cadastrado no Jornal Herdar.',
      organizer: evOrganizer.trim() || (isTeacher ? 'Professores' : 'Alunos'),
      organizerRole: evRole,
      isOfficial: isTeacher,
      attendingCount: 1,
    };

    onAddEvent(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] text-stone-900 border border-stone-300 w-full max-w-4xl h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Nova Publicação</span>
              <h2 className="text-xl sm:text-2xl font-serif-title font-semibold text-stone-900">
                Publicar no Jornal Herdar
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Abas */}
        <div className="px-6 border-b border-stone-200 bg-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => { setActiveTab('article'); setPreviewMode(false); }}
              className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'article'
                  ? 'border-stone-900 text-stone-900 font-semibold bg-white'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Escrever Notícia</span>
            </button>

            <button
              onClick={() => { setActiveTab('photo'); setPreviewMode(false); }}
              className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'photo'
                  ? 'border-stone-900 text-stone-900 font-semibold bg-white'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Enviar Foto</span>
            </button>

            <button
              onClick={() => { setActiveTab('event'); setPreviewMode(false); }}
              className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'event'
                  ? 'border-stone-900 text-stone-900 font-semibold bg-white'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Cadastrar Evento</span>
            </button>
          </div>

          {activeTab === 'article' && (
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="text-xs px-3 py-1.5 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{previewMode ? 'Voltar e Editar' : 'Ver como vai ficar'}</span>
            </button>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ABA 1: NOTÍCIA */}
          {activeTab === 'article' && (
            previewMode ? (
              <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 border border-stone-200">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-medium">
                  <span>{artCategory}</span>
                  {authorType === 'professor' && (
                    <span className="text-amber-800 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Publicado por Professor
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif-title font-semibold text-stone-900 mt-2 mb-3">
                  {artTitle || 'Título da notícia'}
                </h1>
                <p className="text-sm text-stone-600 mb-4 italic">
                  {artSubtitle || 'Resumo da notícia.'}
                </p>
                <div className="text-xs text-stone-500 pb-4 mb-4 border-b border-stone-200">
                  Por {artAuthorName || (authorType === 'professor' ? 'Professor' : 'Aluno')} ({artAuthorGrade || 'Instituto Herdar'}) · Hoje
                </div>
                {artCoverImage && (
                  <div className="mb-6">
                    <img
                      src={artCoverImage}
                      alt="Capa"
                      className="w-full max-h-72 object-cover border border-stone-200"
                    />
                    {artCaption && (
                      <p className="text-xs font-reading text-stone-500 italic mt-1.5">{artCaption}</p>
                    )}
                  </div>
                )}
                {artPullQuote && (
                  <blockquote className="my-6 p-4 border-l-2 border-stone-800 bg-stone-50 text-stone-800 font-serif-title text-lg italic">
                    "{artPullQuote}"
                  </blockquote>
                )}
                <div className="text-stone-800 font-reading text-base leading-relaxed whitespace-pre-line">
                  {artContent || 'O texto da notícia vai aparecer aqui.'}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitArticle} className="max-w-3xl mx-auto space-y-5 bg-white p-6 sm:p-8 border border-stone-200">
                
                {/* Quem está postando */}
                <div className="p-4 bg-stone-50 border border-stone-200">
                  <span className="block text-xs uppercase tracking-wider text-stone-700 font-bold mb-2">
                    Quem está publicando?
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthorType('aluno');
                        setArtCategory('Notícias da Escola');
                        if (!teacherAuth.isAuthenticated) {
                          setArtAuthorName('');
                          setArtAuthorGrade('');
                        }
                      }}
                      className={`p-3 border text-left transition-colors cursor-pointer flex items-center justify-between ${
                        authorType === 'aluno'
                          ? 'bg-white border-stone-900 ring-1 ring-stone-900 shadow-xs'
                          : 'bg-stone-100 border-stone-300 hover:bg-white text-stone-600'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-xs text-stone-900 block">Aluno(a)</span>
                        <span className="text-[11px] text-stone-500">Notícias, trabalhos e novidades dos alunos</span>
                      </div>
                      {authorType === 'aluno' && <Check className="w-4 h-4 text-stone-900" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthorType('professor');
                        setArtCategory('Comunicados');
                        if (teacherAuth.isAuthenticated) {
                          setArtAuthorName(teacherAuth.teacherName);
                          setArtAuthorGrade(teacherAuth.role);
                        } else if (!artAuthorName) {
                          setArtAuthorName('Prof. ');
                          setArtAuthorGrade('Professor(a)');
                        }
                      }}
                      className={`p-3 border text-left transition-colors cursor-pointer flex items-center justify-between ${
                        authorType === 'professor'
                          ? 'bg-white border-stone-900 ring-1 ring-stone-900 shadow-xs'
                          : 'bg-stone-100 border-stone-300 hover:bg-white text-stone-600'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-xs text-amber-900 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Professor(a) / Escola</span>
                        </span>
                        <span className="text-[11px] text-stone-500">Avisos e comunicados da escola</span>
                      </div>
                      {authorType === 'professor' && <Check className="w-4 h-4 text-stone-900" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                      {authorType === 'professor' ? 'Seu Nome de Professor(a) *' : 'Seu Nome de Aluno(a) *'}
                    </label>
                    <input
                      type="text"
                      value={artAuthorName}
                      onChange={(e) => setArtAuthorName(e.target.value)}
                      placeholder={authorType === 'professor' ? "Ex: Prof. Thiago" : "Ex: Mariana Silva"}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                      {authorType === 'professor' ? 'Sua Matéria ou Cargo *' : 'Sua Turma *'}
                    </label>
                    <input
                      type="text"
                      value={artAuthorGrade}
                      onChange={(e) => setArtAuthorGrade(e.target.value)}
                      placeholder={authorType === 'professor' ? "Ex: História / Coordenação" : "Ex: 2º Ano A"}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                      Assunto da Notícia
                    </label>
                    <select
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value as ArticleCategory)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    >
                      <option value="Notícias da Escola">Notícias da Escola</option>
                      <option value="Projetos & Aulas">Projetos & Aulas</option>
                      <option value="Cultura & Artes">Cultura & Artes</option>
                      <option value="Comunicados">Comunicados da Escola</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                      Palavras-chave
                    </label>
                    <input
                      type="text"
                      value={artTags}
                      onChange={(e) => setArtTags(e.target.value)}
                      placeholder="Ex: Laboratório, Feira, Prova"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Título da Notícia *
                  </label>
                  <input
                    type="text"
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    placeholder="Escreva um título chamativo..."
                    className="w-full px-3 py-2 text-base font-serif-title font-semibold bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Resumo Rápido
                  </label>
                  <input
                    type="text"
                    value={artSubtitle}
                    onChange={(e) => setArtSubtitle(e.target.value)}
                    placeholder="Uma frase explicando sobre o que é a notícia..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Foto da Notícia */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Foto de Capa (Opcional)
                  </label>
                  
                  {artCoverImage && (
                    <div className="mb-2 relative aspect-video max-h-48 border border-stone-300 bg-stone-100 overflow-hidden">
                      <img src={artCoverImage} alt="Capa" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setArtCoverImage('')}
                        className="absolute top-2 right-2 bg-stone-900/80 text-white p-1 text-xs"
                      >
                        Remover foto
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 border border-stone-300 bg-stone-100 hover:bg-stone-200 text-xs text-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{artCoverImage ? 'Trocar Foto' : 'Escolher Foto do Celular ou Computador'}</span>
                    </button>
                    <span className="text-xs text-stone-500">ou coloque link direto:</span>
                  </div>

                  <input
                    type="url"
                    value={artCoverImage.startsWith('data:') ? '' : artCoverImage}
                    onChange={(e) => setArtCoverImage(e.target.value)}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="w-full mt-2 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 focus:border-stone-800 focus:outline-hidden"
                  />

                  {artCoverImage && (
                    <input
                      type="text"
                      value={artCaption}
                      onChange={(e) => setArtCaption(e.target.value)}
                      placeholder="Legenda da foto (Ex: Alunos no laboratório)"
                      className="w-full mt-2 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 focus:border-stone-800 focus:outline-hidden"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Frase Marcante em Destaque (Opcional)
                  </label>
                  <input
                    type="text"
                    value={artPullQuote}
                    onChange={(e) => setArtPullQuote(e.target.value)}
                    placeholder="Uma frase dita por alguém ou destaque..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden italic"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Texto Completo da Notícia *
                  </label>
                  <textarea
                    rows={8}
                    value={artContent}
                    onChange={(e) => setArtContent(e.target.value)}
                    placeholder="Escreva tudo o que aconteceu aqui..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden font-reading text-base leading-relaxed"
                    required
                  />
                </div>

                {/* Destacar na capa */}
                <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200">
                  <input
                    type="checkbox"
                    id="setLead"
                    checked={artIsLead}
                    onChange={(e) => setArtIsLead(e.target.checked)}
                    className="w-4 h-4 text-stone-900 border-stone-300"
                  />
                  <label htmlFor="setLead" className="text-xs text-stone-700 font-medium cursor-pointer">
                    Colocar em destaque principal na capa do jornal
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                  <span className="text-xs text-stone-500">
                    Aparece na hora para todos os computadores e celulares.
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Publicar Notícia
                  </button>
                </div>
              </form>
            )
          )}

          {/* ABA 2: FOTOS */}
          {activeTab === 'photo' && (
            <form onSubmit={handleSubmitPhoto} className="max-w-xl mx-auto space-y-4 bg-white p-6 sm:p-8 border border-stone-200">
              <div className="mb-4">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Mural de Fotos</span>
                <h3 className="text-xl font-serif-title font-semibold text-stone-900 mt-1">
                  Enviar Foto para o Jornal
                </h3>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Legenda da Foto *
                </label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="Ex: Alunos durante o projeto de ciências"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Quem tirou a foto? *
                  </label>
                  <input
                    type="text"
                    value={photoAuthor}
                    onChange={(e) => setPhotoAuthor(e.target.value)}
                    placeholder="Ex: Beatriz / Prof. Thiago"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Turma ou Matéria
                  </label>
                  <input
                    type="text"
                    value={photoGrade}
                    onChange={(e) => setPhotoGrade(e.target.value)}
                    placeholder="Ex: 2º Ano ou Professor"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Momento
                </label>
                <input
                  type="text"
                  value={photoTag}
                  onChange={(e) => setPhotoTag(e.target.value)}
                  placeholder="Ex: Dia a dia, Aula, Apresentação"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Foto *
                </label>
                
                {photoUrl && (
                  <div className="mb-3 aspect-video border border-stone-200 bg-stone-100 overflow-hidden relative">
                    <img src={photoUrl} alt="Prévia" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={photoFileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoFileInputRef.current?.click()}
                    className="px-3 py-1.5 border border-stone-300 bg-stone-100 hover:bg-stone-200 text-xs text-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Escolher Foto do Celular ou Computador</span>
                  </button>
                  <span className="text-xs text-stone-500">ou use link:</span>
                </div>
                
                <input
                  type="url"
                  value={photoUrl.startsWith('data:') ? '' : photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full mt-2 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 focus:border-stone-800 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Colocar Foto no Mural
                </button>
              </div>
            </form>
          )}

          {/* ABA 3: EVENTO */}
          {activeTab === 'event' && (
            <form onSubmit={handleSubmitEvent} className="max-w-xl mx-auto space-y-4 bg-white p-6 sm:p-8 border border-stone-200">
              <div className="mb-4">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Calendário</span>
                <h3 className="text-xl font-serif-title font-semibold text-stone-900 mt-1">
                  Cadastrar Evento da Escola
                </h3>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Nome do Evento *
                </label>
                <input
                  type="text"
                  value={evTitle}
                  onChange={(e) => setEvTitle(e.target.value)}
                  placeholder="Ex: Simulado Geral / Feira de Ciências"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Dia / Data *
                  </label>
                  <input
                    type="text"
                    value={evDate}
                    onChange={(e) => setEvDate(e.target.value)}
                    placeholder="Ex: 15 de Outubro"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Horário
                  </label>
                  <input
                    type="text"
                    value={evTime}
                    onChange={(e) => setEvTime(e.target.value)}
                    placeholder="Ex: 14h às 16h"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Local na Escola *
                  </label>
                  <input
                    type="text"
                    value={evLocation}
                    onChange={(e) => setEvLocation(e.target.value)}
                    placeholder="Ex: Pátio / Quadra / Auditório"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Tipo de Evento
                  </label>
                  <select
                    value={evCategory}
                    onChange={(e) => setEvCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Aulas & Projetos">Aulas & Projetos</option>
                    <option value="Festas & Cultura">Festas & Cultura</option>
                    <option value="Esportes">Esportes</option>
                    <option value="Avisos & Reuniões">Avisos & Reuniões</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Quem está organizando? *
                  </label>
                  <input
                    type="text"
                    value={evOrganizer}
                    onChange={(e) => setEvOrganizer(e.target.value)}
                    placeholder="Ex: Turma do 3º Ano / Professores"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Grupo
                  </label>
                  <select
                    value={evRole}
                    onChange={(e) => setEvRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Alunos">Alunos</option>
                    <option value="Professores">Professores</option>
                    <option value="Escola">Direção da Escola</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Detalhes do Evento
                </label>
                <textarea
                  rows={4}
                  value={evDescription}
                  onChange={(e) => setEvDescription(e.target.value)}
                  placeholder="Explique o que vai acontecer..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Colocar no Calendário
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
