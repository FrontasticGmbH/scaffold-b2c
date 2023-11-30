export interface Token {
  token: string;
  expirationTime?: number;
  refreshToken?: string;
}
