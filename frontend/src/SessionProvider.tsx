import { createContext, useEffect, useState } from 'react';
import { authRepository } from './repositories/auth';
import { User } from '@supabase/supabase-js';

type SessionProviderProps = {
  children: React.ReactNode;
};

type SessionContextType = [
  User | null,
  React.Dispatch<React.SetStateAction<User | null>> | null,
];

const SessionContext = createContext<SessionContextType>([null, null]);

function SessionProvider({ children }: SessionProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession();
  }, []);

  const setSession = async () => {
    const currentUser = await authRepository.getCurrentUser();
    setCurrentUser(currentUser);
    setIsLoading(false);
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <SessionContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </SessionContext.Provider>
  );
}

export { SessionContext, SessionProvider };
