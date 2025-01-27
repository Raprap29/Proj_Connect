import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'

const getAuthToken = () => {
  return Cookies.get('authToken');
};

const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  if(!decoded.exp){
    return false;
  }

  return decoded.exp < currentTime;
};

export { getAuthToken, isTokenExpired };