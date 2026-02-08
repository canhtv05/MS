/* eslint-disable react-hooks/immutability */
'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';
import { getStrictContext } from '@/lib/get-strict-context';
import { useControlledState } from '@/hooks/use-controlled-state';
import { useDataState } from '@/hooks/use-data-state';
import { Highlight, HighlightItem, HighlightItemProps, HighlightProps } from '../effects/highlight';

type SelectOpenContextType = {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
};

type SelectHighlightContextType = {
  highlightedValue: string | null;
  setHighlightedValue: (value: string | null) => void;
};

const [SelectOpenProvider, useSelectOpen] =
  getStrictContext<SelectOpenContextType>('SelectOpenContext');

const [SelectHighlightProvider, useSelectHighlight] =
  getStrictContext<SelectHighlightContextType>('SelectHighlightContext');

// Unified hook for backward compatibility
function useSelect() {
  const openContext = useSelectOpen();
  const highlightContext = useSelectHighlight();
  return { ...openContext, ...highlightContext };
}

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>;

function Select(props: SelectProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });
  const [highlightedValue, setHighlightedValue] = React.useState<string | null>(null);

  const openValue = React.useMemo(() => ({ isOpen, setIsOpen }), [isOpen, setIsOpen]);
  const highlightValue = React.useMemo(
    () => ({ highlightedValue, setHighlightedValue }),
    [highlightedValue],
  );

  return (
    <SelectOpenProvider value={openValue}>
      <SelectHighlightProvider value={highlightValue}>
        <SelectPrimitive.Root
          data-slot="select"
          open={isOpen}
          {...props}
          onOpenChange={setIsOpen}
        />
      </SelectHighlightProvider>
    </SelectOpenProvider>
  );
}

type SelectGroupProps = React.ComponentProps<typeof SelectPrimitive.Group>;

function SelectGroup(props: SelectGroupProps) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

type SelectValueProps = React.ComponentProps<typeof SelectPrimitive.Value>;

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, ...props }, ref) => {
    // Radix UI Select.Value automatically displays the selected item's text
    // We use a wrapper to ensure it renders correctly
    return <SelectPrimitive.Value ref={ref} placeholder={placeholder} {...props} />;
  },
);
SelectValue.displayName = 'SelectValue';

type SelectTriggerProps = Omit<React.ComponentProps<typeof SelectPrimitive.Trigger>, 'asChild'> &
  HTMLMotionProps<'button'>;

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ disabled, children, ...props }, ref) => {
    return (
      <SelectPrimitive.Trigger disabled={disabled} asChild>
        <motion.button ref={ref} data-slot="select-trigger" data-disabled={disabled} {...props}>
          {children}
        </motion.button>
      </SelectPrimitive.Trigger>
    );
  },
);
SelectTrigger.displayName = 'SelectTrigger';

type SelectPortalProps = React.ComponentProps<typeof SelectPrimitive.Portal>;

function SelectPortal(props: SelectPortalProps) {
  return <SelectPrimitive.Portal data-slot="select-portal" {...props} />;
}

type SelectHighlightProps = Omit<HighlightProps, 'controlledItems' | 'enabled' | 'hover'> & {
  animateOnHover?: boolean;
};

function SelectHighlight({
  transition = { type: 'spring', stiffness: 350, damping: 35 },
  ...props
}: SelectHighlightProps) {
  const { highlightedValue } = useSelectHighlight();

  return (
    <Highlight
      data-slot="select-highlight"
      click={false}
      controlledItems
      transition={transition}
      value={highlightedValue}
      {...props}
    />
  );
}

type SelectContentProps = Omit<
  React.ComponentProps<typeof SelectPrimitive.Content>,
  'forceMount' | 'asChild'
> &
  Omit<React.ComponentProps<typeof SelectPrimitive.Portal>, 'forceMount'> &
  HTMLMotionProps<'div'>;

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  (
    {
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      side,
      sideOffset,
      align,
      alignOffset,
      avoidCollisions,
      collisionBoundary,
      collisionPadding,
      arrowPadding,
      sticky,
      hideWhenDetached,
      position,
      transition = { duration: 0.2 },
      style,
      container,
      children,
      ...props
    },
    ref,
  ) => {
    const { isOpen } = useSelectOpen();

    // Filter out any props that shouldn't be passed to the DOM element
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { forceMount, ...motionProps } = props as typeof props & { forceMount?: boolean };

    return (
      <AnimatePresence>
        {isOpen && (
          <SelectPortal container={container}>
            <SelectPrimitive.Content
              asChild
              onCloseAutoFocus={onCloseAutoFocus}
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
              side={side}
              sideOffset={sideOffset}
              align={align}
              alignOffset={alignOffset}
              avoidCollisions={avoidCollisions}
              collisionBoundary={collisionBoundary}
              collisionPadding={collisionPadding}
              arrowPadding={arrowPadding}
              sticky={sticky}
              hideWhenDetached={hideWhenDetached}
              position={position}
            >
              <motion.div
                ref={ref}
                key="select-content"
                data-slot="select-content"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={transition}
                style={{
                  willChange: 'opacity, transform',
                  ...style,
                }}
                {...motionProps}
              >
                {children}
              </motion.div>
            </SelectPrimitive.Content>
          </SelectPortal>
        )}
      </AnimatePresence>
    );
  },
);
SelectContent.displayName = 'SelectContent';

