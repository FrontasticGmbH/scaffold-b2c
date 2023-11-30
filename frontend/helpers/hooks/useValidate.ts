import { useCallback } from 'react';

const useValidate = () => {
  const validateTextExists = useCallback((name: string) => name.length >= 1, []);

  const validatePassword = useCallback((password: string) => {
    const passwordRules = new RegExp('((?=.{8,})(?=.*[A-Z]))');
    return passwordRules.test(password);
  }, []);

  const validateEmail = useCallback((email: string) => {
    const emailRules =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return emailRules.test(email);
  }, []);

  const validatePostalCode = useCallback((value: string) => Number.isInteger(Number(value)) && value.length === 5, []);

  return { validatePassword, validateEmail, validateTextExists, validatePostalCode };
};

export default useValidate;
