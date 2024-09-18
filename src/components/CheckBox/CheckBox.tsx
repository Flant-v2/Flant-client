import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils/styles';

type CheckBoxProps = VariantProps<typeof CheckBoxVariants> & {
  className?: string;
  onCheckedChange: (checked: boolean) => void;
} & React.ComponentPropsWithoutRef<'input'>;

function CheckBox({
  className,
  size1,
  disabled,
  checked,
  onCheckedChange,
  ...props
}: CheckBoxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      className={cn(CheckBoxVariants({ size1, disabled, checked }), className)}
      onChange={e => {
        onCheckedChange(e.target.checked);
      }}
      {...props}
    >
      CheckBox
    </input>
  );
}

const CheckBoxVariants = cva(
  `aspect-square appearance-none rounded-full before:content-['✓'] before:flex 
  before:justify-center before:items-center before:text-white before:w-full before:h-full`,
  {
    variants: {
      size1: {
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
      size1: 'medium',
      disabled: false,
      checked: false,
    },
    compoundVariants: [],
  }
);

export default CheckBox;
