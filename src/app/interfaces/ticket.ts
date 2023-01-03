import { TicketByUser } from "./ticketByUser";

export interface Ticket {
  id_ticket: number;
  user_id: number;
  user_name?: string;
  user_img?: string;
  user_email?: string;
  campo: number;
  message: string;
  estado?: "Nuevo" | "Pendiente cerrar" |  "Completado" | "Sin datos";
  fecha: Date;
  code: string;
  ticket_refer?: string;
  respondido: number;
  ticketByUser?: TicketByUser;
  user_technical?: string;

}