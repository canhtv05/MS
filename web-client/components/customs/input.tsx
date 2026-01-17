import * as React from 'react';
import { cn } from '@/lib/utils';
import usePrevious from '@/hooks/use-previous';
import { DangerCircle, Eye, EyeClosed } from '@solar-icons/react-perf/Linear';
import { Label } from './label';
import { XIcon } from '../animate-ui/icons';

const hasInputValue = (value?: string | number | readonly string[]) => {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) {
    return value.some(item => String(item).trim().length > 0);
  }
  return String(value).trim().length > 0;
};

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
  inputSize?: 'md' | 'lg' | 'sm';
  classNameIcon?: string;
  showClear?: boolean;
  suppressHydrationWarning?: boolean;
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
  classNameIcon,
  showClear,
  value,
  defaultValue,
  onChange,
  suppressHydrationWarning,
  ...props
}: IInputProps) {
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [typeInput, setTypeInput] = React.useState(type);
  const [touched, setTouched] = React.useState(false);
  const [hasContent, setHasContent] = React.useState(() => {
    if (value !== undefined) return hasInputValue(value);
    if (defaultValue !== undefined) return hasInputValue(defaultValue);
    return false;
  });

  const prevType = usePrevious(typeInput || 'text');
  const inputRef = React.useRef<HTMLInputElement>(null);

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
  const shouldShowClear = Boolean(showClear && hasContent && !isInvalid);

  React.useEffect(() => {
    if (value === undefined) return;
    setHasContent(hasInputValue(value));
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasContent(event.target.value.trim().length > 0);
    onChange?.(event);
  };

  const handleClear = () => {
    if (!inputRef.current) return;

    const inputElement = inputRef.current;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;

    nativeInputValueSetter?.call(inputElement, '');
    const inputEvent = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(inputEvent);
    setHasContent(false);
    setIsEmpty(false);
  };

  return (
    <>
      <div className="mb-0 w-auto">
        {!!label && (
          <Label htmlFor={id} className="mb-1 text-foreground/60 text-sm flex gap-1">
            {label}
            {required && <span className="text-[10px] text-red-500">(*)</span>}
          </Label>
        )}
        <div
          className={cn(
            'flex items-center relative autofill:bg-transparent! rounded-xl border border-input bg-background group',
            'focus-within:transition-colors focus-within:duration-200 focus-within:ease-in-out',
            'focus-within:border-purple-300 focus-within:ring-1 focus-within:ring-purple-300/20',
            isInvalid && 'border-red-500 ring-1 ring-red-500/20',
            className,
            classNameIcon,
          )}
        >
          {icon && (
            <div
              className={cn(
                'px-2 h-10 grid place-items-center',
                inputSize === 'lg' && 'h-11',
                inputSize === 'sm' && 'h-6',
              )}
            >
              {icon}
            </div>
          )}
          <input
            suppressHydrationWarning={suppressHydrationWarning}
            ref={inputRef}
            type={typeInput}
            data-slot="input"
            className={cn(
              'rounded-xl autofill:bg-transparent! h-full p-2.5 bg-background border focus:outline-none',
              'transition-colors duration-200 ease-in-out focus:border-purple-300',
              'file:text-foreground placeholder:text-foreground/50 dark:bg-background flex w-full min-w-0 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-foreground/70',
              'focus-visible:transform focus-visible:placeholder:translate-x-0.5 not-focus-visible:placeholder:-translate-x-0.5 focus-visible:placeholder:transition-transform transition-transform focus-visible:placeholder:duration-150 not-focus-visible:placeholder:duration-300',
              'placeholder:pl-1 text-foreground mt-0! placeholder:transition-transform dark:text-secondary-foreground disabled:border-[rgba(255 255 255 0.15)] disabled:bg-[#efefef] placeholder:text-[rgb(110,107,123)/50]',
              !!validate && isEmpty && 'border-red-500',
              (typeInput === 'password' || prevType === 'password') && 'pr-11',
              className,
              (icon || endIcon) &&
                'border-none shadow-none bg-transparent! focus-visible:ring-0 focus-visible:shadow-none py-0 transition-none',
              icon && 'pl-1!',
              endIcon && 'pr-1!',
              icon && !endIcon && 'pr-3!',
              !icon && endIcon && 'pl-3!',
              isInvalid && 'border-red-500',
              inputSize === 'lg' && 'p-3',
              inputSize === 'sm' && 'px-3 py-1',
            )}
            onChange={handleChange}
            onBlur={e => handleBlur(e.target.value)}
            onFocus={handleFocus}
            name={name}
            autoComplete={props.autoComplete ?? 'on'}
            id={id}
            value={value}
            defaultValue={defaultValue}
            {...props}
          />
          {endIcon && (
            <div
              className={cn(
                'h-10 grid place-items-center',
                inputSize === 'lg' && 'h-11',
                inputSize === 'sm' && 'h-6',
                shouldShowClear ? 'px-0' : 'px-3',
              )}
            >
              {endIcon}
            </div>
          )}
          {shouldShowClear && (
            <div
              onClick={handleClear}
              className={cn(
                'px-3 cursor-pointer h-10 grid place-items-center',
                inputSize === 'lg' && 'h-11',
                inputSize === 'sm' && 'h-6',
              )}
            >
              <XIcon className="size-5 p-1 dark:bg-gray-700 bg-gray-200 rounded-full" />
            </div>
          )}

          {isEmpty && !!validate && (
            <DangerCircle
              className={cn(
                'absolute top-1/2 -translate-y-1/2 size-3.5 text-red-500',
                type === 'password' && 'right-12',
                type !== 'password' && (shouldShowClear || endIcon) && 'right-12',
                type !== 'password' && !shouldShowClear && !endIcon && 'right-4',
              )}
            />
          )}

          {type === 'password' && (
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 size-4 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {typeInput === 'password' ? (
                <Eye className="absolute right-0 top-1/2 -translate-y-1/2 size-4 cursor-pointer text-[#6e6b7b]" />
              ) : (
                <EyeClosed className="absolute right-0 top-1/2 -translate-y-1/2 size-4 cursor-pointer text-[#6e6b7b]" />
              )}
            </div>
          )}
        </div>
      </div>
      {isInvalid && (
        <span className="text-[12px] text-red-500 font-light text-left">
          {errorText || 'Thông tin bắt buộc'}
        </span>
      )}
    </>
  );
}

export { Input };
