import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils/styles';

type ChipProps<T extends React.ElementType> = VariantProps<typeof ChipVariants> & {
  as?: T;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

const Chip = <T extends React.ElementType = 'div'>({
  as,
  size,
  state,
  hierarchy,
  className,
  children,
  ...props
}: ChipProps<T>) => {
  const Component = as || 'div';

  return (
    <Component className={cn(ChipVariants({ size, state, hierarchy }), className)} {...props}>
      {children}
    </Component>
  );
};

const ChipVariants = cva('px-3 py-[10px] rounded-[22px] inline-flex font-semibold', {
  defaultVariants: {
    size: 'medium',
    hierarchy: 'primary',
    state: 'inactive',
  },
  variants: {
    hierarchy: {
      primary: '',
    },
    size: {
      medium: 'text-[14px]',
    },
    state: {
      active: '',
      inactive: '',
    },
  },
  compoundVariants: [
    {
      hierarchy: 'primary',
      state: 'active',
      className: 'bg-[#4D4D4D] text-white',
    },
    {
      hierarchy: 'primary',
      state: 'inactive',
      className: 'bg-[#EEEEEE] text-[#3F3F3F]',
    },
  ],
});

export default Chip;
