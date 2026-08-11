import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  role: null,
  requiresPasswordChange: false,
  loading: true,

  hydrate: () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const reqPassStr = localStorage.getItem('requiresPasswordChange');
    const requiresPasswordChange = reqPassStr === 'true';
    let user = null;
    const raw = localStorage.getItem('userData');
    if (raw) {
      try { user = JSON.parse(raw); } catch {}
    }
    set({ user, token, role, requiresPasswordChange, loading: false });
  },

  login: (user, token, role, requiresPasswordChange = false) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('requiresPasswordChange', String(requiresPasswordChange));
    set({ user, token, role, requiresPasswordChange });
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null, role: null, requiresPasswordChange: false });
  },

  updateUser: (user) => {
    localStorage.setItem('userData', JSON.stringify(user));
    set({ user });
  },
  
  clearPasswordChangeFlag: () => {
    localStorage.setItem('requiresPasswordChange', 'false');
    set({ requiresPasswordChange: false });
  }
}));

export default useAuthStore;
