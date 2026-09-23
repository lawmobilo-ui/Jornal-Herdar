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
  Lock, 
  AlertCircle,
  Star
} from 'lucide-react';
import { Article, ArticleCategory, SchoolEvent, PhotoSubmission, TeacherAuth } from '../types/newspaper';
import { getTeacherSecretKey } from '../utils/storage';

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
  
  // Author Type: Student vs Teacher
  const [authorType, setAuthorType] = useState<'aluno' | 'professor'>(
    teacherAuth.isAuthenticated ? 'professor' : 'aluno'
  );
  const [enteredTeacherKey, setEnteredTeacherKey] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  // Sync authorType when modal opens or teacherAuth changes
  useEffect(() => {
    if (teacherAuth.isAuthenticated) {
      setAuthorType('professor');
    }
  }, [teacherAuth.isAuthenticated, isOpen]);

  // Article Form State
  const [artTitle, setArtTitle] = useState('');
  const [artSubtitle, setArtSubtitle] = useState('');
  const [artCategory, setArtCategory] = useState<ArticleCategory>(
    teacherAuth.isAuthenticated ? 'Comunicado Oficial' : 'Vida Escolar'
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
  const [artTags, setArtTags] = useState('Jornal Herdar, Instituto Herdar');
  const [artIsLead, setArtIsLead] = useState(false);

  // Photo Form State
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoAuthor, setPhotoAuthor] = useState(
    teacherAuth.isAuthenticated ? teacherAuth.teacherName : ''
  );
  const [photoGrade, setPhotoGrade] = useState(
    teacherAuth.isAuthenticated ? teacherAuth.role : ''
  );
  const [photoTag, setPhotoTag] = useState('Vida Escolar');

  // Event Form State
  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evTime, setEvTime] = useState('');
  const [evLocation, setEvLocation] = useState('');
  const [evCategory, setEvCategory] = useState<'Acadêmico' | 'Esportivo' | 'Cultural' | 'Vestibular & ENEM' | 'Comunidade'>('Acadêmico');
  const [evDescription, setEvDescription] = useState('');
  const [evOrganizer, setEvOrganizer] = useState(
    teacherAuth.isAuthenticated ? teacherAuth.teacherName : ''
  );
  const [evRole, setEvRole] = useState(
    teacherAuth.isAuthenticated ? 'Professores' : 'Alunos'
  );

  if (!isOpen) return null;

  // Handle local image file upload for Article
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

  // Handle local image file upload for Photo Gallery
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

  // Submit Article (handles both student and teacher!)
  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!artTitle.trim() || !artContent.trim()) {
      setErrorMessage('Por favor, preencha o título e o texto da matéria.');
      return;
    }

    const isPublishingAsTeacher = authorType === 'professor';

    // If publishing as teacher and not authenticated, check the key
    if (isPublishingAsTeacher && !teacherAuth.isAuthenticated) {
      const secretKey = getTeacherSecretKey();
      if (enteredTeacherKey.trim() !== secretKey) {
        setErrorMessage('Chave de professor incorreta. Digite a chave correta para publicar como docente.');
        return;
      }
      // Log teacher in
      onTeacherLogin?.({
        isAuthenticated: true,
        teacherName: artAuthorName.trim() || 'Docente Herdar',
        role: artAuthorGrade.trim() || 'Corpo Docente',
      });
    }

    const authorNameFinal = artAuthorName.trim() || (isPublishingAsTeacher ? 'Corpo Docente' : 'Estudante Herdar');
    const authorGradeFinal = artAuthorGrade.trim() || (isPublishingAsTeacher ? 'Coordenação Pedagógica' : 'Aluno(a) Herdar');

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      title: artTitle.trim(),
      subtitle: artSubtitle.trim() || (isPublishingAsTeacher ? 'Comunicado emitido pela equipe docente do Instituto Herdar.' : 'Publicação da comunidade estudantil.'),
      category: artCategory,
      authorName: authorNameFinal,
      authorGrade: authorGradeFinal,
      authorRole: isPublishingAsTeacher ? 'professor' : 'aluno',
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      timestamp: Date.now(),
      readTime: `${Math.max(2, Math.round(artContent.split(/\s+/).length / 150))} min`,
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

  // Submit Photo
  const handleSubmitPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!photoTitle.trim()) {
      setErrorMessage('Por favor, informe uma legenda ou título para a fotografia.');
      return;
    }

    if (!photoUrl) {
      setErrorMessage('Por favor, selecione uma foto para enviar.');
      return;
    }

    const newPhoto: PhotoSubmission = {
      id: `ph-${Date.now()}`,
      title: photoTitle.trim(),
      imageUrl: photoUrl,
      photographer: photoAuthor.trim() || (authorType === 'professor' ? 'Docente Herdar' : 'Estudante Herdar'),
      grade: photoGrade.trim() || (authorType === 'professor' ? 'Corpo Docente' : 'Aluno(a) Herdar'),
      eventTag: photoTag.trim() || 'Vida Escolar',
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }),
      likes: 1,
    };

    onAddPhoto(newPhoto);
    onClose();
  };

  // Submit Event
  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!evTitle.trim() || !evDate.trim() || !evLocation.trim()) {
      setErrorMessage('Preencha pelo menos o nome do evento, a data e o local.');
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
      organizer: evOrganizer.trim() || (isTeacher ? 'Corpo Docente Herdar' : 'Comissão de Alunos'),
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
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Redação & Publicação</span>
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

        {/* Tab Selection */}
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
              <span>Escrever Artigo / Notícia</span>
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
              <span>{previewMode ? 'Voltar à Edição' : 'Ver Prévia'}</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* Error message banner */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: ARTICLE SUBMISSION */}
          {activeTab === 'article' && (
            previewMode ? (
              <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 border border-stone-200">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-medium">
                  <span>{artCategory}</span>
                  {authorType === 'professor' && (
                    <span className="text-amber-800 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Publicação Docente Oficial
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif-title font-semibold text-stone-900 mt-2 mb-3">
                  {artTitle || 'Título da matéria aparecerá aqui'}
                </h1>
                <p className="text-sm text-stone-600 mb-4 italic">
                  {artSubtitle || 'Subtítulo da matéria com o resumo principal.'}
                </p>
                <div className="text-xs text-stone-500 pb-4 mb-4 border-b border-stone-200">
                  Por {artAuthorName || (authorType === 'professor' ? 'Docente' : 'Aluno')} ({artAuthorGrade || 'Instituto Herdar'}) · Hoje
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
                  {artContent || 'O corpo do texto completo será exibido aqui com parágrafos formatados.'}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitArticle} className="max-w-3xl mx-auto space-y-5 bg-white p-6 sm:p-8 border border-stone-200">
                
                {/* 1. EXPLICIT AUTHOR ROLE SELECTION (CRITICAL FIX FOR USER: "nn cria como professor") */}
                <div className="p-4 bg-stone-50 border border-stone-200">
                  <span className="block text-xs uppercase tracking-wider text-stone-700 font-bold mb-2">
                    Como você deseja publicar?
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthorType('aluno');
                        setArtCategory('Vida Escolar');
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
                        <span className="text-[11px] text-stone-500">Reportagens estudantis, crônicas, opiniões</span>
                      </div>
                      {authorType === 'aluno' && <Check className="w-4 h-4 text-stone-900" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthorType('professor');
                        setArtCategory('Comunicado Oficial');
                        if (teacherAuth.isAuthenticated) {
                          setArtAuthorName(teacherAuth.teacherName);
                          setArtAuthorGrade(teacherAuth.role);
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
                          <span>Professor(a) / Coordenação</span>
                        </span>
                        <span className="text-[11px] text-stone-500">Comunicados oficiais, projetos e avisos docentes</span>
                      </div>
                      {authorType === 'professor' && <Check className="w-4 h-4 text-stone-900" />}
                    </button>
                  </div>

                  {/* If publishing as professor and not yet authenticated in this session, ask for key right here! */}
                  {authorType === 'professor' && !teacherAuth.isAuthenticated && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-800" />
                        <span className="text-xs font-semibold text-amber-900">
                          Chave Secreta dos Professores
                        </span>
                      </div>
                      <input
                        type="password"
                        value={enteredTeacherKey}
                        onChange={(e) => setEnteredTeacherKey(e.target.value)}
                        placeholder="Digite a chave secreta docente (padrão: HERDAR2025)..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 focus:border-amber-800 focus:outline-hidden"
                      />
                      <span className="text-[11px] text-amber-800 mt-1 block">
                        Necessário para autenticar como professor e publicar comunicados oficiais.
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                      {authorType === 'professor' ? 'Nome do Docente ou Coordenação *' : 'Nome do Aluno(a) ou Equipe *'}
                    </label>
                    <input
                      type="text"
                      value={artAuthorName}
                      onChange={(e) => setArtAuthorName(e.target.value)}
                      placeholder={authorType === 'professor' ? "Ex: Prof. Ricardo / Coordenação" : "Ex: Sofia Vasconcelos"}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                      {authorType === 'professor' ? 'Área / Cargo Docente *' : 'Turma / Ano Letivo *'}
                    </label>
                    <input
                      type="text"
                      value={artAuthorGrade}
                      onChange={(e) => setArtAuthorGrade(e.target.value)}
                      placeholder={authorType === 'professor' ? "Ex: Coordenação Pedagógica" : "Ex: 3º Ano EM - Turma B"}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                      Seção do Jornal
                    </label>
                    <select
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value as ArticleCategory)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    >
                      {authorType === 'professor' ? (
                        <>
                          <option value="Comunicado Oficial">Comunicado Oficial da Escola</option>
                          <option value="Vida Escolar">Vida Escolar & Avisos</option>
                          <option value="Ciência & Tecnologia">Ciência & Projetos Docentes</option>
                          <option value="Cultura & Artes">Cultura & Eventos Pedagógicos</option>
                          <option value="Esportes & Grêmio">Esportes & Interclasses</option>
                          <option value="Opinião & Crônicas">Artigo de Opinião Pedagógico</option>
                        </>
                      ) : (
                        <>
                          <option value="Vida Escolar">Vida Escolar</option>
                          <option value="Ciência & Tecnologia">Ciência & Tecnologia</option>
                          <option value="Cultura & Artes">Cultura & Artes</option>
                          <option value="Esportes & Grêmio">Esportes & Grêmio</option>
                          <option value="Opinião & Crônicas">Opinião & Crônicas</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                      Palavras-chave (Tags)
                    </label>
                    <input
                      type="text"
                      value={artTags}
                      onChange={(e) => setArtTags(e.target.value)}
                      placeholder="Ex: Interclasses, Vestibular, Laboratório"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Título da Matéria *
                  </label>
                  <input
                    type="text"
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    placeholder="Digite o título principal..."
                    className="w-full px-3 py-2 text-base font-serif-title font-semibold bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Subtítulo / Resumo
                  </label>
                  <input
                    type="text"
                    value={artSubtitle}
                    onChange={(e) => setArtSubtitle(e.target.value)}
                    placeholder="Breve resumo da matéria que complementa o título..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Photo upload / link */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Fotografia de Capa (Opcional)
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
                      <span>{artCoverImage ? 'Trocar Foto' : 'Carregar Foto do Computador / Celular'}</span>
                    </button>
                    <span className="text-xs text-stone-500">ou insira link direto:</span>
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
                      placeholder="Legenda da foto (Ex: Alunos no auditório)"
                      className="w-full mt-2 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 focus:border-stone-800 focus:outline-hidden"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Citação em Destaque (Pull Quote - opcional)
                  </label>
                  <input
                    type="text"
                    value={artPullQuote}
                    onChange={(e) => setArtPullQuote(e.target.value)}
                    placeholder="Uma frase marcante..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden italic"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Texto Completo da Matéria *
                  </label>
                  <textarea
                    rows={8}
                    value={artContent}
                    onChange={(e) => setArtContent(e.target.value)}
                    placeholder="Escreva sua reportagem, crônica ou comunicado aqui..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden font-reading text-base leading-relaxed"
                    required
                  />
                </div>

                {/* Option to set as lead story */}
                <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200">
                  <input
                    type="checkbox"
                    id="setLead"
                    checked={artIsLead}
                    onChange={(e) => setArtIsLead(e.target.checked)}
                    className="w-4 h-4 text-stone-900 border-stone-300"
                  />
                  <label htmlFor="setLead" className="text-xs text-stone-700 font-medium cursor-pointer">
                    Destacar como Manchete Principal da Capa do Jornal Herdar
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                  <span className="text-xs text-stone-500">
                    {authorType === 'professor' ? 'Será publicado como Comunicado Docente.' : 'Será publicado na edição estudantil.'}
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Publicar Matéria no Jornal Herdar
                  </button>
                </div>
              </form>
            )
          )}

          {/* TAB 2: PHOTO SUBMISSION */}
          {activeTab === 'photo' && (
            <form onSubmit={handleSubmitPhoto} className="max-w-xl mx-auto space-y-4 bg-white p-6 sm:p-8 border border-stone-200">
              <div className="mb-4">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Galeria Visual</span>
                <h3 className="text-xl font-serif-title font-semibold text-stone-900 mt-1">
                  Enviar Registro Fotográfico
                </h3>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Legenda ou Título da Foto *
                </label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="Ex: Turma durante a aula de campo"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Nome do Fotógrafo(a) / Autor *
                  </label>
                  <input
                    type="text"
                    value={photoAuthor}
                    onChange={(e) => setPhotoAuthor(e.target.value)}
                    placeholder="Ex: Beatriz / Prof. Mello"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Turma ou Cargo
                  </label>
                  <input
                    type="text"
                    value={photoGrade}
                    onChange={(e) => setPhotoGrade(e.target.value)}
                    placeholder="Ex: 2º Ano EM ou Docente"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Marcador / Evento
                </label>
                <input
                  type="text"
                  value={photoTag}
                  onChange={(e) => setPhotoTag(e.target.value)}
                  placeholder="Ex: Cotidiano Escolar, Jogos, Feira"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Photo preview and upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Imagem *
                </label>
                
                {photoUrl && (
                  <div className="mb-3 aspect-video border border-stone-200 bg-stone-100 overflow-hidden relative">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
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
                    <span>Carregar Foto do Computador / Celular</span>
                  </button>
                  <span className="text-xs text-stone-500">ou use URL:</span>
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
                  Enviar para a Galeria
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: EVENT SUBMISSION */}
          {activeTab === 'event' && (
            <form onSubmit={handleSubmitEvent} className="max-w-xl mx-auto space-y-4 bg-white p-6 sm:p-8 border border-stone-200">
              <div className="mb-4">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Mural de Eventos</span>
                <h3 className="text-xl font-serif-title font-semibold text-stone-900 mt-1">
                  Cadastrar Evento Escolar
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
                  placeholder="Ex: Torneio de Xadrez / Simulado do Terceirão"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Data *
                  </label>
                  <input
                    type="text"
                    value={evDate}
                    onChange={(e) => setEvDate(e.target.value)}
                    placeholder="Ex: 15 de Outubro, 2026"
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
                    placeholder="Ex: 14:00 - 17:00"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Local dentro da Escola *
                  </label>
                  <input
                    type="text"
                    value={evLocation}
                    onChange={(e) => setEvLocation(e.target.value)}
                    placeholder="Ex: Ginásio / Auditório"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Categoria
                  </label>
                  <select
                    value={evCategory}
                    onChange={(e) => setEvCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Acadêmico">Acadêmico</option>
                    <option value="Esportivo">Esportivo</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Vestibular & ENEM">Vestibular & ENEM</option>
                    <option value="Comunidade">Comunidade</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Organizador *
                  </label>
                  <input
                    type="text"
                    value={evOrganizer}
                    onChange={(e) => setEvOrganizer(e.target.value)}
                    placeholder="Ex: Prof. de Educação Física / Grêmio"
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                    Papel
                  </label>
                  <select
                    value={evRole}
                    onChange={(e) => setEvRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Professores">Professores / Coordenação</option>
                    <option value="Alunos">Alunos</option>
                    <option value="Grêmio Estudantil">Grêmio Estudantil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                  Descrição do Evento
                </label>
                <textarea
                  rows={4}
                  value={evDescription}
                  onChange={(e) => setEvDescription(e.target.value)}
                  placeholder="Detalhes sobre o evento..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Cadastrar no Calendário
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
