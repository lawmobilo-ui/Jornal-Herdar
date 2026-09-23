import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Lock, AlertCircle, X, HelpCircle } from 'lucide-react';
import { TeacherAuth } from '../types/newspaper';
import { getTeacherSecretKey } from '../utils/storage';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (auth: TeacherAuth) => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passkey, setPasskey] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [department, setDepartment] = useState('Coordenação Pedagógica');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const currentSecretKey = getTeacherSecretKey();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passkey.trim()) {
      setError('Por favor, insira a chave de acesso.');
      return;
    }

    if (passkey.trim() !== currentSecretKey) {
      setError('Chave de acesso incorreta. Verifique com a coordenação do Instituto Herdar.');
      return;
    }

    const auth: TeacherAuth = {
      isAuthenticated: true,
      teacherName: teacherName.trim() || 'Docente Herdar',
      role: department,
      loginTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    onSuccess(auth);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] text-stone-900 border border-stone-300 w-full max-w-md shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 transition-colors p-1"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 border border-stone-200 text-stone-800 mb-3">
            <KeyRound className="w-6 h-6 text-amber-800" />
          </div>
          <span className="block text-xs uppercase tracking-widest text-stone-500 font-medium">Acesso Restrito</span>
          <h3 className="text-2xl font-serif-title font-semibold text-stone-900 mt-1">Sala dos Professores</h3>
          <p className="text-sm text-stone-600 mt-1">
            Espaço confidencial para docentes e coordenação do Instituto Herdar.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-1">
              Chave de Acesso Docente (Secret Key)
            </label>
            <div className="relative">
              <input
                type="password"
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  setError('');
                }}
                placeholder="Insira a chave secreta..."
                className="w-full px-3 py-2 text-sm bg-white border border-stone-300 focus:border-stone-800 focus:outline-hidden transition-colors"
                autoFocus
              />
              <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-1">
              Nome do Docente ou Orientador
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Ex: Prof. Ricardo Mello"
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 focus:border-stone-800 focus:outline-hidden transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-600 font-semibold mb-1">
              Área ou Função
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-300 focus:border-stone-800 focus:outline-hidden transition-colors"
            >
              <option value="Coordenação Pedagógica">Coordenação Pedagógica</option>
              <option value="Direção Escolar">Direção Escolar</option>
              <option value="Professor de Ciências & Tecnologia">Professor de Ciências & Tecnologia</option>
              <option value="Professor de Linguagens & Literatura">Professor de Linguagens & Literatura</option>
              <option value="Professor de Ciências Humanas">Professor de Ciências Humanas</option>
              <option value="Professor de Matemática">Professor de Matemática</option>
              <option value="Orientação Educacional">Orientação Educacional</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Autenticar no Painel Docente</span>
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-stone-200 text-center">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-stone-500 hover:text-stone-800 inline-flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Esqueceu a chave de acesso inicial?</span>
          </button>
          {showHint && (
            <p className="mt-2 text-xs text-amber-900 bg-amber-50 p-2 border border-amber-200">
              Chave padrão de fábrica: <strong className="font-mono">{currentSecretKey}</strong> (você poderá alterá-la no painel após o login).
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
