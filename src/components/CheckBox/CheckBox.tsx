'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils/styles';

type CheckBoxProps = VariantProps<typeof CheckBoxVariants> & {
  onCheckedChange: (checked: boolean) => void;
} & Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'onChange'>;

const CheckBox = ({
  className,
  size,
  disabled,
  checked,
  onCheckedChange,
  ...props
}: CheckBoxProps) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      className={cn(CheckBoxVariants({ size, disabled, checked }), className)}
      onChange={e => {
        onCheckedChange(e.target.checked);
      }}
      {...props}
    />
  );
};

const CheckBoxVariants = cva(
  `aspect-square appearance-none rounded-full before:content-['✓'] before:flex 
  before:justify-center before:items-center before:text-white before:w-full before:h-full`,
  {
    variants: {
      size: {
        medium: 'w-[24px] before:font-[600]',
        large: 'w-[36px] before:font-[700]',
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer',
      },
      checked: {
        true: 'bg-[#3e3e3e]',
        false: 'bg-[#d8d8d8]',
      },
    },
    defaultVariants: {
      size: 'medium',
      disabled: false,
      checked: false,
    },
  }
);

export default CheckBox;
