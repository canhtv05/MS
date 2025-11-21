'use client';

import { Checkbox, CheckboxIndicator, CheckboxProps } from '../animate-ui/primitives/base/checkbox';
import { Label } from './label';

interface ICheckBockProps extends CheckboxProps {
  indeterminate?: boolean;
  content?: string;
}

const CheckBox = ({ indeterminate, content, ...props }: ICheckBockProps) => {
  return (
    <Label className="flex items-center gap-x-3">
      <Checkbox
        {...props}
        indeterminate={indeterminate}
        className="size-4 flex cursor-pointer justify-center items-center border [&[data-checked],&[data-indeterminate]]:bg-cyan-600 [&[data-checked],&[data-indeterminate]]:text-primary-foreground transition-colors duration-500"
      >
        <CheckboxIndicator className="size-3 stroke-white" />
      </Checkbox>
      <span className="text-foreground/60">{content}</span>
    </Label>
  );
};

export default CheckBox;
