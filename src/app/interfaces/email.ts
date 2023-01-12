export interface Email {
  idEmail?: string;
  from: string;
  to: string;
  date: string;
  body: string;
  subject: string;
  unread?: boolean;
  answered?: boolean;
  responseDate?: string;
  attachments?: string[];
  deleted?: boolean;
  favorite?: boolean;
  label?: 'Inscription' | 'Avisos' | 'Comunicación' | 'Empresa';
}