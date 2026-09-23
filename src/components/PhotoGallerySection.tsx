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
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoSubmission | null>(null);

  return (
    <section id="fotos" className="my-14 pt-10 border-t-2 border-stone-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-semibold mb-1">
            <Camera className="w-3.5 h-3.5 text-stone-700" />
            <span>Mural de Fotos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900">
            Fotos da Escola
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Fotos tiradas por alunos e professores no dia a dia do Instituto Herdar.
          </p>
        </div>

        <button
          onClick={onOpenNewPhoto}
          className="px-4 py-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enviar Foto</span>
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="bg-white border border-stone-200 p-8 sm:p-12 text-center">
          <Camera className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="font-serif-title text-xl font-semibold text-stone-800 mb-2">
            Ainda não há fotos no mural
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
            Envie fotos de trabalhos, aulas, momentos no pátio e projetos no Instituto Herdar.
          </p>
          <button
            onClick={onOpenNewPhoto}
            className="px-5 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
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
                className="bg-white border border-stone-200 group overflow-hidden shadow-xs hover:border-stone-400 transition-all flex flex-col justify-between"
              >
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer"
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
                  <p className="font-serif-title font-semibold text-stone-900 text-sm mb-3 line-clamp-2">
                    {photo.title}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <div className="truncate pr-2">
                      <span className="font-medium text-stone-800">{photo.photographer}</span>
                      <span className="text-stone-400 block text-[11px]">{photo.grade}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onTogglePhotoLike(photo.id)}
                        className={`flex items-center gap-1 transition-colors p-1 ${
                          isLiked ? 'text-rose-600 font-medium' : 'text-stone-400 hover:text-stone-700'
                        }`}
                        title="Curtir foto"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="tabular-nums text-xs">{totalLikes}</span>
                      </button>

                      {onDeletePhoto && (
                        <button
                          onClick={() => onDeletePhoto(photo.id)}
                          className="p-1 text-stone-400 hover:text-red-700 transition-colors"
                          title="Excluir foto"
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
            className="max-w-4xl w-full bg-[#FAF8F5] border border-stone-400 overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 p-1.5 bg-stone-900/80 text-white hover:bg-stone-900 transition-colors z-10"
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

            <div className="p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
                  {selectedPhoto.eventTag} · {selectedPhoto.date}
                </span>
                <h3 className="font-serif-title text-xl font-bold text-stone-900 mt-1">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Foto por <strong>{selectedPhoto.photographer}</strong> ({selectedPhoto.grade})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTogglePhotoLike(selectedPhoto.id)}
                  className={`px-4 py-2 border flex items-center gap-2 text-xs font-semibold cursor-pointer ${
                    likedPhotos.includes(selectedPhoto.id)
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPhotos.includes(selectedPhoto.id) ? 'fill-current' : ''}`} />
                  <span>{selectedPhoto.likes + (likedPhotos.includes(selectedPhoto.id) ? 1 : 0)} Curtidas</span>
                </button>

                {onDeletePhoto && (
                  <button
                    onClick={() => {
                      onDeletePhoto(selectedPhoto.id);
                      setSelectedPhoto(null);
                    }}
                    className="px-3 py-2 border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
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
