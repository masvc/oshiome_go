import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  name?: string;
}

// モック用の認証フック
export const useAuth = () => {
  const [user] = useState<User | null>({
    id: '1',
    email: 'demo@example.com',
    name: 'デモユーザー',
  });

  return {
    user,
    loading: false,
    signOut: () => {},
  };
};
