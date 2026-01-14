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
        <SelectPrimitive.Root data-slot="select" {...props} onOpenChange={setIsOpen} />
      </SelectHighlightProvider>
    </SelectOpenProvider>
  );
}

type SelectGroupProps = React.ComponentProps<typeof SelectPrimitive.Group>;

function SelectGroup(props: SelectGroupProps) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

type SelectValueProps = React.ComponentProps<typeof SelectPrimitive.Value>;

function SelectValue(props: SelectValueProps) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

type SelectTriggerProps = Omit<React.ComponentProps<typeof SelectPrimitive.Trigger>, 'asChild'> &
  HTMLMotionProps<'button'>;

function SelectTrigger({ disabled, ...props }: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger disabled={disabled} asChild>
      <motion.button data-slot="select-trigger" data-disabled={disabled} {...props} />
    </SelectPrimitive.Trigger>
  );
}

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

function SelectContent({
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
  ...props
}: SelectContentProps) {
  const { isOpen } = useSelectOpen();

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
              key="select-content"
              data-slot="select-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={transition}
              style={{ willChange: 'opacity, transform', ...style }}
              {...props}
            />
          </SelectPrimitive.Content>
        </SelectPortal>
      )}
    </AnimatePresence>
  );
}

type SelectHighlightItemProps = HighlightItemProps;

function SelectHighlightItem(props: SelectHighlightItemProps) {
  return <HighlightItem data-slot="select-highlight-item" {...props} />;
}

type SelectItemProps = Omit<React.ComponentProps<typeof SelectPrimitive.Item>, 'asChild'> &
  HTMLMotionProps<'div'>;

function SelectItem({ value, disabled, textValue, ...props }: SelectItemProps) {
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
      ref={highlightedRef}
      value={value}
      disabled={disabled}
      textValue={textValue}
      asChild
    >
      <motion.div data-slot="select-item" data-disabled={disabled} data-value={value} {...props} />
    </SelectPrimitive.Item>
  );
}

type SelectItemTextProps = React.ComponentProps<typeof SelectPrimitive.ItemText>;

function SelectItemText(props: SelectItemTextProps) {
  return <SelectPrimitive.ItemText data-slot="select-item-text" {...props} />;
}

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

function SelectLabel(props: SelectLabelProps) {
  return <SelectPrimitive.Label data-slot="select-label" {...props} />;
}

type SelectSeparatorProps = React.ComponentProps<typeof SelectPrimitive.Separator>;

function SelectSeparator(props: SelectSeparatorProps) {
  return <SelectPrimitive.Separator data-slot="select-separator" {...props} />;
}

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

function SelectIcon(props: SelectIconProps) {
  return <SelectPrimitive.Icon data-slot="select-icon" {...props} />;
}

type SelectViewportProps = React.ComponentProps<typeof SelectPrimitive.Viewport>;

function SelectViewport(props: SelectViewportProps) {
  return <SelectPrimitive.Viewport data-slot="select-viewport" {...props} />;
}

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
