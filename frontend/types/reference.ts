export interface LinkReference {
  type: 'link';
  link: string;
  target?: string;
  openInNewWindow?: boolean;
}

export interface PageFolderReference {
  type: 'page-folder';
  pageFolder: {
    pageFolderId: string;
    name: string;
    _urls: {
      [locale: string]: string;
    };
    _url: string;
  };
  openInNewWindow?: boolean;
}

export type Reference = LinkReference | PageFolderReference;
