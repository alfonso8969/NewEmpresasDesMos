import { FormInscription } from "./formInscription";

export interface Email {
  idEmail?: number;
  id_user?: number;
  user_name?: string;
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
  formInscription?: FormInscription;
}
