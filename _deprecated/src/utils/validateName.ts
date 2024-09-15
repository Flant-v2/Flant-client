const forbiddenRegex = /['",<>{}\[\]]/; 
export const isValidName = (name:string) => {

  const trimmedName = name.trim();

  if (!trimmedName) {
    return false;
  }

  if (forbiddenRegex.test(trimmedName)) {
    return false;
  }

  if (trimmedName.toLowerCase().includes('admin')) {
    return false;
  }

  return true;
};
