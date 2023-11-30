import { linkReferenceOne } from './mockCommonData';

const footerLinkOne = {
  name: 'Careers',
  reference: linkReferenceOne,
};

const footerLinkTwo = {
  name: 'About us',
  reference: linkReferenceOne,
};

const footerLinksOne = new Array(4).fill(footerLinkOne);
const footerLinksTwo = new Array(4).fill(footerLinkTwo);

const footerSocialMedia = {
  logo: {
    media: {
      file: 'https://res.cloudinary.com/dlwdq84ig/image/upload/v1663076081/twdj7ucrddbfgahsuh89.png',
      height: 24,
      mediaId: 'twdj7ucrddbfgahsuh89',
      name: 'Social Media Logo',
      width: 24,
    },
  },
  reference: linkReferenceOne,
};

export const footerColumns = [
  { header: 'My pages', links: footerLinksOne },
  { header: 'Terms & conditions', links: footerLinksTwo },
  { header: 'Customer service', links: footerLinksOne },
  { header: 'Work with us', links: footerLinksTwo },
];

export const footerLogo = {
  media: {
    file: 'https://res.cloudinary.com/dlwdq84ig/image/upload/v1676462532/mx6h9pe3i5qskpxvy17z.png',
    mediaId: 'mx6h9pe3i5qskpxvy17z',
    name: 'Logo',
    width: 4975,
    height: 481,
  },
};

export const footerSocialMediaLinks = new Array(3).fill(footerSocialMedia);
