import { LayoutElementConfiguration } from '@frontastic/extension-types';

export interface CellProps {
  configuration: LayoutElementConfiguration;
  isHighlighted?: boolean;
  children: React.ReactNode;
  className?: string;
}
