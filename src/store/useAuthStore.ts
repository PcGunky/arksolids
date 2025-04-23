import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useDinoStore } from './useDinoStore';

interface AuthStore {
  user: User | null;
  profile: any | null;
  customDomain: string | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: any) => void;
  setCustomDomain: (domain: string | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  customDomain: null,
  setUser: async (user) => {
    set({ user });
    if (user) {
      useDinoStore.getState().loadCollection();
      
      // Load custom domain
      const { data } = await supabase
        .from('user_domains')
        .select('domain')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        set({ customDomain: data.domain });
      }
    }
  },
  setProfile: (profile) => set({ profile }),
  setCustomDomain: (domain) => set({ customDomain: domain }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, customDomain: null });
  },
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    useAuthStore.getState().setUser(session.user);
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setUser(session?.user || null);
});