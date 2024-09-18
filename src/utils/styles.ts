import clsx, { type ClassValue } from 'clsx';

export const cn = (...props: ClassValue[]) => {
  return clsx(props);
};
