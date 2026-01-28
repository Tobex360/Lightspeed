export const getDriverDetails = () => {
  const driver = localStorage.getItem('drivers');
  return driver ? JSON.parse(driver) : null;
};