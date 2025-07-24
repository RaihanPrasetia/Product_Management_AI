import { AxiosResponse } from 'axios';
import api from '../axios';

interface LoginResponse {
  token: string;
  status: string;
  success: boolean;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

const authService = {
  loginUser: async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post(
        '/auth/login',
        {
          email,
          password,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Login gagal');
    }
  },
};

export default authService;
