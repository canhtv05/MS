'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
} from '@/components/animate-ui/primitives/buttons/button';
import { cn } from '@/lib/utils';
import { Particles, ParticlesEffect } from '@/components/animate-ui/primitives/effects/particles';

const buttonVariants = cva(
  "inline-flex relative items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:opacity-90 overflow-hidden before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none",
  {
    variants: {
      variant: {
        default: 'bg-primary shadow-none border-none text-white hover:opacity-90',
        accent: 'bg-accent text-accent-foreground shadow-xs hover:opacity-90',
        destructive:
          'bg-destructive text-white shadow-xs hover:opacity-90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:opacity-80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'size-9',
        xs: "size-7 [&_svg:not([class*='size-'])]:size-3.5 rounded-md",
        sm: 'size-8 rounded-md',
        lg: 'size-10 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type IconButtonProps = Omit<ButtonPrimitiveProps, 'asChild'> &
  VariantProps<typeof buttonVariants> & {
    children?: React.ReactNode;
  };

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, onClick, variant, size, children, ...props }, ref) => {
    const [isActive, setIsActive] = React.useState(false);
    const [key, setKey] = React.useState(0);

    return (
      <Particles asChild animate={isActive} key={key}>
        <ButtonPrimitive
          data-slot="icon-button"
          ref={ref}
          className={cn('cursor-pointer', buttonVariants({ variant, size, className }))}
          onClick={e => {
            setKey(prev => prev + 1);
            setIsActive(true);
            onClick?.(e);
          }}
          {...props}
        >
          {children}
          <ParticlesEffect data-variant={variant} className="bg-purple-300 size-1 rounded-full" />
        </ButtonPrimitive>
      </Particles>
    );
  },
);
IconButton.displayName = 'IconButton';

export { IconButton, buttonVariants, type IconButtonProps };
