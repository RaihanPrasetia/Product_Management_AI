import { AuthContextType } from '@/utils/types/AuthContextType';
import { createContext } from 'react';

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext



