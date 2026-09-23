import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  AlertCircle 
} from 'lucide-react';
import { TeacherAuth } from '../types/newspaper';
import { verifyEducatorPassword } from '../utils/authPasswords';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (auth: TeacherAuth) => void;
  titleMessage?: string;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  titleMessage,
}) => {
  const [educatorName, setEducatorName] = useState('');
  const [educatorRole, setEducatorRole] = useState('Educador(a)');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!educatorName.trim()) {
      setErrorMessage('Por favor, informe seu nome de educador(a).');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Por favor, digite a senha de educador.');
      return;
    }

    const isValid = verifyEducatorPassword(password);
    if (!isValid) {
      setErrorMessage('Senha incorreta! Verifique com a coordenação (senha padrão: herdar ou herdar2026).');
      return;
    }

    const authData: TeacherAuth = {
      isAuthenticated: true,
      teacherName: educatorName.trim(),
      role: educatorRole.trim() || 'Educador(a)',
      loginTime: new Date().toLocaleTimeString('pt-BR'),
    };

    onSuccess(authData);
    setPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] dark:bg-[#1A1916] text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-800 w-full max-w-md shadow-2xl p-6 sm:p-8 relative transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-stone-900 dark:bg-stone-800 text-amber-300 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block">Área Restrita</span>
            <h3 className="font-serif-title text-xl font-bold text-stone-900 dark:text-stone-100">
              Acesso dos Educadores
            </h3>
          </div>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 mb-5 leading-relaxed">
          {titleMessage || 'Digite seu nome e a senha de educador para gerenciar o jornal, publicar avisos e ter permissão para excluir publicações.'}
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário com Senha */}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-semibold mb-1">
              Seu Nome de Educador(a) *
            </label>
            <input
              type="text"
              value={educatorName}
              onChange={(e) => setEducatorName(e.target.value)}
              placeholder="Ex: Educador Thiago / Mariana"
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#22201D] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:border-stone-800 dark:focus:border-amber-400 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-semibold mb-1">
              Sua Matéria ou Função
            </label>
            <input
              type="text"
              value={educatorRole}
              onChange={(e) => setEducatorRole(e.target.value)}
              placeholder="Ex: Educador(a) / Coordenação"
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#22201D] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:border-stone-800 dark:focus:border-amber-400 focus:outline-hidden"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-semibold">
                Senha de Educador *
              </label>
              <span className="text-[11px] text-stone-400 dark:text-stone-500">Padrão: herdar</span>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha..."
                className="w-full pl-3 pr-10 py-2 text-xs bg-white dark:bg-[#22201D] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:border-stone-800 dark:focus:border-amber-400 focus:outline-hidden"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-950 text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <KeyRound className="w-4 h-4 text-amber-300 dark:text-amber-600" />
              <span>Entrar com Senha</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
