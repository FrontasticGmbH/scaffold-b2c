import { Reference } from 'types/reference';

export const resolveReferenceTarget = (reference: Reference) => {
  switch (reference.type) {
    case 'link':
      return reference.link || reference.target;
    case 'page-folder':
      return reference.pageFolder._url;
    default:
      return '/';
  }
};

export const resolveReferenceProps = (reference: Reference) => {
  if (reference.openInNewWindow) {
    return {
      target: '_blank',
      rel: 'noopener',
    };
  }

  return {};
};
