import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Role = 'Manager' | 'Broker';

export interface UserProfile {
  name: string;
  subtitle: string;
  role: Role;
  avatarUrl: string;
}

interface UserContextType {
  user: UserProfile;
  role: Role;
  setRole: (role: Role) => void;
}

const USERS: Record<Role, UserProfile> = {
  Manager: {
    name: 'Nguyễn Quản Lý',
    subtitle: 'Quản lý - VPS Securities',
    role: 'Manager',
    avatarUrl: 'https://ui-avatars.com/api/?name=Manager&background=7C3AED&color=fff',
  },
  Broker: {
    name: 'Trần Văn Broker',
    subtitle: 'Broker - VPS Securities',
    role: 'Broker',
    avatarUrl: 'https://ui-avatars.com/api/?name=Broker&background=0EA5E9&color=fff',
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userRole') as Role | null;
      return saved || 'Manager';
    }
    return 'Manager';
  });

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  const user = USERS[role];

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  return (
    <UserContext.Provider value={{ user, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