type SelectHighlightItemProps = HighlightItemProps;

function SelectHighlightItem(props: SelectHighlightItemProps) {
  return <HighlightItem data-slot="select-highlight-item" {...props} />;
}

type SelectItemProps = Omit<React.ComponentProps<typeof SelectPrimitive.Item>, 'asChild'> &
  HTMLMotionProps<'div'>;

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, disabled, textValue, children, ...props }, ref) => {
    const { setHighlightedValue } = useSelectHighlight();
    const [, highlightedRef] = useDataState<HTMLDivElement>('highlighted', undefined, val => {
      if (val === true) {
        const el = highlightedRef.current;
        const v = el?.dataset.value || el?.id || null;
        if (v) setHighlightedValue(v);
      }
    });

    return (
      <SelectPrimitive.Item
        ref={node => {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref && 'current' in ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
          if (highlightedRef && 'current' in highlightedRef) {
            (highlightedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        value={value}
        disabled={disabled}
        textValue={textValue}
        asChild
      >
        <motion.div data-slot="select-item" data-disabled={disabled} data-value={value} {...props}>
          {children}
        </motion.div>
      </SelectPrimitive.Item>
    );
  },
);
SelectItem.displayName = 'SelectItem';

type SelectItemTextProps = React.ComponentProps<typeof SelectPrimitive.ItemText>;
const SelectItemText = SelectPrimitive.ItemText;

type SelectItemIndicatorProps = Omit<
  React.ComponentProps<typeof SelectPrimitive.ItemIndicator>,
  'asChild'
> &
  HTMLMotionProps<'div'>;

function SelectItemIndicator(props: SelectItemIndicatorProps) {
  return (
    <SelectPrimitive.ItemIndicator data-slot="select-item-indicator" asChild>
      <motion.div {...props} />
    </SelectPrimitive.ItemIndicator>
  );
}

type SelectLabelProps = React.ComponentProps<typeof SelectPrimitive.Label>;
const SelectLabel = SelectPrimitive.Label;

type SelectSeparatorProps = React.ComponentProps<typeof SelectPrimitive.Separator>;
const SelectSeparator = SelectPrimitive.Separator;

type SelectScrollUpButtonProps = React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>;

function SelectScrollUpButton(props: SelectScrollUpButtonProps) {
  return <SelectPrimitive.ScrollUpButton data-slot="select-scroll-up-button" {...props} />;
}

type SelectScrollDownButtonProps = React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>;

function SelectScrollDownButton(props: SelectScrollDownButtonProps) {
  return <SelectPrimitive.ScrollDownButton data-slot="select-scroll-down-button" {...props} />;
}

type SelectArrowProps = React.ComponentProps<typeof SelectPrimitive.Arrow> & {
  children?: React.ReactNode;
};

function SelectArrow({ children, ...props }: SelectArrowProps) {
  if (children) {
    return (
      <SelectPrimitive.Arrow data-slot="select-arrow" asChild {...props}>
        {children}
      </SelectPrimitive.Arrow>
    );
  }
  return <SelectPrimitive.Arrow data-slot="select-arrow" {...props} />;
}

type SelectIconProps = React.ComponentProps<typeof SelectPrimitive.Icon>;
const SelectIcon = SelectPrimitive.Icon;

type SelectViewportProps = React.ComponentProps<typeof SelectPrimitive.Viewport>;
const SelectViewport = SelectPrimitive.Viewport;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectViewport,
  SelectHighlight,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectHighlightItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectArrow,
  SelectIcon,
  useSelect,
  useSelectOpen,
  useSelectHighlight,
  type SelectProps,
  type SelectGroupProps,
  type SelectValueProps,
  type SelectTriggerProps,
  type SelectViewportProps,
  type SelectHighlightProps,
  type SelectContentProps,
  type SelectLabelProps,
  type SelectItemProps,
  type SelectItemTextProps,
  type SelectItemIndicatorProps,
  type SelectHighlightItemProps,
  type SelectSeparatorProps,
  type SelectScrollUpButtonProps,
  type SelectScrollDownButtonProps,
  type SelectArrowProps,
  type SelectIconProps,
  type SelectOpenContextType,
  type SelectHighlightContextType,
};
