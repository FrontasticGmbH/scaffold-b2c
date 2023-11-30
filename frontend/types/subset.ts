export type Subset<T> = { [P in keyof T]?: T[P] extends object ? Subset<T[P]> : T[P] };
