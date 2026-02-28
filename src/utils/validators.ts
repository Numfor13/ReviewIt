export const validateCameroonPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};