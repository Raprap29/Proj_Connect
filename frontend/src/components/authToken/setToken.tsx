import Cookies from 'js-cookie';
export const setAuthToken = (token: string) => {
    // Set a secure, HttpOnly cookie for the JWT token
    Cookies.set('authToken', token, { 
      expires: 7,
      secure: true, 
      sameSite: 'Strict',
    });
  };

export const setUserId = (id: string) => {
    Cookies.set('userId', id, {
        // secure: true,
        expires: 7,
        sameSite: 'Strict',
    })
}