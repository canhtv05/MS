import * as React from 'react';

import {
  Select as SelectPrimitive,
  SelectContent as SelectContentPrimitive,
  SelectGroup as SelectGroupPrimitive,
  SelectHighlightItem as SelectHighlightItemPrimitive,
  SelectHighlight as SelectHighlightPrimitive,
  SelectItem as SelectItemPrimitive,
  SelectItemIndicator as SelectItemIndicatorPrimitive,
  SelectItemText as SelectItemTextPrimitive,
  SelectLabel as SelectLabelPrimitive,
  SelectSeparator as SelectSeparatorPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue as SelectValuePrimitive,
  SelectScrollUpButton as SelectScrollUpButtonPrimitive,
  SelectScrollDownButton as SelectScrollDownButtonPrimitive,
  SelectArrow as SelectArrowPrimitive,
  SelectIcon as SelectIconPrimitive,
  SelectViewport as SelectViewportPrimitive,
  type SelectProps as SelectPrimitiveProps,
  type SelectContentProps as SelectContentPrimitiveProps,
  type SelectGroupProps as SelectGroupPrimitiveProps,
  type SelectItemProps as SelectItemPrimitiveProps,
  type SelectLabelProps as SelectLabelPrimitiveProps,
  type SelectSeparatorProps as SelectSeparatorPrimitiveProps,
  type SelectTriggerProps as SelectTriggerPrimitiveProps,
  type SelectValueProps as SelectValuePrimitiveProps,
  type SelectItemTextProps as SelectItemTextPrimitiveProps,
  type SelectViewportProps as SelectViewportPrimitiveProps,
  type SelectIconProps as SelectIconPrimitiveProps,
  type SelectScrollUpButtonProps as SelectScrollUpButtonPrimitiveProps,
  type SelectScrollDownButtonProps as SelectScrollDownButtonPrimitiveProps,
  type SelectArrowProps as SelectArrowPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/select';
import { cn } from '@/lib/utils';
import { CheckRead, AltArrowDown, AltArrowUp } from '@solar-icons/react-perf/Outline';

type SelectProps = SelectPrimitiveProps;

function Select(props: SelectProps) {
  return <SelectPrimitive {...props} />;
}

type SelectGroupProps = SelectGroupPrimitiveProps;

function SelectGroup(props: SelectGroupProps) {
  return <SelectGroupPrimitive {...props} />;
}

type SelectValueProps = SelectValuePrimitiveProps;

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, className, ...props }, ref) => {
    // Radix UI Select.Value automatically displays the selected item's text
    // min-w-0 is required for truncate to work in flex containers
    // block display ensures the text is properly shown
    return (
      <SelectValuePrimitive
        ref={ref}
        placeholder={placeholder}
        className={cn('min-w-0 flex-1 truncate text-left block [&>span]:block', className)}
        {...props}
      />
    );
  },
);
SelectValue.displayName = 'SelectValue';

type SelectTriggerProps = SelectTriggerPrimitiveProps;

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <SelectTriggerPrimitive
        ref={ref}
        className={cn(
          'border-input ring-offset-background placeholder:text-muted-foreground flex h-10 w-full items-center justify-between rounded-md border bg-white/50 px-3 py-2 text-sm backdrop-blur-sm focus:outline-hidden focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900/50',
          className,
        )}
        {...props}
      >
        {children}
        <SelectIconPrimitive>
          <AltArrowDown className="size-4 opacity-50 shrink-0" />
        </SelectIconPrimitive>
      </SelectTriggerPrimitive>
    );
  },
);
SelectTrigger.displayName = 'SelectTrigger';

type SelectScrollUpButtonProps = SelectScrollUpButtonPrimitiveProps;

function SelectScrollUpButton({ className, ...props }: SelectScrollUpButtonProps) {
  return (
    <SelectScrollUpButtonPrimitive
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <AltArrowUp className="size-4" />
    </SelectScrollUpButtonPrimitive>
  );
}

type SelectScrollDownButtonProps = SelectScrollDownButtonPrimitiveProps;

function SelectScrollDownButton({ className, ...props }: SelectScrollDownButtonProps) {
  return (
    <SelectScrollDownButtonPrimitive
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <AltArrowDown className="size-4" />
    </SelectScrollDownButtonPrimitive>
  );
}

