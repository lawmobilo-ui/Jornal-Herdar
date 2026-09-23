import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Check, Users, Trash2 } from 'lucide-react';
import { SchoolEvent, TeacherAuth } from '../types/newspaper';

interface EventsSectionProps {
  events: SchoolEvent[];
  joinedEvents: string[];
  onToggleJoin: (eventId: string) => void;
  onOpenNewEvent: () => void;
  onDeleteEvent?: (eventId: string) => void;
  teacherAuth?: TeacherAuth;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  joinedEvents,
  onToggleJoin,
  onOpenNewEvent,
  onDeleteEvent,
  teacherAuth,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('Todos');

  const isEducator = teacherAuth?.isAuthenticated;
  const categories = ['Todos', 'Aulas & Projetos', 'Festas & Cultura', 'Esportes', 'Avisos & Reuniões'];

  const filteredEvents = filterCategory === 'Todos'
    ? events
    : events.filter(e => e.category === filterCategory);

  return (
    <section id="eventos" className="my-14 pt-10 border-t-2 border-stone-300 dark:border-stone-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold mb-1">
            <Calendar className="w-3.5 h-3.5 text-stone-700 dark:text-amber-400" />
            <span>Calendário da Escola</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900 dark:text-stone-100">
            Eventos e Datas Importantes
          </h2>
        </div>

        <button
          onClick={onOpenNewEvent}
          className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-950 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Cadastrar Evento</span>
        </button>
      </div>

      {/* Filtro simples */}
      {events.length > 0 && (
        <div className="flex items-center gap-1 p-1 bg-stone-200/70 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 mb-8 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === cat
                  ? 'bg-white dark:bg-[#1A1916] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {events.length === 0 ? (
        <div className="bg-white dark:bg-[#1A1916] border border-stone-200 dark:border-stone-800 p-8 sm:p-12 text-center transition-colors">
          <Calendar className="w-10 h-10 text-stone-400 dark:text-stone-600 mx-auto mb-3" />
          <h3 className="font-serif-title text-xl font-semibold text-stone-800 dark:text-stone-200 mb-2">
            Ainda não há eventos cadastrados
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-6">
            Educandos e educadores podem cadastrar datas de apresentações, aulas especiais, eventos e reuniões da escola.
          </p>
          <button
            onClick={onOpenNewEvent}
            className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-950 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Cadastrar Primeiro Evento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => {
            const isJoined = joinedEvents.includes(ev.id);
            const totalAttending = ev.attendingCount + (isJoined ? 1 : 0);

            return (
              <div 
                key={ev.id}
                className="bg-white dark:bg-[#1A1916] border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-between hover:border-stone-400 dark:hover:border-stone-600 transition-colors shadow-xs relative"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-3 pb-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="font-semibold text-stone-800 dark:text-amber-400">{ev.category}</span>
                    <div className="flex items-center gap-2">
                      {ev.isOfficial && (
                        <span className="text-[11px] text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 border border-amber-200 dark:border-amber-800/80 font-medium">
                          Aviso da Escola
                        </span>
                      )}
                      {/* Botão de excluir visível SOMENTE para educadores autenticados */}
                      {isEducator && onDeleteEvent && (
                        <button
                          onClick={() => onDeleteEvent(ev.id)}
                          className="text-stone-400 hover:text-red-700 dark:hover:text-red-400 p-1 cursor-pointer"
                          title="Excluir evento (Modo Educador)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-serif-title font-semibold text-lg text-stone-900 dark:text-stone-100 mb-3 leading-snug">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-6 font-reading text-sm">
                    {ev.description}
                  </p>

                  <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300 mb-6 bg-stone-50 dark:bg-[#22201D] p-3 border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                      <span className="font-medium text-stone-900 dark:text-stone-100">{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                      <span>Por: <strong className="text-stone-800 dark:text-stone-200">{ev.organizer}</strong> ({ev.organizerRole})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    <strong className="text-stone-900 dark:text-stone-100 tabular-nums">{totalAttending}</strong> pessoas vão
                  </span>

                  <button
                    onClick={() => onToggleJoin(ev.id)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 border cursor-pointer ${
                      isJoined
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Vou Participar</span>
                      </>
                    ) : (
                      <span>Confirmar Presença</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
