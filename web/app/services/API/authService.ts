import { api } from './api';

export async function signIn(email:string, password:string) {
  const response = await api.post('/auth/login', { email, password });
  
  const { token, user } = response.data;

  localStorage.setItem('@RealIT:token', token);
  localStorage.setItem('@RealIT:user', JSON.stringify(user));

  return response.data;
}