import * as React from 'react';
import { CircleAlert, Eye, EyeClosed } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePrevious from '@/hooks/use-previous';
import { Label } from './label';

interface IInputProps extends React.ComponentProps<'input'> {
  validate?: boolean;
  errorText?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  name?: string;
  label?: string;
  id?: string;
  inputSize?: 'md' | 'lg';
}

function Input({
  type,
  onBlur,
  onFocus,
  validate,
  id,
  label,
  errorText,
  required,
  icon,
  endIcon,
  className,
  name,
  inputSize = 'lg',
  ...props
}: IInputProps) {
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [typeInput, setTypeInput] = React.useState(type);
  const [touched, setTouched] = React.useState(false);

  const prevType = usePrevious(typeInput || 'text');

  const handleBlur = (value: string) => {
    if ((validate || required) && (!value || !value.trim())) {
      setIsEmpty(true);
      setTouched(true);
    } else {
      setIsEmpty(false);
    }
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setTypeInput(prev => (prev === 'password' ? 'text' : 'password'));
  };

  const handleFocus = () => {
    setIsEmpty(false);
    onFocus?.();
    setTouched(false);
  };

  const isInvalid = (validate || required) && touched && isEmpty;

  return (
    <>
      <div className="mb-0">
        <Label htmlFor={id} className="mb-1 text-foreground/60 text-sm flex gap-1">
          {label}
          {required && <span className="text-[10px] text-red-500">(*)</span>}
        </Label>
        <div
          className={cn(
            'flex items-center relative rounded-xl border border-input bg-background group',
            'focus-within:border-purple-300',
            isInvalid && 'border-red-500',
            className,
          )}
        >
          {icon && (
            <div className={cn('px-3 h-10 grid place-items-center', inputSize === 'lg' && 'h-11')}>
              {icon}
            </div>
          )}
          <input
            type={typeInput}
            data-slot="input"
            className={cn(
              'rounded-xl h-full p-2.5 bg-background border text-foreground focus:outline-none focus:border-purple-300',
              'file:text-foreground placeholder:text-foreground/50 dark:bg-background flex w-full min-w-0 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              'focus-visible:transform focus-visible:placeholder:translate-x-0.5 not-focus-visible:placeholder:-translate-x-0.5 focus-visible:placeholder:transition-transform focus-visible:placeholder:duration-150 not-focus-visible:placeholder:duration-150',
              'placeholder:pl-1 text-foreground mt-0! dark:text-secondary-foreground disabled:border-[rgba(255 255 255 0.15)] disabled:bg-[#efefef] placeholder:text-[rgb(110,107,123)/50]',
              !!validate && isEmpty && 'border-red-500',
              (typeInput === 'password' || prevType === 'password') && 'pr-11',
              className,
              (icon || endIcon) &&
                'border-none shadow-none bg-transparent! focus-visible:ring-0 focus-visible:shadow-none py-0',
              icon && 'pl-1!',
              endIcon && 'pr-1!',
              icon && !endIcon && 'pr-3!',
              !icon && endIcon && 'pl-3!',
              isInvalid && 'border-red-500',
              inputSize === 'lg' && 'p-3',
            )}
            onBlur={e => handleBlur(e.target.value)}
            onFocus={handleFocus}
            name={name}
            autoComplete={props.autoComplete ?? 'on'}
            id={id}
            {...props}
          />
          {endIcon && (
            <div className={cn('px-3 h-10 grid place-items-center', inputSize === 'lg' && 'h-11')}>
              {endIcon}
            </div>
          )}

          {isEmpty && !!validate && (
            <CircleAlert
              className={`absolute ${
                typeInput === 'password' || prevType === 'password' || type === 'password'
                  ? 'right-12'
                  : 'right-4'
              } top-1/2 -translate-y-1/2 size-3.5 stroke-red-500`}
            />
          )}

          {type === 'password' && (
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 size-4 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {typeInput === 'password' ? (
                <Eye className="absolute right-0 top-1/2 -translate-y-1/2 size-4 cursor-pointer stroke-[#6e6b7b]" />
              ) : (
                <EyeClosed className="absolute right-0 top-1/2 -translate-y-1/2 size-4 cursor-pointer stroke-[#6e6b7b]" />
              )}
            </div>
          )}
        </div>
      </div>
      {isEmpty && !!validate && touched && (
        <span className="text-[12px] text-red-500 font-light text-left">Thông tin bắt buộc</span>
      )}
      {!touched && (
        <span className="text-[12px] text-red-500 font-light text-left">{errorText}</span>
      )}
    </>
  );
}

export { Input };
