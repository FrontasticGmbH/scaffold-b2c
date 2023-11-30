import { InstantSearchServerState } from 'react-instantsearch-hooks';
import { Category } from 'shared/types/product/Category';

type ViewData = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\ViewData';
  dataSources: DataSources | null;
};
export type DataSources = {
  [key: string]: Record<string, unknown>;
};

type Node = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Node';
  nodeId: string;
};
type Page = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Page';
  pageId: string;
  regions: Regions;
};
type Page2 = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Page';
  pageId: string;
  sections: Regions2;
};
type Regions = {
  footer: Footer;
  main: Main;
  head: Head;
};
type Regions2 = {
  footer: Footer2;
  main: Main2;
  head: Head2;
  kit: Kit;
};
type Footer = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Region';
  elements: Cell[];
};
type Head = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Region';
  elements: Cell[];
};
type Main = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Region';
  elements: Cell[];
};
type Footer2 = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Region';
  layoutElements: Cell[];
};
type Head2 = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Region';
  layoutElements: Cell[];
};
type Main2 = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Region';
  layoutElements: Cell[];
};
type Kit = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Region';
  layoutElements: Cell[];
};
export type Cell = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Cell';
  layoutElementId: string;
  configuration: CellConfiguration;
  tastics: Tastic[];
};
export type CellConfiguration = {
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Cell\\Configuration';
  size: number;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
};
export type TasticData = {
  tasticId: string;
  tasticType: string;
  configuration: TasticConfiguration;
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Tastic';
};
// Deprecated. Should be removed.
// Type TasticData should be used (more descriptive)
export type Tastic = {
  tasticId: string;
  tasticType: string;
  configuration: TasticConfiguration;
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Tastic';
};

export type TasticConfiguration = {
  desktop: boolean;
  mobile: true;
  stream?: string;
  tablet: boolean;
  _type: 'Frontastic\\Catwalk\\FrontendBundle\\Domain\\Tastic\\Configuration';
  [key: string]: any;
};

export type FrontasticRoute = {
  data: ViewData;
  node: Node;
  page: Page;
};
export type FrontasticRoute2 = {
  data: ViewData;
  node: Node;
  page: Page2;
};
export type TasticRegistry = {
  [key: string]: React.ElementType;
};
// this is weird. need to think more about this *marcel
export type TasticWrapperProps = {
  dataSources: DataSources | null;
  tastics: TasticRegistry;
  data: TasticData;
  categories: Category[];
  pageFolder: PageFolder;
  highlight?: boolean;
  serverState?: InstantSearchServerState;
  serverUrl: string;
  previewId?: string;
};
export interface DataSourceConfiguration {
  dataSourceId: string;
  type: string;
  name: string;
  configuration: any;
}
export interface PageFolder {
  pageFolderId: string;
  isDynamic: boolean;
  pageFolderType: string;
  configuration: any;
  dataSourceConfigurations: DataSourceConfiguration[];
  name?: string;
  /**
   * Materialized path of IDs of ancestor page folders.
   */
  ancestorIdsMaterializedPath: string;
  /**
   * Depth of this page folder in the page folder tree.
   */
  depth: number;
  /**
   * Sort order in the page folder tree.
   */
  sort: number;
}

export interface PageDataResponse {
  pageFolder: PageFolder;
  page: Page2;
  data: ViewData;
}
export interface PageFolderBreadcrumb {
  pageFolderId: string;
  pathTranslations: any;
  ancestorIdsMaterializedPath: string;
}
export interface PageFolderStructureValue {
  pageFolderId: string;
  pageFolderType: string;
  configuration: any;
  dataSourceConfigurations: DataSourceConfiguration[];
  name?: string;
  /**
   * Materialized path of IDs of ancestor page folders.
   */
  ancestorIdsMaterializedPath: string;
  /**
   * Depth of this page folder in the page folder tree.
   */
  depth: number;
  /**
   * Sort order in the page folder tree.
   */
  sort: number;
  breadcrumbs: PageFolderBreadcrumb[];
  _urls: string[];
  _url: string;
}

export interface PageFolderStructureResponse {
  pageFolderStructure: PageFolderStructureValue[];
}
export interface PagePreviewDataResponse extends PageDataResponse {
  previewId: string;
}
export interface RedirectResponse {
  statusCode: number;
  /**
   * One of REASON_* constants
   */
  reason: string;
  /**
   * One of TARGET_TYPE_* constants
   */
  targetType: string;
  /**
   * The target url or path
   */
  target: string;
}
