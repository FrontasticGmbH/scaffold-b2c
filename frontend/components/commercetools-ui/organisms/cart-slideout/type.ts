import { ImageProps } from 'frontastic/lib/image';
import { Link } from '../header/types';

export interface CartSlideoutProps {
  emptyStateImage: ImageProps;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  emptyStateCategories: Link[];
  handleCategoryClick?: () => void;
}
