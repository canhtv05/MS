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

function SelectValue(props: SelectValueProps) {
  return <SelectValuePrimitive {...props} />;
}

type SelectTriggerProps = SelectTriggerPrimitiveProps;

function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  return (
    <SelectTriggerPrimitive
      className={cn(
        'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-xl border bg-white/50 px-3 py-2 text-sm backdrop-blur-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900/50 [&>span]:line-clamp-1',
        className,
      )}
      {...props}
    >
      {children}
      <SelectIconPrimitive asChild>
        <AltArrowDown className="size-4 opacity-50" />
      </SelectIconPrimitive>
    </SelectTriggerPrimitive>
  );
}

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
        'bg-popover/80 text-popover-foreground relative z-50 max-h-96 min-w-32 overflow-visible rounded-xl border border-white/20 shadow-2xl backdrop-blur-xl dark:border-white/10',
        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        position === 'popper' &&
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectViewportPrimitive
        className={cn(
          'p-1.5',
          position === 'popper' &&
            'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)',
        )}
      >
        <SelectHighlightPrimitive className="absolute inset-x-0 z-0 rounded-lg bg-accent/50 shadow-inner ring-1 ring-white/20 dark:bg-accent dark:ring-white/10">
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

function SelectItem({ className, children, disabled, ...props }: SelectItemProps) {
  return (
    <SelectHighlightItemPrimitive disabled={disabled}>
      <SelectItemPrimitive
        disabled={disabled}
        className={cn(
          "focus:text-accent-foreground hover:cursor-pointer [\u0026_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-lg px-3 py-2 pr-10 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [\u0026_svg]:pointer-events-none [\u0026_svg]:shrink-0 [\u0026_svg:not([class*='size-'])]:size-4",
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
}

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
          className={cn('dark:fill-gray-800 fill-white rotate-180', className)}
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

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectArrow,
  type SelectProps,
  type SelectGroupProps,
  type SelectValueProps,
  type SelectTriggerProps,
  type SelectContentProps,
  type SelectLabelProps,
  type SelectItemProps,
  type SelectSeparatorProps,
  type SelectScrollUpButtonProps,
  type SelectScrollDownButtonProps,
  type SelectArrowProps,
};