type SelectContentProps = SelectContentPrimitiveProps;

type SelectViewportProps = SelectViewportPrimitiveProps;
type SelectIconProps = SelectIconPrimitiveProps;

function SelectContent({
  sideOffset = 4,
  position = 'popper',
  className,
  children,
  ...props
}: SelectContentProps) {
  // Separate Arrow from other children by checking displayName or type name
  const childArray = React.Children.toArray(children);
  const isArrowElement = (child: React.ReactNode): boolean => {
    if (!React.isValidElement(child)) return false;
    const type = child.type as { displayName?: string; name?: string };
    return type.displayName === 'SelectArrow' || type.name === 'SelectArrow';
  };
  const arrowChild = childArray.find(isArrowElement);
  const otherChildren = childArray.filter(child => !isArrowElement(child));

  return (
    <SelectContentPrimitive
      sideOffset={sideOffset}
      position={position}
      className={cn(
        'bg-popover text-popover-foreground relative z-50 max-h-96 min-w-32 overflow-visible rounded-md border shadow-md outline-none',
        className,
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectViewportPrimitive
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)',
        )}
      >
        <SelectHighlightPrimitive className="absolute inset-0 z-0 rounded-sm bg-accent">
          {otherChildren}
        </SelectHighlightPrimitive>
      </SelectViewportPrimitive>
      <SelectScrollDownButton />
      {arrowChild}
    </SelectContentPrimitive>
  );
}

type SelectLabelProps = SelectLabelPrimitiveProps;

function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <SelectLabelPrimitive className={cn('px-2 py-1.5 text-sm font-medium', className)} {...props} />
  );
}

type SelectItemProps = SelectItemPrimitiveProps;

type SelectItemTextProps = SelectItemTextPrimitiveProps;
const SelectItemText = SelectItemTextPrimitive;

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, disabled, ...props }, ref) => {
    return (
      <SelectHighlightItemPrimitive disabled={disabled}>
        <SelectItemPrimitive
          ref={ref}
          disabled={disabled}
          className={cn(
            "focus:text-accent-foreground hover:cursor-pointer [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 pr-10 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            className,
          )}
          {...props}
        >
          <span className="pointer-events-none absolute right-3 flex size-3.5 items-center justify-center">
            <SelectItemIndicatorPrimitive
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckRead className="size-4" />
            </SelectItemIndicatorPrimitive>
          </span>
          <SelectItemTextPrimitive>{children}</SelectItemTextPrimitive>
        </SelectItemPrimitive>
      </SelectHighlightItemPrimitive>
    );
  },
);
SelectItem.displayName = 'SelectItem';

type SelectSeparatorProps = SelectSeparatorPrimitiveProps;

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectSeparatorPrimitive className={cn('bg-border -mx-1 my-1 h-px', className)} {...props} />
  );
}

type SelectArrowProps = SelectArrowPrimitiveProps;

function SelectArrow({ className, children, ...props }: SelectArrowProps) {
  return (
    <SelectArrowPrimitive {...props}>
      {children || (
        <svg
          width="20"
          height="10"
          viewBox="0 0 20 10"
          fill="none"
          className={cn('dark:fill-gray-800 fill-white rotate-180 -mt-[2px]', className)}
        >
          <path
            d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
            fill="inherit"
          />
          <path
            d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
            fill="var(--border)"
          />
        </svg>
      )}
    </SelectArrowPrimitive>
  );
}
SelectArrow.displayName = 'SelectArrow';

const SelectViewport = SelectViewportPrimitive;
const SelectIcon = SelectIconPrimitive;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectItemText,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectArrow,
  SelectViewport,
  SelectIcon,
  type SelectProps,
  type SelectGroupProps,
  type SelectValueProps,
  type SelectTriggerProps,
  type SelectContentProps,
  type SelectLabelProps,
  type SelectItemProps,
  type SelectItemTextProps,
  type SelectSeparatorProps,
  type SelectScrollUpButtonProps,
  type SelectScrollDownButtonProps,
  type SelectArrowProps,
  type SelectViewportProps,
  type SelectIconProps,
};
