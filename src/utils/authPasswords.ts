// Gerenciamento simples e seguro de senhas dos educadores do Instituto Herdar
const PASSWORDS_KEY = 'jornal_herdar_educator_passwords';

const DEFAULT_PASSWORDS = ['herdar', 'herdar2026', 'institutoherdar', 'educadorherdar'];

export const getValidPasswords = (): string[] => {
  try {
    const stored = localStorage.getItem(PASSWORDS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...new Set([...DEFAULT_PASSWORDS, ...parsed.map((p: string) => p.toLowerCase().trim())])];
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_PASSWORDS;
};

export const verifyEducatorPassword = (inputPass: string): boolean => {
  const cleanInput = inputPass.toLowerCase().trim();
  const validList = getValidPasswords();
  return validList.includes(cleanInput);
};

export const addEducatorPassword = (newPass: string): void => {
  const clean = newPass.toLowerCase().trim();
  if (!clean) return;
  const current = getValidPasswords();
  const updated = [...new Set([...current, clean])];
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(updated));
};
