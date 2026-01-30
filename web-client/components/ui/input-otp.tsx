'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';

import { cn } from '@/lib/utils';
import { Label } from './label';
import { MinusIcon } from '../animate-ui/icons';

interface InputOTPProps {
  id: string;
  pattern?: string;
  label: string;
  required?: boolean;
  errorText?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
  desc?: string;
}

function InputOTPPrimitive({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn('flex items-center gap-2 has-disabled:opacity-50', containerClassName)}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-group" className={cn('flex items-center', className)} {...props} />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]',
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      id,
      label,
      required,
      errorText,
      maxLength = 4,
      onFocus,
      onChange,
      onBlur,
      desc,
      pattern,
      ...props
    }: InputOTPProps,
    ref,
  ) => {
    return (
      <div className="flex flex-col" ref={ref}>
        <Label htmlFor={id} className="mb-1 text-label text-sm flex gap-1">
          {label}
          {required && <span className="text-[10px] text-red-500">(*)</span>}
          <span className="text-foreground text-[13px] ml-3">{desc}</span>
        </Label>
        <InputOTPPrimitive
          maxLength={maxLength}
          pattern={pattern}
          {...props}
          id={id}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <InputOTPGroup className="space-x-2">
            {Array.from({ length: maxLength })
              .fill(null)
              .map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="rounded-md border border-border bg-white text-label text-sm w-10 h-10"
                />
              ))}
          </InputOTPGroup>
        </InputOTPPrimitive>
        {!!errorText?.trim() && (
          <span className="text-[12px] text-red-500 font-light">{errorText}</span>
        )}
      </div>
    );
  },
);

InputOTP.displayName = 'InputOTPLabel';

export { InputOTP, InputOTPPrimitive, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
