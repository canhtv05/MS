import * as React from 'react';
import { CircleAlert, Eye, EyeClosed } from 'lucide-react';
import { cn } from '@/lib/utils';
import usePrevious from '@/hooks/use-previous';

function Input({
  className,
  validate,
  errorText,
  onFocus,
  onBlur,
  type,
  name,
  icon,
  ...props
}: React.ComponentProps<'input'> & {
  validate?: boolean;
  errorText?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  icon?: React.ReactNode;
  name?: string;
}) {
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [typeInput, setTypeInput] = React.useState(type);
  const [touched, setTouched] = React.useState(false);

  const prevType = usePrevious(typeInput || 'text');

  const handleBlur = (value: string) => {
    if (!value.trim() || value.trim().startsWith(' ')) {
      setIsEmpty(true);
      setTouched(true);
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

  const isInvalid = validate && touched;

  return (
    <>
      <div className="relative">
        <div
          className={cn(
            icon &&
              'flex items-center border border-input rounded-sm focus-within:ring-primary focus-within:ring-[0.5px] focus-within:shadow-lg focus-within:border-primary',
          )}
        >
          {icon && <div className="px-3 h-9 border-r grid place-items-center">{icon}</div>}
          <input
            type={typeInput}
            data-slot="input"
            className={cn(
              'file:text-foreground placeholder:text-foreground/50 dark:bg-input/30 flex h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[0.5px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              'focus-visible:transform focus-visible:placeholder:translate-x-0.5 not-focus-visible:placeholder:-translate-x-0.5 focus-visible:placeholder:transition-transform focus-visible:placeholder:duration-150 not-focus-visible:placeholder:duration-150',
              'focus-visible:shadow-lg placeholder:pl-1 text-foreground mt-0! dark:text-secondary-foreground disabled:border-[rgba(255 255 255 0.15)] disabled:bg-[#efefef] placeholder:text-[rgb(110,107,123)/50] border-border',
              validate && isEmpty && 'border-red-500',
              (typeInput === 'password' || prevType === 'password') && 'pr-11',
              className,
              icon && 'border-none shadow-none focus-visible:ring-0 focus-visible:shadow-none py-0',
              isInvalid && 'border-red-500',
            )}
            onBlur={e => handleBlur(e.target.value)}
            onFocus={handleFocus}
            name={name}
            autoComplete={props.autoComplete ?? 'on'}
            {...props}
          />
        </div>

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
      {isEmpty && !!validate && (
        <span className="text-[12px] text-red-500 font-light text-left">Thông tin bắt buộc</span>
      )}
      <span className="text-[12px] text-red-500 font-light text-left">{errorText}</span>
    </>
  );
}

export { Input };
