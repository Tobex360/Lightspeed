export const getUserDetails = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};