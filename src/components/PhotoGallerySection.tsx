import React, { useState } from 'react';
import { Camera, Heart, Plus, Maximize2, X, Trash2 } from 'lucide-react';
import { PhotoSubmission, TeacherAuth } from '../types/newspaper';

interface PhotoGallerySectionProps {
  photos: PhotoSubmission[];
  likedPhotos: string[];
  onTogglePhotoLike: (photoId: string) => void;
  onOpenNewPhoto: () => void;
  onDeletePhoto?: (photoId: string) => void;
  teacherAuth?: TeacherAuth;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  photos,
  likedPhotos,
  onTogglePhotoLike,
  onOpenNewPhoto,
  onDeletePhoto,
  teacherAuth,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoSubmission | null>(null);
  const isEducator = teacherAuth?.isAuthenticated;

  return (
    <section id="fotos" className="my-14 pt-10 border-t-2 border-stone-300 dark:border-stone-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold mb-1">
            <Camera className="w-3.5 h-3.5 text-stone-700 dark:text-amber-400" />
            <span>Mural de Fotos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900 dark:text-stone-100">
            Fotos da Escola
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Fotos tiradas por educandos e educadores no dia a dia do Instituto Herdar.
          </p>
        </div>

        <button
          onClick={onOpenNewPhoto}
          className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-950 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enviar Foto</span>
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="bg-white dark:bg-[#1A1916] border border-stone-200 dark:border-stone-800 p-8 sm:p-12 text-center transition-colors">
          <Camera className="w-10 h-10 text-stone-400 dark:text-stone-600 mx-auto mb-3" />
          <h3 className="font-serif-title text-xl font-semibold text-stone-800 dark:text-stone-200 mb-2">
            Ainda não há fotos no mural
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-6">
            Envie fotos de trabalhos, projetos, aulas e momentos especiais no Instituto Herdar.
          </p>
          <button
            onClick={onOpenNewPhoto}
            className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-950 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Enviar Primeira Foto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo) => {
            const isLiked = likedPhotos.includes(photo.id);
            const totalLikes = photo.likes + (isLiked ? 1 : 0);

            return (
              <div 
                key={photo.id}
                className="bg-white dark:bg-[#1A1916] border border-stone-200 dark:border-stone-800 group overflow-hidden shadow-xs hover:border-stone-400 dark:hover:border-stone-600 transition-all flex flex-col justify-between"
              >
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-stone-100 dark:bg-stone-900 cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <span className="p-2 rounded-full bg-stone-900/70">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[10px] uppercase tracking-wider px-2 py-0.5">
                    {photo.eventTag}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="font-serif-title font-semibold text-stone-900 dark:text-stone-100 text-sm mb-3 line-clamp-2">
                    {photo.title}
                  </p>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <div className="truncate pr-2">
                      <span className="font-medium text-stone-800 dark:text-stone-200">{photo.photographer}</span>
                      <span className="text-stone-400 dark:text-stone-500 block text-[11px]">{photo.grade}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onTogglePhotoLike(photo.id)}
                        className={`flex items-center gap-1 transition-colors p-1 ${
                          isLiked ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                        }`}
                        title="Curtir foto"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="tabular-nums text-xs">{totalLikes}</span>
                      </button>

                      {/* Excluir foto visível SOMENTE para educadores autenticados */}
                      {isEducator && onDeletePhoto && (
                        <button
                          onClick={() => onDeletePhoto(photo.id)}
                          className="p-1 text-stone-400 hover:text-red-700 dark:hover:text-red-400 transition-colors cursor-pointer"
                          title="Excluir foto (Modo Educador)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Foto ampliada */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-xs"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#FAF8F5] dark:bg-[#1A1916] border border-stone-400 dark:border-stone-700 overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 p-1.5 bg-stone-900/80 text-white hover:bg-stone-900 transition-colors z-10 cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-stone-950 flex items-center justify-center max-h-[70vh]">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-white dark:bg-[#1A1916] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold">
                  {selectedPhoto.eventTag} · {selectedPhoto.date}
                </span>
                <h3 className="font-serif-title text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                  Foto por <strong className="text-stone-900 dark:text-stone-100">{selectedPhoto.photographer}</strong> ({selectedPhoto.grade})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTogglePhotoLike(selectedPhoto.id)}
                  className={`px-4 py-2 border flex items-center gap-2 text-xs font-semibold cursor-pointer ${
                    likedPhotos.includes(selectedPhoto.id)
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-400'
                      : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPhotos.includes(selectedPhoto.id) ? 'fill-current' : ''}`} />
                  <span>{selectedPhoto.likes + (likedPhotos.includes(selectedPhoto.id) ? 1 : 0)} Curtidas</span>
                </button>

                {/* Excluir foto ampliada SOMENTE para educadores */}
                {isEducator && onDeletePhoto && (
                  <button
                    onClick={() => {
                      onDeletePhoto(selectedPhoto.id);
                      setSelectedPhoto(null);
                    }}
                    className="px-3 py-2 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
