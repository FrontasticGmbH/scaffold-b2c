export interface QuantitySelectorProps {
  value?: number;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  disabled?: boolean;
  className?: string;
  onChange?: (val: number) => void;
}
