export interface Option {
  name: string;
  value: string;
}

export interface ContextShape {
  selectedLanguage?: Option;
  selectedLocation?: Location;
  locations: Location[];
  onLanguageSelect: (lang: string) => void;
  onLocationSelect: (location: string) => void;
}

export interface Location {
  flagName: string;
  name: string;
  label: string;
  value: string;
  defaultLanguage: string;
  languages: Option[];
}
