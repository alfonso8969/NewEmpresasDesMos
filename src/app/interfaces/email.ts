export interface Email {
  idEmail?: number;
  from: string;
  to: string;
  date: string;
  bodyText: string;
  bodyHtml: string;
  bodyEtc?: string;
  subject: string;
  unread?: boolean;
  answered?: boolean;
  responseDate?: string;
  attachments?: string[];
  deleted?: boolean;
  favorite?: boolean;
  label: 'Inscription' | 'Notices' | 'Communication' | 'Company';
}
