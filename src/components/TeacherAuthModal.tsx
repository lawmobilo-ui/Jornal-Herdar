import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle 
} from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { TeacherAuth } from '../types/newspaper';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (auth: TeacherAuth) => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [teacherName, setTeacherName] = useState('');
  const [teacherRole, setTeacherRole] = useState('Professor(a)');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // 1. Entrar com Google em 1 clique sem senha
  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const authData: TeacherAuth = {
        isAuthenticated: true,
        teacherName: user.displayName || 'Professor(a) Herdar',
        role: 'Professor(a)',
      };
      onSuccess(authData);
      onClose();
    } catch (err: any) {
      console.warn('Google sign-in error or cancelled', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMessage('Não foi possível entrar com o Google. Você pode colocar seu nome no campo abaixo.');
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  // 2. Colocar nome sem senha
  const handleQuickIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      setErrorMessage('Por favor, informe seu nome de professor(a).');
      return;
    }

    const authData: TeacherAuth = {
      isAuthenticated: true,
      teacherName: teacherName.trim(),
      role: teacherRole.trim() || 'Professor(a)',
    };
    onSuccess(authData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] text-stone-900 border border-stone-300 w-full max-w-md shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold block">Área do Professor</span>
            <h3 className="font-serif-title text-xl font-bold text-stone-900">
              Acesso dos Professores
            </h3>
          </div>
        </div>

        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          Sem senhas: entre com sua conta Google ou coloque seu nome e matéria para publicar comunicados e gerenciar o jornal.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Botão Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoadingGoogle}
          className="w-full py-3 px-4 bg-white border border-stone-300 hover:border-stone-800 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2.5 shadow-xs transition-colors cursor-pointer mb-5 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isLoadingGoogle ? 'Conectando ao Google...' : 'Entrar com Conta Google (1 Clique)'}</span>
        </button>

        <div className="relative flex py-2 items-center mb-5">
          <div className="grow border-t border-stone-200"></div>
          <span className="shrink mx-3 text-stone-400 text-[11px] uppercase tracking-wider">ou coloque seu nome</span>
          <div className="grow border-t border-stone-200"></div>
        </div>

        {/* Colocar nome sem senha */}
        <form onSubmit={handleQuickIdentify} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
              Seu Nome de Professor(a) *
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Ex: Prof. Thiago"
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:border-stone-800 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
              Sua Matéria ou Cargo
            </label>
            <input
              type="text"
              value={teacherRole}
              onChange={(e) => setTeacherRole(e.target.value)}
              placeholder="Ex: História / Matemática / Coordenação"
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:border-stone-800 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <UserCheck className="w-4 h-4 text-amber-300" />
            <span>Entrar como Professor</span>
          </button>
        </form>
      </div>
    </div>
  );
};
