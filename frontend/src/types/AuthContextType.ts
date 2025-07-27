export type AuthContextType = {
  isAuthenticated: boolean;
  token: string;
  login: (token: string, role: string) => void;
  logout: () => void;
  loading: boolean;
  role: string;
};

export type LoginResponseUser = {
  name: string;
  avatar: string;
  role: string;
};
