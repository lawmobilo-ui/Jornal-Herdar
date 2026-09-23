import React, { useEffect } from 'react';
import { KeyRound, ShieldCheck, PenSquare, Sparkles, PlusCircle } from 'lucide-react';
import { TeacherAuth } from '../types/newspaper';

interface MastheadProps {
  teacherAuth: TeacherAuth;
  onOpenTeacherAuth: () => void;
  onOpenTeacherPortal: () => void;
  onOpenSubmitModal: (defaultTab?: 'article' | 'photo' | 'event') => void;
}

export const Masthead: React.FC<MastheadProps> = ({
  teacherAuth,
  onOpenTeacherAuth,
  onOpenTeacherPortal,
  onOpenSubmitModal,
}) => {
  // Keyboard shortcut listener for hidden teacher key entry: Ctrl+Shift+P or Alt+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') || (e.altKey && e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        if (teacherAuth.isAuthenticated) {
          onOpenTeacherPortal();
        } else {
          onOpenTeacherAuth();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [teacherAuth.isAuthenticated, onOpenTeacherAuth, onOpenTeacherPortal]);

  const todayDateFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const capitalizedDate = todayDateFormatted.charAt(0).toUpperCase() + todayDateFormatted.slice(1);

  return (
    <header className="border-b-2 border-stone-800 bg-[#FAF7F2] text-stone-900">
      {/* 1. TOP BAR CONTRACT: Zone 1 (Wordmark) - Zone 2 (4-6 links) - Zone 3 (1-2 actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-stone-200">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="text-xl font-bold tracking-tight text-stone-900 font-serif-title hover:opacity-80 transition-opacity">
          Jornal Herdar
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider font-medium text-stone-600">
          <a href="#capa" className="hover:text-stone-950 transition-colors">Capa</a>
          <a href="#reportagens" className="hover:text-stone-950 transition-colors">Reportagens</a>
          <a href="#eventos" className="hover:text-stone-950 transition-colors">Eventos</a>
          <a href="#galeria" className="hover:text-stone-950 transition-colors">Galeria</a>
          <a href="#voz-discente" className="hover:text-stone-950 transition-colors">Voz Discente</a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Teacher Mode Button or Discreet Key */}
          {teacherAuth.isAuthenticated ? (
            <button
              onClick={onOpenTeacherPortal}
              className="px-3 py-1.5 text-xs font-semibold bg-stone-900 text-amber-300 hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Abrir Painel da Sala dos Professores"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Painel Docente</span>
            </button>
          ) : (
            <button
              onClick={onOpenTeacherAuth}
              className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer group"
              title="Acesso reservado para professores (Chave Secreta ou Alt+P)"
              aria-label="Acesso Docente Restrito"
            >
              <KeyRound className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          <button
            onClick={() => onOpenSubmitModal('article')}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Publicar</span>
          </button>
        </div>
      </div>

      {/* 2. CLASSIC EDITORIAL BROADSHEET MASTHEAD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 text-center">
        {/* Upper metadata row */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] uppercase tracking-widest text-stone-500 pb-3 border-b border-stone-300 gap-2 font-medium">
          <div>{capitalizedDate}</div>
          <div className="hidden md:block">Instituto Herdar · Edição Aberta</div>
          <div className="flex items-center gap-3">
            <span>Comunidade Escolar</span>
            <span className="text-stone-300">·</span>
            <button 
              onClick={teacherAuth.isAuthenticated ? onOpenTeacherPortal : onOpenTeacherAuth}
              className="text-stone-400 hover:text-stone-700 text-[10px] tracking-normal transition-colors cursor-pointer"
              title="Área reservada para professores"
            >
              {teacherAuth.isAuthenticated ? 'Docente Conectado' : 'Acesso Docente'}
            </button>
          </div>
        </div>

        {/* Institution Crest and Giant Masthead Title */}
        <div className="py-6 sm:py-8 border-b-2 border-stone-800">
          <div className="inline-flex items-center gap-2 mb-2 text-xs font-serif-title tracking-widest uppercase text-stone-600">
            <span className="h-px w-8 bg-stone-400"></span>
            <span>Instituto Herdar</span>
            <span className="h-px w-8 bg-stone-400"></span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif-title font-black tracking-tight text-stone-950 uppercase leading-none">
            Jornal Herdar
          </h1>

          <p className="mt-3 text-xs sm:text-sm font-serif-title italic text-stone-700 max-w-xl mx-auto">
            O Jornal da Comunidade Escolar: Artigos, Fotos e Eventos do Instituto Herdar
          </p>
        </div>

        {/* Sub-masthead topic ribbon */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 pt-3 text-xs uppercase tracking-wider text-stone-600 overflow-x-auto whitespace-nowrap">
          <a href="#reportagens" className="hover:text-stone-900 transition-colors">Reportagens & Matérias</a>
          <span>/</span>
          <a href="#eventos" className="hover:text-stone-900 transition-colors">Eventos & Agenda</a>
          <span>/</span>
          <a href="#galeria" className="hover:text-stone-900 transition-colors">Mural de Fotos</a>
          <span>/</span>
          <a href="#voz-discente" className="hover:text-stone-900 transition-colors">Voz Discente</a>
        </div>
      </div>
    </header>
  );
};
