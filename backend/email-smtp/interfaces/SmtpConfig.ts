export interface SmtpConfig {
  host: string;
  port: number;
  encryption: string;
  user: string;
  password: string;
  sender: string;
  client_host: string;
}
