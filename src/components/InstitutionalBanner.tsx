import React, { useState } from 'react';
import { ExternalLink, BookOpen, Sparkles, Trophy, HeartHandshake, MapPin, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';

export const InstitutionalBanner: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <section className="mb-12 border-2 border-stone-800 dark:border-stone-700 bg-white dark:bg-[#1A1916] shadow-sm transition-colors overflow-hidden">
      {/* Top Banner Stripe */}
      <div className="bg-stone-900 dark:bg-stone-950 text-stone-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className="uppercase tracking-widest text-[11px] text-amber-300 font-semibold">
            Instituição Mantenedora
          </span>
          <span className="text-stone-400 hidden sm:inline">·</span>
          <span className="hidden sm:inline text-stone-300">Instituto Herdar (Belo Horizonte - MG)</span>
        </div>

        <a
          href="https://herdar.org.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-white transition-colors cursor-pointer group"
          title="Abrir o site oficial do Instituto Herdar em nova aba"
        >
          <span>Abrir herdar.org.br</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-amber-800 dark:text-amber-400">
              Fundado em 2007 · Comunidade São Gabriel
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-950 dark:text-stone-100 tracking-tight mt-1 mb-3">
              Instituto Herdar
            </h2>
            <p className="text-stone-700 dark:text-stone-300 font-serif-title text-base sm:text-lg italic leading-relaxed">
              "Transformando realidades através do cuidado, da educação e de oportunidades reais para crianças, adolescentes, jovens e suas famílias."
            </p>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-normal max-w-2xl">
              Este jornal é um espaço comunitário aberto para que nossos educandos e educadores compartilhem vivências, projetos pedagógicos, crônicas e acontecimentos da nossa comunidade.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <a
              href="https://herdar.org.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 text-xs sm:text-sm font-semibold text-center bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-white transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Acessar Site Oficial</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="px-4 py-2.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white border border-stone-300 dark:border-stone-700 hover:border-stone-800 dark:hover:border-stone-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-stone-50 dark:bg-stone-900"
            >
              <span>{isDetailsOpen ? 'Ocultar Detalhes da Instituição' : 'Conhecer Pilares e Contato'}</span>
              {isDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable details with pillars & contact, inspired by herdar.org.br */}
        {isDetailsOpen && (
          <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-4 text-center sm:text-left">
              Nossos Pilares de Atuação
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-stone-50 dark:bg-[#22201D] border border-stone-200 dark:border-stone-800">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center mb-3">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-serif-title font-bold text-sm text-stone-900 dark:text-stone-100 mb-1">
                  Educação Integral
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Apoio pedagógico, incentivo à leitura, letramento e novas ferramentas para autonomia dos educandos.
                </p>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-[#22201D] border border-stone-200 dark:border-stone-800">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-400 flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-serif-title font-bold text-sm text-stone-900 dark:text-stone-100 mb-1">
                  Cultura & Artes
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Oficinas criativas de teatro, música e artes plásticas para expressar histórias e valores da comunidade.
                </p>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-[#22201D] border border-stone-200 dark:border-stone-800">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Trophy className="w-4 h-4" />
                </div>
                <h4 className="font-serif-title font-bold text-sm text-stone-900 dark:text-stone-100 mb-1">
                  Esporte & Cidadania
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Práticas corporais e convivência saudável ensinando respeito mútuo, trabalho coletivo e disciplina.
                </p>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-[#22201D] border border-stone-200 dark:border-stone-800">
                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 flex items-center justify-center mb-3">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h4 className="font-serif-title font-bold text-sm text-stone-900 dark:text-stone-100 mb-1">
                  Cuidado & Família
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Acolhimento humanizado, fortalecimento de vínculos familiares e participação em conselhos municipais.
                </p>
              </div>
            </div>

            {/* Quick Contact Line */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                  <span>Rua Pedra Negra, 33 - São Gabriel, Belo Horizonte - MG</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                  <span>(31) 3493-4369 / (31) 9 8688-7119</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                  <span>contato@herdar.org.br</span>
                </span>
              </div>

              <a
                href="https://herdar.org.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-900 dark:text-amber-400 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>Visitar herdar.org.br</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
