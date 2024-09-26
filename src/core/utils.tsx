export const emailValidator = (email: string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'E-mail não pode estar em branco.';
  if (!re.test(email)) return 'Ooops! o E-mail precisa ser válido.';

  return '';
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return 'Senha não pode estar em branco.';

  return '';
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Nome não pode estar em branco.';

  return '';
};
