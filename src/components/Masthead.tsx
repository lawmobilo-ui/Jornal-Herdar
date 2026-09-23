import React, { useEffect } from 'react';
import { ShieldCheck, PenSquare, UserCheck } from 'lucide-react';
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
      {/* 1. Barra de cima */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-stone-200">
        <a href="#" className="text-xl font-bold tracking-tight text-stone-900 font-serif-title hover:opacity-80 transition-opacity">
          Jornal Herdar
        </a>

        {/* Links simples de navegação */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider font-medium text-stone-600">
          <a href="#capa" className="hover:text-stone-950 transition-colors">Capa</a>
          <a href="#noticias" className="hover:text-stone-950 transition-colors">Notícias</a>
          <a href="#eventos" className="hover:text-stone-950 transition-colors">Eventos</a>
          <a href="#fotos" className="hover:text-stone-950 transition-colors">Fotos</a>
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-2 sm:gap-3">
          {teacherAuth.isAuthenticated ? (
            <button
              onClick={onOpenTeacherPortal}
              className="px-3 py-1.5 text-xs font-semibold bg-stone-900 text-amber-300 hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Abrir painel dos professores"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Painel do Professor</span>
            </button>
          ) : (
            <button
              onClick={onOpenTeacherAuth}
              className="px-2.5 py-1.5 text-xs text-stone-700 hover:text-stone-950 border border-stone-300 hover:border-stone-800 transition-colors cursor-pointer flex items-center gap-1.5 bg-white"
              title="Acesso dos professores"
            >
              <UserCheck className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">Área do Professor</span>
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

      {/* 2. Cabeçalho Principal do Jornal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] uppercase tracking-widest text-stone-500 pb-3 border-b border-stone-300 gap-2 font-medium">
          <div>{capitalizedDate}</div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online e Atualizado</span>
          </div>
          <div>Instituto Herdar</div>
        </div>

        {/* Título do Jornal */}
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
            O jornal dos alunos e professores do Instituto Herdar
          </p>
        </div>

        {/* Seções simples */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 pt-3 text-xs uppercase tracking-wider text-stone-600 overflow-x-auto whitespace-nowrap">
          <a href="#noticias" className="hover:text-stone-900 transition-colors">Notícias da Escola</a>
          <span>/</span>
          <a href="#eventos" className="hover:text-stone-900 transition-colors">Eventos & Calendário</a>
          <span>/</span>
          <a href="#fotos" className="hover:text-stone-900 transition-colors">Mural de Fotos</a>
        </div>
      </div>
    </header>
  );
};
