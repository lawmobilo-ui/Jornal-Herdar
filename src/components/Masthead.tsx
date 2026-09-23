import React, { useEffect } from 'react';
import { ShieldCheck, PenSquare, UserCheck, Sun, Moon, ExternalLink, Globe } from 'lucide-react';
import { TeacherAuth } from '../types/newspaper';
import { useTheme } from '../context/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();

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
    <header className="border-b-2 border-stone-800 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#141311] text-stone-900 dark:text-[#F5EFEB] transition-colors">
      {/* 1. Barra de cima (Top Bar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-4">
          <a href="#" className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-serif-title hover:opacity-80 transition-opacity">
            Jornal Herdar
          </a>

          {/* Botão de abrir o site oficial do herdar */}
          <a
            href="https://herdar.org.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-amber-400 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 transition-colors group"
            title="Abrir o site oficial https://herdar.org.br/ em nova aba"
          >
            <Globe className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
            <span>Site herdar.org.br</span>
            <ExternalLink className="w-3 h-3 text-stone-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Links simples de navegação */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-stone-600 dark:text-stone-400">
          <a href="#capa" className="hover:text-stone-950 dark:hover:text-white transition-colors">Capa</a>
          <a href="#noticias" className="hover:text-stone-950 dark:hover:text-white transition-colors">Notícias</a>
          <a href="#eventos" className="hover:text-stone-950 dark:hover:text-white transition-colors">Eventos</a>
          <a href="#fotos" className="hover:text-stone-950 dark:hover:text-white transition-colors">Fotos</a>
          <a href="#sobre-instituto" className="text-amber-800 dark:text-amber-400 font-semibold hover:underline">O Instituto</a>
        </nav>

        {/* Ações: Alternador de tema, educador e publicar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Alternador de tema Claro / Escuro */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 hover:border-stone-600 transition-colors cursor-pointer flex items-center gap-1.5"
            title={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-xs font-medium">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-stone-700" />
                <span className="hidden sm:inline text-xs font-medium">Escuro</span>
              </>
            )}
          </button>

          {/* Link móvel para herdar.org.br */}
          <a
            href="https://herdar.org.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden p-1.5 text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 flex items-center justify-center"
            title="Abrir herdar.org.br"
          >
            <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </a>

          {teacherAuth.isAuthenticated ? (
            <button
              onClick={onOpenTeacherPortal}
              className="px-3 py-1.5 text-xs font-semibold bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Abrir painel dos educadores"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Painel do Educador</span>
            </button>
          ) : (
            <button
              onClick={onOpenTeacherAuth}
              className="px-2.5 py-1.5 text-xs text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white border border-stone-300 dark:border-stone-700 hover:border-stone-800 dark:hover:border-stone-400 transition-colors cursor-pointer flex items-center gap-1.5 bg-white dark:bg-stone-900"
              title="Acesso dos educadores com senha"
            >
              <UserCheck className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              <span className="hidden sm:inline">Área do Educador</span>
            </button>
          )}

          <button
            onClick={() => onOpenSubmitModal('article')}
            className="px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Publicar</span>
          </button>
        </div>
      </div>

      {/* 2. Cabeçalho Principal do Jornal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 text-center">
        {/* Linha de data e localização institucional (substituindo 'online e atualizado') */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] uppercase tracking-widest text-stone-500 dark:text-stone-400 pb-3 border-b border-stone-300 dark:border-stone-800 gap-2 font-medium">
          <div>{capitalizedDate}</div>
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
            <span>Belo Horizonte - MG</span>
            <span aria-hidden="true">·</span>
            <span>Comunidade São Gabriel</span>
          </div>
          <div>
            <a
              href="https://herdar.org.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-amber-800 dark:text-amber-400 font-semibold"
            >
              herdar.org.br
            </a>
          </div>
        </div>

        {/* Título do Jornal */}
        <div className="py-6 sm:py-8 border-b-2 border-stone-800 dark:border-stone-700">
          <div className="inline-flex items-center gap-2 mb-2 text-xs font-serif-title tracking-widest uppercase text-stone-600 dark:text-stone-400">
            <span className="h-px w-8 bg-stone-400 dark:bg-stone-600"></span>
            <span>Instituto Herdar</span>
            <span className="h-px w-8 bg-stone-400 dark:bg-stone-600"></span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif-title font-black tracking-tight text-stone-950 dark:text-stone-100 uppercase leading-none">
            Jornal Herdar
          </h1>

          <p className="mt-3 text-xs sm:text-sm font-serif-title italic text-stone-700 dark:text-stone-300 max-w-xl mx-auto">
            O jornal dos educandos e educadores do Instituto Herdar
          </p>
        </div>

        {/* Seções simples */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 pt-3 text-xs uppercase tracking-wider text-stone-600 dark:text-stone-400 overflow-x-auto whitespace-nowrap">
          <a href="#noticias" className="hover:text-stone-900 dark:hover:text-white transition-colors">Notícias da Escola</a>
          <span>/</span>
          <a href="#eventos" className="hover:text-stone-900 dark:hover:text-white transition-colors">Eventos & Calendário</a>
          <span>/</span>
          <a href="#fotos" className="hover:text-stone-900 dark:hover:text-white transition-colors">Mural de Fotos</a>
          <span>/</span>
          <a
            href="https://herdar.org.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-900 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1 font-semibold text-amber-800 dark:text-amber-400"
          >
            <span>Site herdar.org.br</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
