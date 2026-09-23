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

  const categories = ['Todos', 'Acadêmico', 'Esportivo', 'Cultural', 'Vestibular & ENEM', 'Comunidade'];

  const filteredEvents = filterCategory === 'Todos'
    ? events
    : events.filter(e => e.category === filterCategory);

  return (
    <section id="eventos" className="my-14 pt-10 border-t-2 border-stone-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-semibold mb-1">
            <Calendar className="w-3.5 h-3.5 text-stone-700" />
            <span>Mural Oficial de Atividades</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900">
            Agenda & Eventos do Instituto Herdar
          </h2>
        </div>

        <button
          onClick={onOpenNewEvent}
          className="px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Divulgar Atividade</span>
        </button>
      </div>

      {/* Interactive Filter Tabs */}
      {events.length > 0 && (
        <div className="flex items-center gap-1 p-1 bg-stone-200/70 border border-stone-300 mb-8 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === cat
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Events Grid or Clean Empty State */}
      {events.length === 0 ? (
        <div className="bg-white border border-stone-200 p-8 sm:p-12 text-center">
          <Calendar className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="font-serif-title text-xl font-semibold text-stone-800 mb-2">
            Nenhum evento agendado no momento
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
            Alunos e professores podem divulgar palestras, campeonatos esportivos, saraus, simulados e reuniões escolares.
          </p>
          <button
            onClick={onOpenNewEvent}
            className="px-5 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Cadastrar Novo Evento
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
                className="bg-white border border-stone-200 p-6 flex flex-col justify-between hover:border-stone-400 transition-colors shadow-xs relative"
              >
                <div>
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-3 pb-2 border-b border-stone-100">
                    <span className="font-semibold text-stone-800">{ev.category}</span>
                    <div className="flex items-center gap-2">
                      {ev.isOfficial && (
                        <span className="text-[11px] text-amber-900 bg-amber-50 px-1.5 py-0.5 border border-amber-200 font-medium">
                          Oficial da Escola
                        </span>
                      )}
                      {onDeleteEvent && (
                        <button
                          onClick={() => onDeleteEvent(ev.id)}
                          className="text-stone-400 hover:text-red-700 p-1"
                          title="Excluir evento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-serif-title font-semibold text-lg text-stone-900 mb-3 leading-snug">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed mb-6 font-reading text-sm">
                    {ev.description}
                  </p>

                  <div className="space-y-2 text-xs text-stone-600 mb-6 bg-stone-50 p-3 border border-stone-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-medium text-stone-900">{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>Organizado por: <strong>{ev.organizer}</strong> ({ev.organizerRole})</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    <strong className="text-stone-900 tabular-nums">{totalAttending}</strong> confirmações
                  </span>

                  <button
                    onClick={() => onToggleJoin(ev.id)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 border cursor-pointer ${
                      isJoined
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Presença Confirmada</span>
                      </>
                    ) : (
                      <span>Vou Participar</span>
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
