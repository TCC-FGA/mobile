export const emailValidator = (email: string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'E-mail não pode estar em branco.';
  if (!re.test(email)) return 'Ooops! o E-mail precisa ser válido.';

  return '';
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return 'Senha não pode estar em branco.';
  if (password.length < 6) return 'Senha precisa ter 6 caracteres.';

  return '';
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Nome não pode estar em branco.';
  if (/\d/.test(name)) return 'Nome não pode conter números.';
  if (name.length < 5) return 'Nome precisa ter 5 caracteres.';

  return '';
};

export const cpfValidator = (cpf: string) => {
  if (!cpf || cpf.length <= 0) return 'CPF não pode estar em branco.';
  if (cpf.length !== 11) return 'CPF precisa ter 11 dígitos.';
  return '';
};

export const confirmPasswordValidator = (password: string, confirmPassword: string) => {
  if (!confirmPassword || confirmPassword.length <= 0)
    return 'Confirmação de senha não pode estar em branco.';
  if (password !== confirmPassword) return 'Senhas não conferem.';
  return '';
};

export const phoneValidator = (phone: string) => {
  if (!phone || phone.length <= 0) return 'Telefone não pode estar em branco.';
  if (phone.length !== 11) return 'Telefone precisa ter 11 dígitos.';
  return '';
};

export const getUpdatedFields = (original: any, updated: any) => {
  const updatedFields: any = {};
  for (const key in updated) {
    if (updated[key] !== original[key]) {
      updatedFields[key] = updated[key];
    }
  }
  return updatedFields;
};
