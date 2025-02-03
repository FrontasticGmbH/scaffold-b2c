import type { JSX } from 'react';
export interface Fields {
  name: string;
  label: string;
  labelDesc: string;
  type: React.ComponentProps<'input'>['type'];
  className: string;
  required?: boolean;
  validate?: (value: string) => boolean;
  render?: () => JSX.Element;
}

export interface FieldsOptions {
  enableAddress2?: boolean;
  onEnableAddress2?: () => void;
}
