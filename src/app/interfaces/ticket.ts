export interface Ticket {
  id_ticket: number;
  user_id: number;
  campo: number;
  message: string;
  fecha: Date;
  code: string;
  ticket_refer?: string;
  respondido: boolean;
}